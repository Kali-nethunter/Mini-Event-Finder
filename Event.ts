export interface Event {
  _id: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  imageUrl: string;
  organizer: string;
  tags: string[];
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  maxDistance?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}