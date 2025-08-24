"use client";
import { useState } from "react";

export default function TravelForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setStatus(null);
    const res = await fetch("/api/travel-notes", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setStatus("Something went wrong. Please try again.");
    } else {
      setStatus("Thanks! Your travel note has been recorded.");
      (document.getElementById("travel-notes-form") as HTMLFormElement)?.reset();
    }
    setSubmitting(false);
  }

  return (
    <form id="travel-notes-form" action={onSubmit} className="space-y-6">
      {/* Family Unit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="name">
          👨‍👩‍👧‍👦 Family Unit
        </label>
        <input 
          id="name" 
          name="name" 
          required 
          placeholder="e.g., The Smiths, John & Mary, etc."
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Traveling From */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="traveling_from">
          🗺️ Traveling From
        </label>
        <input 
          id="traveling_from" 
          name="origin_city" 
          required 
          placeholder="e.g., Boston, MA or London, UK"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
        <p className="text-xs opacity-60">
          Include city and state/country for clarity
        </p>
      </div>

      {/* Arrival Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="arrival_date">
            🛬 Arrival Date
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
          <label className="block text-sm font-medium" htmlFor="arrival_time">
            ⏰ Arrival Time <span className="text-xs opacity-60">(optional)</span>
          </label>
          <input 
            id="arrival_time" 
            name="arrival_time" 
            type="time" 
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
          />
        </div>
      </div>

      {/* Departure Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="departure_date">
            🛫 Departure Date
          </label>
          <input 
            id="departure_date" 
            name="departure_date" 
            type="date" 
            required 
            min="2026-07-05"
            max="2026-07-20"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="departure_time">
            ⏰ Departure Time <span className="text-xs opacity-60">(optional)</span>
          </label>
          <input 
            id="departure_time" 
            name="departure_time" 
            type="time" 
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="notes">
          💬 Notes <span className="text-xs opacity-60">(optional)</span>
        </label>
        <textarea 
          id="notes" 
          name="notes" 
          rows={4}
          placeholder="Any special notes? Need a ride from the airport? Bringing extra guests? Let everyone know!"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200 resize-none" 
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button 
          disabled={submitting} 
          className="btn btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              ✨ Share My Travel Plans
            </>
          )}
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg text-sm ${
          status.includes("Thanks") 
            ? "bg-[var(--brand-sage)]/10 text-[var(--brand-sage)] border border-[var(--brand-sage)]/20" 
            : "bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] border border-[var(--brand-coral)]/20"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {status.includes("Thanks") ? "✅" : "⚠️"}
            </span>
            <p>{status}</p>
          </div>
        </div>
      )}
    </form>
  );
}