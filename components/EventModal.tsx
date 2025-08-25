"use client";

import { useState, useEffect } from 'react';

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

interface EventModalProps {
  event?: ItineraryEvent | null;
  timeSlot?: { date: string; time: string } | null;
  prefilledData?: PrefilledEventData | null;
  onSave: (eventData: Omit<ItineraryEvent, 'id' | 'createdAt' | 'updatedAt'> | ItineraryEvent) => void;
  onDelete?: (eventId: string) => void;
  onClose: () => void;
}

const EVENT_CATEGORIES = [
  { value: 'general', label: 'General', color: '#0ea5e9' },
  { value: 'meal', label: 'Meal', color: '#f59e0b' },
  { value: 'activity', label: 'Activity', color: '#10b981' },
  { value: 'travel', label: 'Travel', color: '#8b5cf6' },
  { value: 'celebration', label: 'Celebration', color: '#ef4444' },
  { value: 'rest', label: 'Rest/Free Time', color: '#6b7280' }
];

export default function EventModal({
  event,
  timeSlot,
  prefilledData,
  onSave,
  onDelete,
  onClose
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    url: '',
    category: 'general',
    color: '#0ea5e9'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (event) {
      // Editing existing event
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: formatDateTimeForInput(startTime),
        endTime: formatDateTimeForInput(endTime),
        location: event.location || '',
        url: event.url || '',
        category: event.category,
        color: event.color
      });
    } else if (timeSlot) {
      // Creating new event from time slot
      const startDateTime = new Date(`${timeSlot.date}T${timeSlot.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration
      
      setFormData({
        title: prefilledData?.title || '',
        description: prefilledData?.description || '',
        startTime: formatDateTimeForInput(startDateTime),
        endTime: formatDateTimeForInput(endDateTime),
        location: prefilledData?.location || '',
        url: prefilledData?.url || '',
        category: prefilledData?.category || 'general',
        color: EVENT_CATEGORIES.find(cat => cat.value === (prefilledData?.category || 'general'))?.color || '#0ea5e9'
      });
    } else if (prefilledData) {
      // Creating new event with prefilled data (from activities)
      const now = new Date();
      const startDateTime = new Date(now.getTime() + 60 * 60 * 1000); // Default to 1 hour from now
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration
      
      setFormData({
        title: prefilledData.title || '',
        description: prefilledData.description || '',
        startTime: formatDateTimeForInput(startDateTime),
        endTime: formatDateTimeForInput(endDateTime),
        location: prefilledData.location || '',
        url: prefilledData.url || '',
        category: prefilledData.category || 'activity',
        color: EVENT_CATEGORIES.find(cat => cat.value === (prefilledData.category || 'activity'))?.color || '#10b981'
      });
    }
  }, [event, timeSlot, prefilledData]);

  // Format date for datetime-local input
  const formatDateTimeForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Update color when category changes
    if (field === 'category') {
      const category = EVENT_CATEGORIES.find(cat => cat.value === value);
      if (category) {
        setFormData(prev => ({ ...prev, color: category.color }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const eventData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      ...(event && { id: event.id })
    };
    
    onSave(eventData);
  };

  // Handle delete
  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-2xl font-semibold">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Dad's Birthday Dinner"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {EVENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Waterfront Restaurant, Beach, etc."
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Website/Link
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>

          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              ></div>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm opacity-75">{formData.color}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Delete Event
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {event ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="font-display text-xl font-semibold mb-4">
              Delete Event?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{event?.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}