import Image from "next/image";

const vrboImages = [
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/6b649ff4.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/dc5a44ce.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/981b217b.jpg?impolicy=resizecrop&rw=1200&ra=fit",
];

export default function StayInfo() {
  return (
    <div className="container space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">🏡 Accommodation Details</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Our <span className="text-gradient">Waterfront Home</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Everything you need to know about our beautiful coastal retreat for Dad&apos;s 80th celebration
        </p>
      </div>

      {/* Key Information */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="card card-travel">
          <div className="text-3xl mb-4">📅</div>
          <h2 className="font-display text-2xl font-semibold mb-4">Trip Dates</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛋</span>
              <div>
                <p className="font-medium">Check-in: July 5, 2026</p>
                <p className="text-sm opacity-75">Saturday afternoon</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛎</span>
              <div>
                <p className="font-medium">Check-out: July 12, 2026</p>
                <p className="text-sm opacity-75">Saturday morning</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[var(--brand-primary)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--brand-primary)]">
                ✨ Full week stay: 7 nights of coastal bliss!
              </p>
            </div>
          </div>
        </div>

        <div className="card card-travel">
          <div className="text-3xl mb-4">📍</div>
          <h2 className="font-display text-2xl font-semibold mb-4">Location</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">🏖️</span>
              <div>
                <p className="font-medium">Fairhaven & Mattapoisett</p>
                <p className="text-sm opacity-75">Massachusetts, USA</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">🌊</span>
              <div>
                <p className="font-medium">Buzzards Bay Waterfront</p>
                <p className="text-sm opacity-75">Direct water access</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[var(--brand-accent)]/10 rounded-lg">
              <p className="text-sm font-medium text-[var(--brand-accent)]">
                🗺️ Exact address will be shared closer to the trip
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VRBO Information */}
      <section className="card card-travel p-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-center">
          <div>
            <div className="badge badge-primary mb-4">🔗 Official Listing</div>
            <h2 className="font-display text-3xl font-semibold mb-4">
              VRBO Property Details
            </h2>
            <p className="text-lg opacity-80 mb-6">
              View the complete property listing with all amenities, photos, and reviews. 
              This is where you can see the full details of our beautiful waterfront home.
            </p>
            <a
              href="https://www.vrbo.com/4622953?uni_link=5197121"
              target="_blank"
              rel="noreferrer"
              className="btn btn-accent"
            >
              🔗 View Full VRBO Listing
            </a>
          </div>
          <div className="relative w-full h-[250px] image-rounded">
            <Image
              src={vrboImages[0]}
              alt="Waterfront house exterior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* House Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            What to <span className="text-gradient">Expect</span>
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Here&apos;s what we know about our coastal home base
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">🌊</div>
            <h3 className="font-display text-lg font-semibold mb-2">Waterfront Access</h3>
            <p className="text-sm opacity-75">
              Direct access to Buzzards Bay with beautiful water views and coastal activities.
            </p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">🛏️</div>
            <h3 className="font-display text-lg font-semibold mb-2">Comfortable Rooms</h3>
            <p className="text-sm opacity-75">
              Cozy accommodations for the whole family with all the amenities you need.
            </p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">🎅</div>
            <h3 className="font-display text-lg font-semibold mb-2">Family Friendly</h3>
            <p className="text-sm opacity-75">
              Perfect setup for multi-generational gatherings and family celebrations.
            </p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">🚗</div>
            <h3 className="font-display text-lg font-semibold mb-2">Parking Available</h3>
            <p className="text-sm opacity-75">
              Convenient parking for multiple vehicles - perfect for family arrivals.
            </p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">📶</div>
            <h3 className="font-display text-lg font-semibold mb-2">Wi-Fi & Connectivity</h3>
            <p className="text-sm opacity-75">
              Stay connected with reliable internet for sharing memories and coordination.
            </p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="font-display text-lg font-semibold mb-2">Full Kitchen</h3>
            <p className="text-sm opacity-75">
              Complete kitchen facilities for family meals and special birthday celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="card card-travel text-center p-8">
        <div className="text-4xl mb-4">🕰️</div>
        <h2 className="font-display text-2xl font-semibold mb-4">
          More Details Coming Soon
        </h2>
        <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
          We&apos;ll update this page with the complete address, detailed check-in instructions, 
          Wi-Fi passwords, house rules, and any special notes as we get closer to the trip.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.vrbo.com/4622953?uni_link=5197121"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            🔍 View VRBO for More Photos
          </a>
          <a href="/travel-notes" className="btn btn-secondary">
            📝 Share Your Travel Plans
          </a>
        </div>
      </section>
    </div>
  );
}