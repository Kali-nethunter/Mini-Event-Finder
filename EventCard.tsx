import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Event } from '../types/Event';
import { format, formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const participationPercentage = (event.currentParticipants / event.maxParticipants) * 100;
  
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Music: 'bg-purple-500',
      Sports: 'bg-green-500',
      Tech: 'bg-blue-500',
      Art: 'bg-pink-500',
      Food: 'bg-orange-500',
      Business: 'bg-indigo-500',
      Education: 'bg-teal-500',
      Other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={() => onClick(event)}
    >
      <div className="relative overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-sm">
          {event.distance ? `${event.distance.toFixed(1)} km` : 'Remote'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}
            </span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location.name}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {event.currentParticipants} / {event.maxParticipants} participants
            </span>
          </div>
        </div>

        {/* Participation Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Registration</span>
            <span>{Math.round(participationPercentage)}% full</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                participationPercentage >= 90 ? 'bg-red-500' :
                participationPercentage >= 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(participationPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatDistanceToNow(new Date(event.date), { addSuffix: true })}</span>
          </div>
          <span className="font-semibold">{event.organizer}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;