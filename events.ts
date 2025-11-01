import express from 'express';
import Event from '../models/Event.js';
import { eventValidation } from '../utils/validation.js';

const router = express.Router();

// GET /api/events - List all events with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      location,
      category,
      search,
      dateFrom,
      dateTo,
      maxDistance = 50, // in kilometers
      userLat,
      userLng,
      sortBy = 'date',
      sortOrder = 'asc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
      if (dateTo) filter.date.$lte = new Date(dateTo as string);
    }

    // Location-based filtering with geospatial query
    if (userLat && userLng) {
      const latitude = parseFloat(userLat as string);
      const longitude = parseFloat(userLng as string);
      const maxDistanceMeters = parseFloat(maxDistance as string) * 1000;

      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistanceMeters
        }
      };
    } else if (location) {
      filter['location.name'] = { $regex: location, $options: 'i' };
    }

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Execute query
    const events = await Event.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string))
      .lean();

    // Get total count for pagination
    const total = await Event.countDocuments(filter);

    // Calculate distance for each event if user location provided
    if (userLat && userLng) {
      const userLatNum = parseFloat(userLat as string);
      const userLngNum = parseFloat(userLng as string);

      events.forEach(event => {
        event.distance = calculateDistance(
          userLatNum,
          userLngNum,
          event.location.coordinates.latitude,
          event.location.coordinates.longitude
        );
      });
    }

    res.json({
      events,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// POST /api/events - Create a new event
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error } = eventValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details 
      });
    }

    const event = new Event(req.body);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;