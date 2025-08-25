"use client";

import { useState } from 'react';

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

interface ItineraryCalendarProps {
  events: ItineraryEvent[];
  startDate: Date;
  endDate: Date;
  onTimeSlotClick: (date: string, time: string) => void;
  onEventClick: (event: ItineraryEvent) => void;
}

export default function ItineraryCalendar({
  events,
  startDate,
  endDate,
  onTimeSlotClick,
  onEventClick
}: ItineraryCalendarProps) {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);

  // Generate array of dates for the trip
  const generateDates = () => {
    const dates = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Generate time slots (6 AM to 11 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ display: time12, value: time24, hour });
    }
    return slots;
  };

  // Get events for a specific date and time
  const getEventsForSlot = (date: Date, timeSlot: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const slotTime = new Date(`${dateStr}T${timeSlot}:00`);
      
      return eventStart <= slotTime && eventEnd > slotTime;
    });
  };

  // Calculate event height based on duration
  const calculateEventHeight = (event: ItineraryEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(durationHours * 60, 30); // Minimum 30px height
  };

  // Calculate event position within the hour
  const calculateEventPosition = (event: ItineraryEvent) => {
    const start = new Date(event.startTime);
    const minutes = start.getMinutes();
    return (minutes / 60) * 60; // Convert to pixels (60px per hour)
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date for API
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  const displayDates = viewMode === 'week' ? dates : [selectedDate];

  return (
    <div className="card card-travel p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl font-semibold">
            {viewMode === 'week' ? 'Week View' : formatDate(selectedDate)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`btn btn-sm ${
                viewMode === 'week' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`btn btn-sm ${
                viewMode === 'day' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              Day
            </button>
          </div>
        </div>
        
        {/* Day Navigation (only in day view) */}
        {viewMode === 'day' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                if (prevDay >= startDate) {
                  setSelectedDate(prevDay);
                }
              }}
              disabled={selectedDate <= startDate}
              className="btn btn-sm btn-outline"
            >
              ← Prev
            </button>
            <button
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                if (nextDay <= endDate) {
                  setSelectedDate(nextDay);
                }
              }}
              disabled={selectedDate >= endDate}
              className="btn btn-sm btn-outline"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Date Headers */}
          <div className="grid grid-cols-[80px_1fr] gap-0 border-b border-gray-200">
            <div className="p-3 font-medium text-sm opacity-75">Time</div>
            <div className={`grid gap-0 ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
              {displayDates.map((date, index) => (
                <div
                  key={index}
                  className="p-3 text-center font-medium border-l border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setSelectedDate(date);
                    setViewMode('day');
                  }}
                >
                  <div className="text-sm">{formatDate(date)}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {events.filter(event => {
                      const eventDate = new Date(event.startTime).toDateString();
                      return eventDate === date.toDateString();
                    }).length} events
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="relative">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-[80px_1fr] gap-0 border-b border-gray-100">
                {/* Time Label */}
                <div className="p-3 text-sm font-medium opacity-75 border-r border-gray-200">
                  {timeSlot.display}
                </div>
                
                {/* Date Columns */}
                <div className={`grid gap-0 ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
                  {displayDates.map((date, dateIndex) => {
                    const slotEvents = getEventsForSlot(date, timeSlot.value);
                    
                    return (
                      <div
                        key={dateIndex}
                        className="relative h-16 border-l border-gray-100 hover:bg-blue-25 transition-colors cursor-pointer group"
                        onClick={() => onTimeSlotClick(formatDateForAPI(date), timeSlot.value)}
                      >
                        {/* Add Event Hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-blue-600 font-medium">+ Add Event</span>
                        </div>
                        
                        {/* Events */}
                        {slotEvents.map((event, eventIndex) => {
                          const height = calculateEventHeight(event);
                          const position = calculateEventPosition(event);
                          
                          return (
                            <div
                              key={event.id}
                              className="absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium cursor-pointer hover:shadow-md transition-all z-10"
                              style={{
                                backgroundColor: event.color,
                                color: 'white',
                                height: `${Math.min(height, 60)}px`,
                                top: `${position}px`,
                                marginLeft: `${eventIndex * 4}px`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(event);
                              }}
                              title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
                            >
                              <div className="truncate font-semibold">{event.title}</div>
                              {event.location && (
                                <div className="truncate opacity-90 text-xs">{event.location}</div>
                              )}
                              <div className="text-xs opacity-75">
                                {new Date(event.startTime).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm opacity-75">
            <span>📌 Click any time slot to add an event</span>
            <span>✏️ Click existing events to edit them</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-75">Total Events:</span>
            <span className="font-semibold">{events.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}