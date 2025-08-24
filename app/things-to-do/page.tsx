'use client'

import { useState } from 'react'
import { prisma } from "../../lib/prisma";
import ActivitySuggestionForm from "../../components/ActivitySuggestionForm";
import EditModal from "../../components/EditModal";

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

const baseFeaturedActivities: CategoryGroup[] = [
  {
    category: "Outdoors & Nature",
    icon: "🌊",
    activities: [
      {
        name: "Fort Phoenix State Reservation",
        description: "Historic Revolutionary War fort with beautiful harbor views, beach access, and walking trails. Perfect for sunset watching and learning about local history.",
        location: "Fairhaven, MA",
        website: "https://www.mass.gov/locations/fort-phoenix-state-reservation",
        image: "https://www.mass.gov/files/styles/embedded_full_width/public/images/2017-05/fort%20phoenix%20beach.jpg",
        highlights: ["Historic fort", "Beach access", "Sunset views", "Free parking"]
      },
      {
        name: "Mattapoisett Rail Trail & Ned's Point Lighthouse",
        description: "Scenic paved trail perfect for walking, biking, or jogging. Leads to stunning views of Ned's Point Lighthouse and Buzzards Bay. Connects to Phoenix Bike Trail for longer adventures.",
        location: "Mattapoisett, MA",
        website: "https://mattapoisettrailtrail.com/",
        image: "https://www.savebuzzardsbay.org/wp-content/uploads/2016/05/places-to-go_mattapoisett-rail-trail-1-800x580.jpg",
        highlights: ["Paved trail", "Lighthouse views", "Family-friendly", "Connects to other trails"]
      },
      {
        name: "West Island Town Beach",
        description: "Beautiful sandy beach with lifeguards during summer months. Great for swimming, sunbathing, and beach walks. Parking passes required in season.",
        location: "Fairhaven, MA",
        website: "https://fairhaventours.com/west-island-town-beach-fairhaven-ma/",
        image: "https://www.savebuzzardsbay.org/wp-content/uploads/2016/02/in-your-community_fairhaven-2-800x580.jpg",
        highlights: ["Lifeguarded beach", "Sandy shoreline", "Swimming", "Summer season"]
      },
      {
        name: "Nasketucket Bay State Reservation",
        description: "Wooded trails leading to rocky shoreline with excellent bird watching opportunities. Multiple trail options for different skill levels.",
        location: "Fairhaven, MA",
        website: "https://www.mass.gov/locations/nasketucket-bay-state-reservation",
        image: "https://www.mass.gov/files/styles/embedded_full_width/public/images/2017-05/nasketucket%20bay%20trail.jpg",
        highlights: ["Wooded trails", "Rocky shoreline", "Bird watching", "Multiple difficulty levels"]
      }
    ]
  },
  {
    category: "Museums & History",
    icon: "🏛️",
    activities: [
      {
        name: "New Bedford Whaling Museum",
        description: "World's largest museum devoted to whaling history. Features the largest ship model in the world, scrimshaw collection, and interactive exhibits. Don't miss the 3D theater experience!",
        location: "New Bedford, MA",
        website: "https://www.whalingmuseum.org/visit/",
        image: "https://www.whalingmuseum.org/wp-content/uploads/2019/03/exterior-shot-1024x683.jpg",
        highlights: ["World's largest whaling museum", "3D theater", "Ship models", "Interactive exhibits"]
      },
      {
        name: "New Bedford Whaling National Historical Park",
        description: "Downtown walking tours through America's whaling capital. Explore cobblestone streets, historic buildings, and learn about the city's maritime heritage.",
        location: "New Bedford, MA",
        website: "https://www.nps.gov/nebe/index.htm",
        image: "https://www.nps.gov/common/uploads/structured_data/3C7B8B8B-1DD8-B71B-0B3C2B5B8B8B8B8B.jpg",
        highlights: ["Walking tours", "Historic downtown", "Maritime heritage", "Cobblestone streets"]
      }
    ]
  },
  {
    category: "Day Trips & Ferries",
    icon: "⛵",
    activities: [
      {
        name: "Martha's Vineyard Ferry",
        description: "Take the Seastreak ferry from New Bedford to Martha's Vineyard. Skip Cape traffic and enjoy a scenic 1-hour cruise to this famous island destination.",
        location: "Departs from New Bedford State Pier",
        website: "https://seastreak.com/ferry-routes-and-schedules/between-new-bedford-marthas-vineyard-ma/",
        image: "https://explorenewbedford.org/wp-content/uploads/seastreak-1.jpg",
        highlights: ["1-hour cruise", "Skip Cape traffic", "Seasonal service", "Luxury catamaran"]
      },
      {
        name: "Cuttyhunk Island Ferry",
        description: "Adventure to this remote island with pristine beaches and hiking trails. Perfect for a peaceful day trip away from the crowds.",
        location: "Departs from New Bedford",
        website: "https://cuttyhunkferry.com/",
        image: "https://cuttyhunkferry.com/wp-content/uploads/2019/05/cuttyhunk-island-aerial.jpg",
        highlights: ["Remote island", "Pristine beaches", "Hiking trails", "Peaceful escape"]
      }
    ]
  },
  {
    category: "Food & Drink",
    icon: "🍽️",
    activities: [
      {
        name: "Nasketucket Bay Vineyard",
        description: "Fairhaven's first vineyard and winery in a charming converted 1920's dairy barn. Enjoy wine tastings, live music, and local food in a rustic setting.",
        location: "237 Nasketucket Road, Fairhaven, MA",
        website: "https://www.peacelovevino.net/",
        image: "https://static.wixstatic.com/media/11062b_8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b~mv2.jpg",
        highlights: ["Local wines", "Live music", "Historic barn", "Outdoor patio"]
      },
      {
        name: "Oxford Creamery",
        description: "Classic Mattapoisett seafood restaurant and ice cream shop. Famous for their fresh seafood and homemade ice cream with harbor views.",
        location: "Mattapoisett, MA",
        website: "https://www.oxfordcreamery.com/",
        image: "https://www.oxfordcreamery.com/images/exterior.jpg",
        highlights: ["Fresh seafood", "Homemade ice cream", "Harbor views", "Local favorite"]
      },
      {
        name: "The Black Whale",
        description: "Waterfront dining in New Bedford with fresh seafood and craft cocktails. Great views of the harbor and excellent for special dinners.",
        location: "New Bedford Waterfront",
        website: "https://www.theblackwhale.com/",
        image: "https://www.theblackwhale.com/images/restaurant-exterior.jpg",
        highlights: ["Waterfront dining", "Fresh seafood", "Craft cocktails", "Harbor views"]
      }
    ]
  },
  {
    category: "Family-Friendly",
    icon: "👨‍👩‍👧‍👦",
    activities: [
      {
        name: "Buttonwood Park Zoo",
        description: "AZA-accredited zoo with over 200 animals from around the world. Features a children's zoo, train rides, and educational programs. Open 9am-4pm daily.",
        location: "New Bedford, MA",
        website: "https://www.bpzoo.org/visit-overview/",
        image: "https://www.bpzoo.org/wp-content/uploads/2019/03/zoo-entrance.jpg",
        highlights: ["200+ animals", "Children's zoo", "Train rides", "Educational programs"]
      }
    ]
  }
];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
function ThingsToDoClient({ 
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
        form.append(key, value)
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

export default async function ThingsToDo() {
  let userSuggestions: ActivitySuggestion[] = [];

  try {
    const suggestions = await prisma.activitySuggestion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform to match the expected format
    userSuggestions = suggestions.map(s => ({
      id: s.id,
      name: s.name,
      activity_name: s.activityName,
      description: s.description,
      location: s.location || '',
      website: s.website || '',
      category: s.category,
      notes: s.notes || '',
      created_at: s.createdAt.toISOString()
    }));
  } catch (error) {
    console.log('Could not fetch activity suggestions:', error);
    // Page will render without user suggestions
  }

  // Merge user suggestions into appropriate categories
  const featuredActivities: CategoryGroup[] = baseFeaturedActivities.map(categoryGroup => {
    // Find user suggestions for this category
    const userActivitiesForCategory = userSuggestions
      .filter(suggestion => suggestion.category === categoryGroup.category)
      .map(suggestion => ({
        id: suggestion.id,
        name: suggestion.activity_name,
        description: suggestion.description,
        location: suggestion.location,
        website: suggestion.website || undefined,
        isUserSubmitted: true,
        submittedBy: suggestion.name,
        notes: suggestion.notes || undefined,
        category: suggestion.category
      }));

    return {
      ...categoryGroup,
      activities: [...categoryGroup.activities, ...userActivitiesForCategory]
    };
  });

  // Handle user suggestions for categories that don't exist in base categories
  const existingCategories = baseFeaturedActivities.map(cat => cat.category);
  const newCategories = [...new Set(
    userSuggestions
      .filter(suggestion => !existingCategories.includes(suggestion.category))
      .map(suggestion => suggestion.category)
  )];

  // Add new categories for user suggestions
  newCategories.forEach(category => {
    const userActivitiesForCategory = userSuggestions
      .filter(suggestion => suggestion.category === category)
      .map(suggestion => ({
        id: suggestion.id,
        name: suggestion.activity_name,
        description: suggestion.description,
        location: suggestion.location,
        website: suggestion.website || undefined,
        isUserSubmitted: true,
        submittedBy: suggestion.name,
        notes: suggestion.notes || undefined,
        category: suggestion.category
      }));

    const getCategoryIcon = (category: string) => {
      const iconMap: { [key: string]: string } = {
        "Outdoors & Nature": "🌊",
        "Museums & History": "🏛️",
        "Food & Drink": "🍽️",
        "Entertainment": "🎭",
        "Shopping": "🛍️",
        "Day Trips": "⛵",
        "Family-Friendly": "👨‍👩‍👧‍👦",
        "Other": "✨"
      };
      return iconMap[category] || "✨";
    };

    featuredActivities.push({
      category,
      icon: getCategoryIcon(category),
      activities: userActivitiesForCategory
    });
  });

  return (
    <ThingsToDoClient 
      initialActivities={featuredActivities}
      initialUserSuggestions={userSuggestions}
    />
  );
}