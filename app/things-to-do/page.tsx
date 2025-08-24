import { sql } from "@vercel/postgres";
import ActivitySuggestionForm from "../../components/ActivitySuggestionForm";

interface ActivitySuggestion {
  id: number;
  name: string;
  activity_name: string;
  description: string;
  location: string | null;
  website: string | null;
  category: string;
  notes: string | null;
  created_at: string;
}

const featuredActivities = [
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
        name: "Mattapoisett Rail Trail & Ned&apos;s Point Lighthouse",
        description: "Scenic paved trail perfect for walking, biking, or jogging. Leads to stunning views of Ned&apos;s Point Lighthouse and Buzzards Bay. Connects to Phoenix Bike Trail for longer adventures.",
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
        description: "World&apos;s largest museum devoted to whaling history. Features the largest ship model in the world, scrimshaw collection, and interactive exhibits. Don&apos;t miss the 3D theater experience!",
        location: "New Bedford, MA",
        website: "https://www.whalingmuseum.org/visit/",
        image: "https://www.whalingmuseum.org/wp-content/uploads/2019/03/exterior-shot-1024x683.jpg",
        highlights: ["World&apos;s largest whaling museum", "3D theater", "Ship models", "Interactive exhibits"]
      },
      {
        name: "New Bedford Whaling National Historical Park",
        description: "Downtown walking tours through America&apos;s whaling capital. Explore cobblestone streets, historic buildings, and learn about the city&apos;s maritime heritage.",
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
        name: "Martha&apos;s Vineyard Ferry",
        description: "Take the Seastreak ferry from New Bedford to Martha&apos;s Vineyard. Skip Cape traffic and enjoy a scenic 1-hour cruise to this famous island destination.",
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
        description: "Fairhaven&apos;s first vineyard and winery in a charming converted 1920&apos;s dairy barn. Enjoy wine tastings, live music, and local food in a rustic setting.",
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
        description: "AZA-accredited zoo with over 200 animals from around the world. Features a children&apos;s zoo, train rides, and educational programs. Open 9am-4pm daily.",
        location: "New Bedford, MA",
        website: "https://www.bpzoo.org/visit-overview/",
        image: "https://www.bpzoo.org/wp-content/uploads/2019/03/zoo-entrance.jpg",
        highlights: ["200+ animals", "Children&apos;s zoo", "Train rides", "Educational programs"]
      }
    ]
  }
];

export default async function ThingsToDo() {
  let userSuggestions: ActivitySuggestion[] = [];

  try {
    await sql`CREATE TABLE IF NOT EXISTS activity_suggestions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      website TEXT,
      category TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    const result = await sql<ActivitySuggestion>`SELECT * FROM activity_suggestions ORDER BY created_at DESC`;
    userSuggestions = result.rows;
  } catch (_e) {
    // Ignore errors so the page still renders if DB is not configured yet.
  }

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
              <div 
                key={activity.name}
                className="card hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${(categoryIndex * 2 + activityIndex) * 0.1}s` }}
              >
                <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                  {/* Activity Image */}
                  <div className="relative aspect-[4/3] lg:aspect-[3/2] image-rounded overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
                      <div className="text-6xl opacity-50">{categoryGroup.icon}</div>
                    </div>
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-3">
                      <h3 className="font-display text-xl font-semibold flex-1">
                        {activity.name}
                      </h3>
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
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* User Suggestions Section */}
      {userSuggestions.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              💫 Family <span className="text-gradient">Suggestions</span>
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              Great ideas shared by our family members!
            </p>
          </div>
          
          <div className="grid gap-6">
            {userSuggestions.map((suggestion, index) => (
              <div 
                key={suggestion.id}
                className="card border-2 border-[var(--brand-accent)]/30 bg-gradient-to-r from-[var(--brand-accent)]/5 to-transparent hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <h3 className="font-display text-lg font-semibold flex-1">
                        {suggestion.activity_name}
                      </h3>
                      <div className="badge badge-accent text-xs">
                        Suggested by {suggestion.name}
                      </div>
                      {suggestion.website && (
                        <a
                          href={suggestion.website}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary text-sm"
                        >
                          🔗 Visit
                        </a>
                      )}
                    </div>
                    
                    <div className="badge badge-primary text-xs mb-3">
                      {suggestion.category}
                    </div>
                    
                    {suggestion.location && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📍</span>
                        <p className="text-sm opacity-75">{suggestion.location}</p>
                      </div>
                    )}
                    
                    <p className="text-sm opacity-80 mb-3 leading-relaxed">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.notes && (
                      <div className="mt-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
                        <p className="text-sm opacity-80">
                          💭 {suggestion.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
    </div>
  );
}