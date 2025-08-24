import { getTravelNotes, TravelNote } from "../../lib/storage";
import TravelPlanForm from "../../components/TravelPlanForm";

export default async function TravelNotes() {
  let travelNotes: TravelNote[] = [];

  try {
    travelNotes = await getTravelNotes();
  } catch (_e) {
    // Ignore errors so the page still renders if storage is not available yet.
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTravelIcon = (method: string) => {
    const iconMap: { [key: string]: string } = {
      "Flying": "✈️",
      "Driving": "🚗",
      "Train": "🚂",
      "Bus": "🚌",
      "Other": "🧳"
    };
    return iconMap[method] || "🧳";
  };

  return (
    <div className="container space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">✈️ Travel Coordination</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Travel <span className="text-gradient">Plans</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Help coordinate everyone&apos;s arrival and departure times for Dad&apos;s celebration. 
          Share your travel details so we can plan activities and meals together!
        </p>
      </div>

      {/* Existing Travel Plans */}
      {travelNotes.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              📅 Family <span className="text-gradient">Travel Plans</span>
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              Here&apos;s who&apos;s coming and when they&apos;ll be there!
            </p>
          </div>
          
          <div className="grid gap-6">
            {travelNotes.map((note, index) => (
              <div 
                key={note.id}
                className="card border-2 border-[var(--brand-accent)]/30 bg-gradient-to-r from-[var(--brand-accent)]/5 to-transparent hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {getTravelIcon(note.travel_method)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-3">
                      <h3 className="font-display text-xl font-semibold flex-1">
                        {note.name}
                      </h3>
                      <div className="badge badge-accent text-xs">
                        {note.travel_method}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-sm font-medium">Arriving</p>
                          <p className="text-sm opacity-75">{formatDate(note.arrival_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-sm font-medium">Departing</p>
                          <p className="text-sm opacity-75">{formatDate(note.departure_date)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {note.accommodation && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🏨</span>
                        <div>
                          <p className="text-sm font-medium">Staying at</p>
                          <p className="text-sm opacity-75">{note.accommodation}</p>
                        </div>
                      </div>
                    )}
                    
                    {note.notes && (
                      <div className="mt-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
                        <p className="text-sm opacity-80">
                          💭 {note.notes}
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

      {/* Travel Plan Form */}
      <section className="max-w-2xl mx-auto">
        <div className="card card-travel p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🗓️</div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Share Your Travel Plans
            </h2>
            <p className="text-sm opacity-75">
              Let everyone know when you&apos;re arriving and departing so we can coordinate activities!
            </p>
          </div>
          <TravelPlanForm />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="card card-travel p-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Ready to Celebrate?
          </h2>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            With everyone&apos;s travel plans coordinated, we can make sure Dad&apos;s 80th birthday 
            celebration is perfectly timed for maximum family fun!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/things-to-do" className="btn btn-primary">
              🌊 Explore Activities
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