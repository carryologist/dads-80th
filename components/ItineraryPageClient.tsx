"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ItineraryCalendar from './ItineraryCalendar';
import EventModal from './EventModal';

interface ItineraryEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  url?: string;
  category: string;
  color: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface PrefilledEventData {
  title?: string;
  description?: string;
  location?: string;
  url?: string;
  category?: string;
}

export default function ItineraryPageClient() {
  const [events, setEvents] = useState<ItineraryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ItineraryEvent | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: string; time: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prefilledData, setPrefilledData] = useState<PrefilledEventData | null>(null);
  
  const searchParams = useSearchParams();

  // Trip dates: July 5-12, 2026
  const tripStartDate = useMemo(() => new Date('2026-07-05'), []);
  const tripEndDate = useMemo(() => new Date('2026-07-12'), []);

  // Check for URL parameters to pre-fill event creation
  useEffect(() => {
    const shouldCreate = searchParams.get('create');
    if (shouldCreate === 'true') {
      const prefilled = {
        title: searchParams.get('title') || '',
        description: searchParams.get('description') || '',
        location: searchParams.get('location') || '',
        url: searchParams.get('url') || '',
        category: searchParams.get('category') || 'activity'
      };
      
      setPrefilledData(prefilled);
      setShowEventModal(true);
      
      // Clear URL parameters after extracting data
      window.history.replaceState({}, '', '/itinerary');
    }
  }, [searchParams]);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = tripStartDate.toISOString();
      const endDate = new Date(tripEndDate.getTime() + 24 * 60 * 60 * 1000).toISOString(); // Add 1 day to include end date
      
      const response = await fetch(`/api/itinerary-events?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [tripStartDate, tripEndDate]);

  // Create new event
  const createEvent = async (eventData: Omit<ItineraryEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/itinerary-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events
        setShowEventModal(false);
        setSelectedEvent(null);
        setSelectedTimeSlot(null);
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
    }
  };

  // Update existing event
  const updateEvent = async (eventData: ItineraryEvent) => {
    try {
      const response = await fetch('/api/itinerary-events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events
        setShowEventModal(false);
        setSelectedEvent(null);
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/itinerary-events?id=${eventId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events
        setShowEventModal(false);
        setSelectedEvent(null);
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  // Handle time slot click (for creating new events)
  const handleTimeSlotClick = (date: string, time: string) => {
    setSelectedTimeSlot({ date, time });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Handle event click (for editing existing events)
  const handleEventClick = (event: ItineraryEvent) => {
    setSelectedEvent(event);
    setSelectedTimeSlot(null);
    setShowEventModal(true);
  };

  // Handle event save (create or update)
  const handleEventSave = async (eventData: Omit<ItineraryEvent, 'id' | 'createdAt' | 'updatedAt'> | ItineraryEvent) => {
    if ('id' in eventData) {
      // Update existing event
      await updateEvent(eventData as ItineraryEvent);
    } else {
      // Create new event
      await createEvent(eventData as Omit<ItineraryEvent, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      {/* Trip Dates Info */}
      <div className="card card-travel p-6">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛬</span>
            <div>
              <p className="font-medium">Check-in</p>
              <p className="text-sm opacity-75">Saturday, July 5, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛫</span>
            <div>
              <p className="font-medium">Check-out</p>
              <p className="text-sm opacity-75">Saturday, July 12, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium">{events.length} Events</p>
              <p className="text-sm opacity-75">Planned so far</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card border-red-200 bg-red-50 text-red-800 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="font-medium">Error: {error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="card card-travel p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="opacity-75">Loading your itinerary...</p>
        </div>
      ) : (
        /* Calendar Component */
        <ItineraryCalendar
          events={events}
          startDate={tripStartDate}
          endDate={tripEndDate}
          onTimeSlotClick={handleTimeSlotClick}
          onEventClick={handleEventClick}
        />
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          timeSlot={selectedTimeSlot}
          prefilledData={prefilledData}
          onSave={handleEventSave}
          onDelete={selectedEvent ? deleteEvent : undefined}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
            setSelectedTimeSlot(null);
            setPrefilledData(null);
          }}
        />
      )}
    </>
  );
}