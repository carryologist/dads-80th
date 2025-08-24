"use client";
import { useState } from "react";

const travelMethods = [
  "Flying",
  "Driving", 
  "Train",
  "Bus",
  "Other"
];

const accommodationOptions = [
  "The main house",
  "Hotel/Motel nearby",
  "Airbnb/Rental",
  "Staying with family",
  "Other"
];

export default function TravelPlanForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setStatus(null);
    
    try {
      const res = await fetch("/api/travel-notes", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        setStatus(`Error: ${errorData.error || 'Something went wrong. Please try again.'}`);  
      } else {
        setStatus("Thanks! Your travel plans have been shared with the family.");
        (document.getElementById("travel-plan-form") as HTMLFormElement)?.reset();
      }
    } catch (error) {
      console.error('Network Error:', error);
      setStatus("Network error. Please check your connection and try again.");
    }
    
    setSubmitting(false);
  }

  return (
    <form id="travel-plan-form" action={onSubmit} className="space-y-6">
      {/* Your Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="name">
          👤 Your Name
        </label>
        <input 
          id="name" 
          name="name" 
          required 
          placeholder="Who's sharing their travel plans?"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Travel Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="arrival_date">
            📅 Arrival Date
          </label>
          <input 
            id="arrival_date" 
            name="arrival_date" 
            type="date"
            required 
            min="2026-07-01"
            max="2026-07-15"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="departure_date">
            📅 Departure Date
          </label>
          <input 
            id="departure_date" 
            name="departure_date" 
            type="date"
            required 
            min="2026-07-01"
            max="2026-07-15"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
          />
        </div>
      </div>

      {/* Travel Method */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="travel_method">
          🚗 How are you traveling?
        </label>
        <select 
          id="travel_method" 
          name="travel_method" 
          required
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
        >
          <option value="">Select your travel method</option>
          {travelMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      {/* Accommodation */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="accommodation">
          🏨 Where are you staying?
        </label>
        <select 
          id="accommodation" 
          name="accommodation" 
          required
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
        >
          <option value="">Select your accommodation</option>
          {accommodationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="notes">
          💭 Additional Notes (Optional)
        </label>
        <textarea 
          id="notes" 
          name="notes" 
          rows={3}
          placeholder="Any special notes? Flight details, need a ride, bringing extra guests, etc."
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200 resize-none" 
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Sharing Plans...
          </>
        ) : (
          <>✈️ Share My Travel Plans</>
        )}
      </button>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg text-sm ${
          status.startsWith('Error:') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {status.startsWith('Error:') ? '⚠️' : '✅'} {status}
        </div>
      )}
    </form>
  );
}
