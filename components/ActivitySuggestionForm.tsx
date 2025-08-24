"use client";
import { useState } from "react";

const categories = [
  "Outdoors & Nature",
  "Museums & History", 
  "Food & Drink",
  "Entertainment",
  "Shopping",
  "Day Trips",
  "Family-Friendly",
  "Other"
];

export default function ActivitySuggestionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setStatus(null);
    const res = await fetch("/api/activity-suggestions", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setStatus("Something went wrong. Please try again.");
    } else {
      setStatus("Thanks! Your activity suggestion has been added.");
      (document.getElementById("activity-suggestion-form") as HTMLFormElement)?.reset();
    }
    setSubmitting(false);
  }

  return (
    <form id="activity-suggestion-form" action={onSubmit} className="space-y-6">
      {/* Your Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="name">
          👤 Your Name
        </label>
        <input 
          id="name" 
          name="name" 
          required 
          placeholder="Who's making this great suggestion?"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Activity Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="activity_name">
          🎯 Activity Name
        </label>
        <input 
          id="activity_name" 
          name="activity_name" 
          required 
          placeholder="e.g., Sunset Kayaking, Local Art Gallery, etc."
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="category">
          📂 Category
        </label>
        <select 
          id="category" 
          name="category" 
          required 
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200"
        >
          <option value="">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="description">
          📝 Description
        </label>
        <textarea 
          id="description" 
          name="description" 
          required
          rows={3}
          placeholder="Tell us what makes this activity special and why the family should check it out!"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200 resize-none" 
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="location">
          📍 Location <span className="text-xs opacity-60">(optional)</span>
        </label>
        <input 
          id="location" 
          name="location" 
          placeholder="Address or general area"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="website">
          🔗 Website <span className="text-xs opacity-60">(optional)</span>
        </label>
        <input 
          id="website" 
          name="website" 
          type="url"
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all duration-200" 
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="notes">
          💭 Additional Notes <span className="text-xs opacity-60">(optional)</span>
        </label>
        <textarea 
          id="notes" 
          name="notes" 
          rows={2}
          placeholder="Any tips, best times to visit, or other helpful info?"
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
              ✨ Share My Activity Suggestion
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
