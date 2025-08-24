"use client"

import { useState } from 'react'

// Client-side debug logging
function clientDebugLog(step: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🟦 CLIENT-TRAVEL: ${step}`);
  if (data) {
    console.log(`[${timestamp}] 📊 CLIENT-DATA:`, data);
  }
}

const travelMethods = [
  "Flying",
  "Driving", 
  "Train",
  "Bus",
  "Other"
];

const accommodationOptions = [
  "Stay at the Whiteley Compound",
  "Stay at the Airbnb"
];

export default function TravelPlanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const submissionId = Math.random().toString(36).substring(7);
    clientDebugLog(`🚀 TRAVEL FORM SUBMISSION STARTED [${submissionId}]`);
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')
    setDebugInfo(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Log all form data
      const formEntries = Array.from(formData.entries());
      clientDebugLog('Form data being submitted', formEntries);
      
      // Validate required fields client-side
      const requiredFields = ['name', 'arrival_date', 'departure_date', 'travel_method', 'accommodation'];
      const validation: Record<string, { value: FormDataEntryValue | null; valid: boolean }> = {};
      let hasErrors = false;
      
      for (const field of requiredFields) {
        const value = formData.get(field);
        validation[field] = {
          value: value,
          valid: !!value && String(value).trim().length > 0
        };
        if (!validation[field].valid) hasErrors = true;
      }
      
      clientDebugLog('Client-side validation', { validation, hasErrors });
      
      if (hasErrors) {
        clientDebugLog('❌ Client-side validation failed');
        setSubmitStatus('error');
        setSubmitMessage('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }
      
      clientDebugLog('✅ Client-side validation passed, making API request');
      
      const startTime = Date.now();
      const response = await fetch('/api/travel-notes', {
        method: 'POST',
        body: formData,
      })
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      clientDebugLog(`API request completed in ${duration}ms`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      let responseData;
      try {
        responseData = await response.json();
        clientDebugLog('API response data', responseData);
      } catch (parseError) {
        clientDebugLog('❌ Failed to parse JSON response', { parseError: String(parseError) });
        throw new Error('Invalid JSON response from server');
      }
      
      setDebugInfo({
        submissionId,
        requestId: responseData.requestId,
        duration,
        status: response.status,
        responseData
      });
      
      if (response.ok && responseData.ok) {
        clientDebugLog('✅ Travel form submission successful');
        setSubmitStatus('success')
        setSubmitMessage(responseData.message || 'Travel plans submitted successfully!')
        
        // Reset form
        e.currentTarget.reset()
        
        // Log success details
        clientDebugLog('Success details', {
          storage: responseData.storage,
          id: responseData.id,
          totalRecords: responseData.totalRecords
        });
        
      } else {
        clientDebugLog('❌ Travel form submission failed', {
          status: response.status,
          responseData
        });
        setSubmitStatus('error')
        setSubmitMessage(responseData.message || responseData.error || 'Failed to submit travel plans')
      }
    } catch (error) {
      clientDebugLog('❌ Travel form submission error', {
        error: String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      setSubmitStatus('error')
      setSubmitMessage('Network error: ' + String(error))
      setDebugInfo({ error: String(error), submissionId });
    } finally {
      setIsSubmitting(false)
      clientDebugLog(`🏁 TRAVEL FORM SUBMISSION COMPLETED [${submissionId}]`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Your Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="name">
            👤 Your Name *
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
              📅 Arrival Date *
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
              📅 Departure Date *
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
            🚗 How are you traveling? *
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
            🏨 Where are you staying? *
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
          disabled={isSubmitting}
          className="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Sharing Plans...
            </>
          ) : (
            <>✈️ Share My Travel Plans</>
          )}
        </button>
      </form>
      
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">✅</span>
            <span>{submitMessage}</span>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">❌</span>
            <span>{submitMessage}</span>
          </div>
        </div>
      )}
      
      {/* Debug Information (only show in development or when there's an issue) */}
      {debugInfo && (process.env.NODE_ENV === 'development' || submitStatus === 'error') && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-xs">
          <details>
            <summary className="cursor-pointer font-medium mb-2">
              🔍 Debug Information (Click to expand)
            </summary>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}