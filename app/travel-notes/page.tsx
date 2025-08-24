import { sql } from "@vercel/postgres";
import TravelForm from "./travel-form";

export default async function TravelNotesPage() {
  let rows: Array<{
    id: number;
    name: string;
    origin_city: string;
    origin_state: string | null;
    arrival_date: string;
    arrival_time: string | null;
    departure_date: string;
    departure_time: string | null;
    travel_mode: string | null;
    notes: string | null;
    created_at: string;
  }> = [];

  try {
    await sql`CREATE TABLE IF NOT EXISTS travelers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      origin_city TEXT NOT NULL,
      origin_state TEXT,
      arrival_date DATE NOT NULL,
      arrival_time TIME,
      departure_date DATE NOT NULL,
      departure_time TIME,
      travel_mode TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    const result = await sql<{
      id: number;
      name: string;
      origin_city: string;
      origin_state: string | null;
      arrival_date: string;
      arrival_time: string | null;
      departure_date: string;
      departure_time: string | null;
      travel_mode: string | null;
      notes: string | null;
      created_at: string;
    }>`SELECT id, name, origin_city, origin_state, arrival_date, arrival_time, departure_date, departure_time, travel_mode, notes, created_at
      FROM travelers
      ORDER BY arrival_date, name`;
    rows = result.rows;
  } catch (_e) {
    // Ignore errors so the page still renders if DB is not configured yet.
  }

  function fmtDate(d: string) {
    try {
      return new Date(d).toLocaleDateString(undefined, { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return d;
    }
  }
  
  function fmtTime(t: string | null) {
    if (!t) return "";
    try {
      const [h, m] = t.split(":");
      const d = new Date();
      d.setHours(parseInt(h, 10), parseInt(m, 10));
      return d.toLocaleTimeString(undefined, { 
        hour: "numeric", 
        minute: "2-digit" 
      });
    } catch {
      return t;
    }
  }

  return (
    <div className="container space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">✈️ Travel Coordination</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Share Your <span className="text-gradient">Travel Plans</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Help everyone coordinate arrivals, departures, and maybe share some rides! 
          Let us know when you&apos;re coming and going.
        </p>
      </div>

      {/* Travel Form Section */}
      <section className="max-w-2xl mx-auto">
        <div className="card card-travel p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🗓️</div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Add Your Travel Details
            </h2>
            <p className="text-sm opacity-75">
              Share your plans so we can coordinate and help each other out
            </p>
          </div>
          <TravelForm />
        </div>
      </section>

      {/* Travel Plans List */}
      <section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            Family <span className="text-gradient">Travel Plans</span>
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            See who&apos;s coming when and coordinate your arrivals
          </p>
        </div>
        
        {rows.length === 0 ? (
          <div className="card card-travel text-center p-12">
            <div className="text-6xl mb-4">🧳</div>
            <h3 className="font-display text-xl font-semibold mb-2">
              No Travel Plans Yet
            </h3>
            <p className="text-sm opacity-75 mb-6">
              Be the first to share your travel details! Others will follow once they see your plans.
            </p>
            <div className="badge badge-primary">
              👆 Use the form above to get started
            </div>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {rows.map((traveler, index) => (
              <div 
                key={traveler.id} 
                className="card hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {index % 4 === 0 ? "👨‍👩‍👧‍👦" : index % 4 === 1 ? "✈️" : index % 4 === 2 ? "🚗" : "🏖️"}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-semibold">
                        {traveler.name}
                      </h3>
                      <div className="badge badge-primary text-xs">
                        From {traveler.origin_city}
                        {traveler.origin_state ? `, ${traveler.origin_state}` : ""}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛬</span>
                        <div>
                          <p className="text-sm font-medium">
                            Arriving {fmtDate(traveler.arrival_date)}
                          </p>
                          {traveler.arrival_time && (
                            <p className="text-xs opacity-75">
                              {fmtTime(traveler.arrival_time)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛫</span>
                        <div>
                          <p className="text-sm font-medium">
                            Departing {fmtDate(traveler.departure_date)}
                          </p>
                          {traveler.departure_time && (
                            <p className="text-xs opacity-75">
                              {fmtTime(traveler.departure_time)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {traveler.notes && (
                      <div className="mt-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
                        <p className="text-sm opacity-80 whitespace-pre-wrap">
                          💬 {traveler.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="card card-travel p-8">
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Coordinate & Connect
          </h2>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            Once everyone shares their plans, we can coordinate rides from airports, 
            plan group activities, and make sure no one arrives to an empty house!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/stay" className="btn btn-secondary">
              🏡 View House Details
            </a>
            <a href="/things-to-do" className="btn btn-secondary">
              🌊 Explore Activities
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}