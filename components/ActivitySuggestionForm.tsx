'use client'

import { useState } from 'react'

// Client-side debug logging
function clientDebugLog(step: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🟦 CLIENT-FORM: ${step}`);
  if (data) {
    console.log(`[${timestamp}] 📊 CLIENT-DATA:`, data);
  }
}

// URL formatting helper function
function formatUrl(input: string): string {
  if (!input || input.trim() === '') {
    return '';
  }
  
  const url = input.trim();
  
  // If it already has a protocol, return as-is
  if (url.match(/^https?:\/\//i)) {
    return url;
  }
  
  // If it starts with www., add https://
  if (url.match(/^www\./i)) {
    return `https://${url}`;
  }
  
  // If it looks like a domain (contains a dot and no spaces), add https://www.
  if (url.includes('.') && !url.includes(' ') && !url.includes('/')) {
    return `https://www.${url}`;
  }
  
  // If it starts with a domain but has a path, add https://
  if (url.includes('.') && !url.includes(' ')) {
    return `https://${url}`;
  }
  
  // Otherwise, return as-is (might be invalid, but let server validation handle it)
  return url;
}

export default function ActivitySuggestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const submissionId = Math.random().toString(36).substring(7);
    clientDebugLog(`🚀 FORM SUBMISSION STARTED [${submissionId}]`);
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')
    setDebugInfo(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Format the website URL if provided
      const websiteValue = formData.get('website');
      if (websiteValue && typeof websiteValue === 'string') {
        const formattedUrl = formatUrl(websiteValue);
        formData.set('website', formattedUrl);
        clientDebugLog('URL formatting applied', {
          original: websiteValue,
          formatted: formattedUrl
        });
      }
      
      // Log all form data
      const formEntries = Array.from(formData.entries());
      clientDebugLog('Form data being submitted', formEntries);
      
      // Validate required fields client-side
      const requiredFields = ['name', 'activity_name', 'description', 'category'];
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
      const response = await fetch('/api/activity-suggestions', {
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
        clientDebugLog('✅ Form submission successful');
        setSubmitStatus('success')
        setSubmitMessage(responseData.message || 'Activity suggestion submitted successfully!')
        
        // Reset form
        e.currentTarget.reset()
        
        // Log success details
        clientDebugLog('Success details', {
          storage: responseData.storage,
          id: responseData.id,
          totalRecords: responseData.totalRecords
        });
        
      } else {
        clientDebugLog('❌ Form submission failed', {
          status: response.status,
          responseData
        });
        setSubmitStatus('error')
        setSubmitMessage(responseData.message || responseData.error || 'Failed to submit activity suggestion')
      }
    } catch (error) {
      clientDebugLog('❌ Form submission error', {
        error: String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      setSubmitStatus('error')
      setSubmitMessage('Network error: ' + String(error))
      setDebugInfo({ error: String(error), submissionId });
    } finally {
      setIsSubmitting(false)
      clientDebugLog(`🏁 FORM SUBMISSION COMPLETED [${submissionId}]`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input w-full"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="input w-full"
            >
              <option value="">Select a category</option>
              <option value="Outdoors & Nature">Outdoors & Nature</option>
              <option value="Museums & History">Museums & History</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Day Trips">Day Trips</option>
              <option value="Family-Friendly">Family-Friendly</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="activity_name" className="block text-sm font-medium mb-2">
            Activity Name *
          </label>
          <input
            type="text"
            id="activity_name"
            name="activity_name"
            required
            className="input w-full"
            placeholder="What's the name of this activity or place?"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            className="input w-full resize-none"
            placeholder="Tell us about this activity - what makes it special?"
          />
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="input w-full"
              placeholder="City, State or specific address"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="input w-full"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="input w-full resize-none"
            placeholder="Any special tips, best times to visit, or other helpful info?"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            'Share Activity Suggestion'
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