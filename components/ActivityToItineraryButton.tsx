"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  name: string;
  activityName: string;
  description: string;
  location?: string;
  website?: string;
  category: string;
}

interface ActivityToItineraryButtonProps {
  activity: Activity;
  className?: string;
}

export default function ActivityToItineraryButton({ 
  activity, 
  className = "btn btn-sm btn-outline" 
}: ActivityToItineraryButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToItinerary = () => {
    setIsAdding(true);
    
    // Create URL with pre-filled activity data
    const params = new URLSearchParams({
      title: activity.activityName,
      description: activity.description,
      location: activity.location || '',
      url: activity.website || '',
      category: 'activity'
    });
    
    // Navigate to itinerary page with pre-filled data
    router.push(`/itinerary?create=true&${params.toString()}`);
  };

  return (
    <button
      onClick={handleAddToItinerary}
      disabled={isAdding}
      className={className}
      title="Add this activity to your itinerary"
    >
      {isAdding ? (
        <>
          <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full mr-2"></div>
          Adding...
        </>
      ) : (
        <>
          📅 Add to Itinerary
        </>
      )}
    </button>
  );
}