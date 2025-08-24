'use client'

import { useState } from 'react'
import ActivitySuggestionForm from "./ActivitySuggestionForm";
import EditModal from "./EditModal";

interface ActivitySuggestion {
  id: string;
  name: string;
  activity_name: string;
  description: string;
  location: string;
  website: string;
  category: string;
  notes: string;
  created_at: string;
}

interface Activity {
  id?: string;
  name: string;
  description: string;
  location: string;
  website?: string;
  image?: string;
  highlights?: string[];
  isUserSubmitted?: boolean;
  submittedBy?: string;
  notes?: string;
  category?: string;
}

interface CategoryGroup {
  category: string;
  icon: string;
  activities: Activity[];
}

// Client component for handling edit/delete actions
function ActivityCard({ 
  activity, 
  categoryIcon, 
  categoryIndex, 
  activityIndex,
  onEdit,
  onDelete 
}: { 
  activity: Activity
  categoryIcon: string
  categoryIndex: number
  activityIndex: number
  onEdit?: (activity: Activity) => void
  onDelete?: (activityId: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!activity.id || !onDelete) return
    
    if (confirm(`Are you sure you want to delete "${activity.name}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        await onDelete(activity.id)
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete activity. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div 
      className={`card hover:scale-[1.02] transition-transform duration-300 ${
        activity.isUserSubmitted 
          ? 'border-2 border-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent' 
          : ''
      }`}
      style={{ animationDelay: `${(categoryIndex * 2 + activityIndex) * 0.1}s` }}
    >
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Activity Image */}
        <div className="relative aspect-[4/3] lg:aspect-[3/2] image-rounded overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
            <div className="text-6xl opacity-50">{categoryIcon}</div>
          </div>
        </div>
        
        {/* Activity Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h3 className="font-display text-xl font-semibold flex-1">
              {activity.name}
            </h3>
            {activity.isUserSubmitted && (
              <div className="badge badge-blue text-xs">
                Suggested by {activity.submittedBy}
              </div>
            )}
            <div className="flex gap-2">
              {activity.website && (
                <a
                  href={activity.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary text-sm"
                >
                  🔗 Visit Website
                </a>
              )}
              {activity.isUserSubmitted && activity.id && onEdit && (
                <button
                  onClick={() => onEdit(activity)}
                  className="btn btn-secondary text-sm"
                  title="Edit activity"
                >
                  ✏️ Edit
                </button>
              )}
              {activity.isUserSubmitted && activity.id && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn-secondary text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Delete activity"
                >
                  {isDeleting ? '⏳' : '🗑️'} {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
          
          {activity.location && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📍</span>
              <p className="text-sm opacity-75">{activity.location}</p>
            </div>
          )}
          
          <p className="text-sm opacity-80 mb-4 leading-relaxed">
            {activity.description}
          </p>
          
          {activity.highlights && (
            <div className="flex flex-wrap gap-2 mb-3">
              {activity.highlights.map((highlight) => (
                <span 
                  key={highlight}
                  className="badge badge-primary text-xs"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
          
          {activity.notes && (
            <div className="mt-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
              <p className="text-sm opacity-80">
                💭 {activity.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Client component wrapper
export default function ThingsToDoClient({ 
  initialActivities, 
  initialUserSuggestions 
}: { 
  initialActivities: CategoryGroup[]
  initialUserSuggestions: ActivitySuggestion[]
}) {
  const [featuredActivities, setFeaturedActivities] = useState(initialActivities)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (formData: Record<string, string>) => {
    if (!editingActivity?.id) return
    
    setIsLoading(true)
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        // Format website URL if it's the website field
        if (key === 'website' && value) {
          const formattedUrl = formatUrl(value)
          form.append(key, formattedUrl)
        } else {
          form.append(key, value)
        }
      })
      
      const response = await fetch(`/api/activity-suggestions?id=${editingActivity.id}`, {
        method: 'PUT',
        body: form
      })
      
      if (!response.ok) {
        throw new Error('Failed to update activity')
      }
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Edit failed:', error)
      alert('Failed to update activity. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (activityId: string) => {
    const response = await fetch(`/api/activity-suggestions?id=${activityId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete activity')
    }
    
    // Refresh the page to show updated data
    window.location.reload()
  }

  const editFields = editingActivity ? [
    {
      name: 'name',
      label: 'Your Name',
      type: 'text' as const,
      required: true,
      value: editingActivity.submittedBy || ''
    },
    {
      name: 'activity_name',
      label: 'Activity Name',
      type: 'text' as const,
      required: true,
      value: editingActivity.name || ''
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        'Outdoors & Nature',
        'Museums & History',
        'Food & Drink',
        'Entertainment',
        'Shopping',
        'Day Trips',
        'Family-Friendly',
        'Other'
      ],
      value: editingActivity.category || ''
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      required: true,
      value: editingActivity.description || ''
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text' as const,
      value: editingActivity.location || ''
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text' as const,
      value: editingActivity.website || ''
    },
    {
      name: 'notes',
      label: 'Additional Notes',
      type: 'textarea' as const,
      value: editingActivity.notes || ''
    }
  ] : []

  return (
    <div className="container space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">🌊 Coastal Adventures</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Things to <span className="text-gradient">Explore</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Discover the best of Fairhaven, Mattapoisett, and the surrounding South Coast. 
          From historic sites to beautiful beaches, there&apos;s something for everyone!
        </p>
      </div>

      {/* Featured Activities */}
      {featuredActivities.map((categoryGroup, categoryIndex) => (
        <section key={categoryGroup.category}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              {categoryGroup.icon} <span className="text-gradient">{categoryGroup.category}</span>
            </h2>
          </div>
          
          <div className="grid gap-8">
            {categoryGroup.activities.map((activity, activityIndex) => (
              <ActivityCard
                key={`${activity.name}-${activityIndex}`}
                activity={activity}
                categoryIcon={categoryGroup.icon}
                categoryIndex={categoryIndex}
                activityIndex={activityIndex}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Activity Suggestion Form */}
      <section className="max-w-2xl mx-auto">
        <div className="card card-travel p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💡</div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Know a Great Spot?
            </h2>
            <p className="text-sm opacity-75">
              Share your favorite local activities and help make Dad&apos;s celebration even more special!
            </p>
          </div>
          <ActivitySuggestionForm />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="card card-travel p-8">
          <div className="text-4xl mb-4">🎆</div>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Ready for Adventure?
          </h2>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            With so many amazing activities to choose from, Dad&apos;s 80th celebration 
            is going to be unforgettable! Don&apos;t forget to coordinate your travel plans.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/travel-notes" className="btn btn-primary">
              ✈️ Share Travel Plans
            </a>
            <a href="/stay" className="btn btn-secondary">
              🏡 View House Details
            </a>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingActivity(null)
        }}
        onSave={handleSaveEdit}
        title="Edit Activity Suggestion"
        fields={editFields}
        isLoading={isLoading}
      />
    </div>
  )
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