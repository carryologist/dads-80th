import { prisma } from "../../lib/prisma";
import ActivitySuggestionForm from "../../components/ActivitySuggestionForm";
import ThingsToDoClient from "../../components/ThingsToDoClient";

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
        image: "https://www.mass.gov/files/styles/banner_tablet/public/2017-07/FtPhoenix2KC_Mobile_0.jpeg?h=8869a3dd&itok=OjvX4KzI",
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
        image: "https://www.mass.gov/files/styles/banner_tablet/public/2017-07/WoodsMOBILE_9.jpg?h=8869a3dd&itok=n9eR48Xg",
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
        image: "https://www.whalingmuseum.org/wp-content/uploads/bb-plugin/cache/IMG_2449-scaled-panorama-0735e9c670abdc1962c9750e2dce27e3-njmoqc0k4se5.jpg",
        highlights: ["World's largest whaling museum", "3D theater", "Ship models", "Interactive exhibits"]
      },
      {
        name: "New Bedford Whaling National Historical Park",
        description: "Downtown walking tours through America's whaling capital. Explore cobblestone streets, historic buildings, and learn about the city's maritime heritage.",
        location: "New Bedford, MA",
        website: "https://www.nps.gov/nebe/index.htm",
        image: "https://www.nps.gov/common/uploads/grid_builder/nebe/crop16_9/723B92D9-B6F1-09CD-55042B686635800E.jpg?width=640&quality=90&mode=crop",
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
        website: "https://cuttyhunkferryco.com/",
        image: "https://cuttyhunkferryco.com/wp-content/uploads/2021/01/HERO-mvcuttyhunk5-768x439.jpg",
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
        image: "https://static.wixstatic.com/media/35b225_a701cdf9a13b4deea021fa3d77465fcc~mv2.jpg/v1/fill/w_1600,h_1648,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/35b225_a701cdf9a13b4deea021fa3d77465fcc~mv2.jpg",
        highlights: ["Local wines", "Live music", "Historic barn", "Outdoor patio"]
      },
      {
        name: "Oxford Creamery",
        description: "Classic Mattapoisett seafood restaurant and ice cream shop. Famous for their fresh seafood and homemade ice cream with harbor views.",
        location: "Mattapoisett, MA",
        website: "https://www.oxfordcreamery.com/",
        image: "https://i0.wp.com/oxfordcreamery.com/wp-content/uploads/2022/03/Oxcart-rendering.png?w=910&ssl=1",
        highlights: ["Fresh seafood", "Homemade ice cream", "Harbor views", "Local favorite"]
      },
      {
        name: "The Black Whale",
        description: "Waterfront dining in New Bedford with fresh seafood and craft cocktails. Great views of the harbor and excellent for special dinners.",
        location: "New Bedford Waterfront",
        website: "https://www.theblackwhale.com/",
        image: "https://www.theblackwhale.com/wp-content/uploads/2019/08/black-whale-exterior-1024x683.jpg",
        highlights: ["Waterfront dining", "Fresh seafood", "Craft cocktails", "Harbor views"]
      },
      {
        name: "Turks Seafood",
        description: "Local seafood market and restaurant known for fresh catches and casual dining. Perfect for authentic New England seafood experience.",
        location: "Mattapoisett, MA",
        website: "https://www.turksseafood.com/",
        image: "https://www.turksseafood.com/wp-content/uploads/2021/05/DSC08499.jpg",
        highlights: ["Fresh seafood", "Local market", "Casual dining", "New England classics"]
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
        image: "https://www.bpzoo.org/wp-content/smush-webp/2015/07/DSC_0629.jpg.webp",
        highlights: ["200+ animals", "Children's zoo", "Train rides", "Educational programs"]
      }
    ]
  }
];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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