import { Suspense } from 'react';
import ItineraryPageClient from '../../components/ItineraryPageClient';

export default function ItineraryPage() {
  return (
    <div className="container space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">📅 Interactive Schedule</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Our <span className="text-gradient">Itinerary</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Plan our week together! Click on any time slot to add an event, or click existing events to edit them.
        </p>
      </div>

      {/* Client Component with Suspense */}
      <Suspense fallback={
        <div className="card card-travel p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="opacity-75">Loading your itinerary...</p>
        </div>
      }>
        <ItineraryPageClient />
      </Suspense>
    </div>
  );
}