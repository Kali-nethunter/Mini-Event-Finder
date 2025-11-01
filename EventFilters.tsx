import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { EventFilters as Filters } from '../types/Event';

interface EventFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const categories = ['All', 'Music', 'Sports', 'Tech', 'Art', 'Food', 'Business', 'Education', 'Other'];

const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters
}) => {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'All' ? undefined : value
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search events, tags, or locations..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>

        <div className="flex space-x-4">
          <select
            value={filters.sortBy || 'date'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="distance">Sort by Distance</option>
            <option value="currentParticipants">Sort by Popularity</option>
          </select>

          <select
            value={filters.sortOrder || 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Distance Filter */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Distance: {filters.maxDistance || 50} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.maxDistance || 50}
                onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventFilters;