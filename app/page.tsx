import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function Countdown() {
  const event = new Date("2026-07-05T00:00:00-04:00").getTime();
  const now = Date.now();
  const diff = Math.max(0, event - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return (
    <div className="mt-4 text-sm/6 sm:text-base/7">
      <span className="badge bg-white/20 text-white">Countdown: {d}d {h}h {m}m</span>
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
    <div className="grid gap-12">
      {/* Hero */}
      <section className="relative h-[46vh] sm:h-[60vh] w-full overflow-hidden rounded-xl">
        <Image
          src="/bob-whiteley.jpg"
          alt="Bob Whiteley by the water"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="badge bg-white/20 text-white mb-2">July 5–12, 2026 • Fairhaven & Mattapoisett, MA</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Bob Whiteley turns 80</h1>
            <p className="mt-3 text-sm/6 sm:text-base/7 opacity-95">
              A week on Buzzards Bay with family, seaside sunsets, and celebrations.
            </p>
            <Suspense>
              <Countdown />
            </Suspense>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/travel-notes" className="rounded bg-[var(--color-brand)] text-white px-5 py-2.5 hover:opacity-90">
                Share your travel plan
              </Link>
              <a
                href="https://www.vrbo.com/4622953?uni_link=5197121"
                target="_blank"
                rel="noreferrer"
                className="rounded border px-5 py-2.5 bg-white/90 text-[var(--color-foreground)] hover:bg-white"
              >
                View the house on VRBO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container grid gap-8">
        <h2 className="text-2xl font-medium">Plan the week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border p-5 hover:shadow-sm transition">
            <h3 className="font-medium mb-1">Stay Info</h3>
            <p className="text-sm opacity-75">Address, check-in/out, Wi‑Fi, parking, and the house link.</p>
            <Link href="/stay" className="text-[var(--color-brand)] text-sm mt-3 inline-block">View details →</Link>
          </div>
          <div className="rounded-xl border p-5 hover:shadow-sm transition">
            <h3 className="font-medium mb-1">Things to Do</h3>
            <p className="text-sm opacity-75">Beaches, bike trails, museums, ferries to MV and Cuttyhunk.</p>
            <Link href="/things-to-do" className="text-[var(--color-brand)] text-sm mt-3 inline-block">Explore ideas →</Link>
          </div>
          <div className="rounded-xl border p-5 hover:shadow-sm transition">
            <h3 className="font-medium mb-1">Travel Notes</h3>
            <p className="text-sm opacity-75">Share when you’re arriving and how you’re getting here.</p>
            <Link href="/travel-notes" className="text-[var(--color-brand)] text-sm mt-3 inline-block">Add your plan →</Link>
          </div>
        </div>
      </section>

      {/* VRBO gallery */}
      <section className="container grid gap-6 section">
        <div>
          <h2 className="text-2xl font-medium">A peek at the house</h2>
          <p className="text-sm opacity-75">A few photos from the listing to get everyone excited.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {vrboImages.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border">
              <Image src={src} alt={`House photo ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* VRBO blurb */}
      <section className="container section rounded-xl border bg-white/50 dark:bg-white/5">
        <div className="grid md:grid-cols-[1fr_360px] gap-6 items-center">
          <div>
            <h2 className="text-2xl font-medium">Our home base</h2>
            <p className="mt-2 text-sm opacity-80">
              Waterfront vibes, cozy rooms, and quick access to beaches, bike paths, and lighthouses. We’ll post the
              address and house details in Stay Info, but you can also peek at the listing on VRBO.
            </p>
            <a
              href="https://www.vrbo.com/4622953?uni_link=5197121"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Open VRBO listing
            </a>
          </div>
          <div className="relative w-full h-[220px] sm:h-[260px] rounded-lg overflow-hidden border">
            <Image
              src={vrboImages[0]}
              alt="House exterior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}