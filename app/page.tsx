import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import PhotoCarousel from "../components/PhotoCarousel";

function Countdown() {
  const event = new Date("2026-07-05T00:00:00-04:00").getTime();
  const now = Date.now();
  const diff = Math.max(0, event - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return (
    <div className="mt-6 animate-fade-in">
      <div className="badge badge-white text-shadow">
        ⏰ Countdown: {d} days, {h} hours, {m} minutes
      </div>
    </div>
  );
}

const vrboImages = [
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/6b649ff4.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/dc5a44ce.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/981b217b.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/d62942da.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/w1200h799x0y1-6c743a1d.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/930c971a.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  "https://media.vrbo.com/lodging/118000000/117070000/117064100/117064047/c39b8b7d.jpg?impolicy=resizecrop&rw=1200&ra=fit",
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden image-hero animate-fade-in">
        <Image
          src="/bob-whiteley-hero.jpg"
          alt="Bob Whiteley by the water - celebrating 80 years of life"
          fill
          priority
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center hero-content">
          <div className="text-center text-white px-6 max-w-4xl animate-slide-up">
            <div className="badge badge-white mb-4 text-shadow">
              🏖️ July 5–12, 2026 • Fairhaven & Mattapoisett, MA
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-shadow">
              Bob Whiteley turns <span className="text-gradient-hero">80</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl opacity-95 mb-2 text-shadow max-w-3xl mx-auto">
              A week on Buzzards Bay with family, seaside sunsets, and celebrations.
            </p>
            <p className="text-sm sm:text-base opacity-80 text-shadow mb-8">
              Join us for an unforgettable coastal adventure celebrating eight decades of Dad&apos;s amazing life.
            </p>
            <Suspense>
              <Countdown />
            </Suspense>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/travel-notes" className="btn btn-hero-primary animate-float min-w-[240px]">
                ✈️ Share Your Travel Plan
              </Link>
              <a
                href="https://www.vrbo.com/4622953?uni_link=5197121"
                target="_blank"
                rel="noreferrer"
                className="btn btn-hero-secondary min-w-[240px]"
              >
                🏠 View the House on VRBO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Cards */}
      <section className="container animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4 text-gradient">
            Plan Your Perfect Week
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Everything you need to make the most of our coastal celebration
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-travel hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-4">🏡</div>
            <h3 className="font-display text-xl font-semibold mb-2">Stay Info</h3>
            <p className="text-sm opacity-75 mb-4">
              Address, check-in details, Wi‑Fi, parking, and everything about our beautiful waterfront home.
            </p>
            <Link href="/stay" className="btn btn-primary w-full">
              View Details →
            </Link>
          </div>
          <div className="card card-travel hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-4">🌊</div>
            <h3 className="font-display text-xl font-semibold mb-2">Things to Do</h3>
            <p className="text-sm opacity-75 mb-4">
              Beaches, bike trails, museums, ferries to Martha&apos;s Vineyard and Cuttyhunk Island.
            </p>
            <Link href="/things-to-do" className="btn btn-primary w-full">
              Explore Activities →
            </Link>
          </div>
          <div className="card card-travel hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="font-display text-xl font-semibold mb-2">Travel Notes</h3>
            <p className="text-sm opacity-75 mb-4">
              Share your arrival plans, coordinate rides, and connect with other family members.
            </p>
            <Link href="/travel-notes" className="btn btn-primary w-full">
              Share Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* House Gallery */}
      <section className="container animate-fade-in" style={{ marginTop: '120px' }}>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            A Peek at Our <span className="text-gradient">Coastal Haven</span>
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Get excited about our beautiful waterfront home with these stunning photos from the listing
          </p>
        </div>
        <PhotoCarousel images={vrboImages} />
      </section>

      {/* Featured House Section */}
      <section className="container animate-fade-in">
        <div className="card card-travel p-8 lg:p-12">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-center">
            <div>
              <div className="badge badge-primary mb-4">🏖️ Waterfront Property</div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
                Our <span className="text-gradient">Home Base</span>
              </h2>
              <div className="mb-6">
                <div className="badge badge-accent mb-3">📍 Exact Address</div>
                <p className="text-xl font-semibold mb-2">4 Brook Dr, Mattapoisett, MA</p>
                <p className="text-lg opacity-80 leading-relaxed">
                  Experience waterfront vibes, cozy rooms, and quick access to pristine beaches, 
                  scenic bike paths, and historic lighthouses. This beautiful property offers 
                  the perfect setting for our coastal celebration.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.vrbo.com/4622953?uni_link=5197121"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-accent"
                >
                  🔗 Open VRBO Listing
                </a>
                <Link href="/stay" className="btn btn-secondary">
                  📋 View Stay Details
                </Link>
              </div>
            </div>
            <div className="relative w-full h-[300px] lg:h-[350px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=4+Brook+Dr,+Mattapoisett,+MA+02739&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="4 Brook Dr, Mattapoisett, MA - Our Home Base Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container animate-fade-in">
        <div className="text-center py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            Ready to Celebrate <span className="text-gradient">Dad&apos;s 80th</span>?
          </h2>
          <p className="text-lg opacity-75 mb-8 max-w-2xl mx-auto">
            Don&apos;t forget to share your travel plans so we can coordinate arrivals and maybe share some rides!
          </p>
          <Link href="/travel-notes" className="btn btn-accent text-lg px-8 py-4 animate-float">
            ✈️ Share Your Travel Plans
          </Link>
        </div>
      </section>
    </div>
  );
}