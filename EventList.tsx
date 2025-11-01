import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import axios from 'axios';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { Event, EventFilters as Filters } from '../types/Event';
import { Loader, AlertCircle } from 'lucide-react';

const EventList: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied or unavailable:', error);
        }
      );
    }
  }, []);

  // Fetch events with filters
  const { data, isLoading, error, refetch } = useQuery(
    ['events', filters, userLocation],
    async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      if (userLocation) {
        params.append('userLat', userLocation.latitude.toString());
        params.append('userLng', userLocation.longitude.toString());
      }

      const response = await axios.get(`/api/events?${params}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!userLocation || !filters.location // Enable query if we have location or no location filter
    }
  );

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Events</h2>
          <p className="text-gray-600 mb-4">
            We couldn't load the events. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and join incredible events happening near you. From tech meetups to music festivals, there's something for everyone.
          </p>
        </motion.div>

        {/* Filters */}
        <EventFilters
          filters={filters}
          onFiltersChange={setFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* Events Grid */}
        <AnimatePresence>
          {!isLoading && data?.events && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {data.events.map((event: Event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Events Found */}
        {!isLoading && data?.events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Events Found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms to find more events.
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setFilters(prev => ({ ...prev, page }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    data.pagination.page === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content would go here */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
                <p className="text-gray-600">{selectedEvent.description}</p>
                {/* Add more event details */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventList;