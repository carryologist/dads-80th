import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bob Whiteley's 80th Birthday Celebration — July 5–12, 2026",
  description: "Join us for a week-long coastal celebration in Fairhaven & Mattapoisett, MA. House details, activities, and travel coordination for Dad's 80th birthday.",
  keywords: "birthday celebration, coastal vacation, family reunion, Buzzards Bay, Massachusetts",
  openGraph: {
    title: "Bob Whiteley's 80th Birthday Celebration",
    description: "A week on Buzzards Bay celebrating Dad's 80th birthday",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {/* Navigation */}
        <header className="sticky top-0 z-50 backdrop-blur border-b border-[var(--border-light)] bg-[var(--surface)]/90">
          <nav className="container flex items-center justify-between py-4">
            <Link href="/" className="font-display text-xl font-semibold text-gradient hover:scale-105 transition-transform">
              Bob&apos;s 80th 🎉
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/stay" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
                🏡 Stay Info
              </Link>
              <Link href="/things-to-do" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
                🌊 Things to Do
              </Link>
              <Link href="/itinerary" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
                📅 Itinerary
              </Link>
              <Link href="/travel-notes" className="text-sm font-medium hover:text-[var(--brand-primary)] transition-colors">
                📝 Travel Notes
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          <div className="py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
          <div className="container py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-display text-lg font-semibold mb-4 text-gradient">
                  Bob&apos;s 80th Celebration
                </h3>
                <p className="text-sm opacity-75 mb-4">
                  A week-long coastal adventure celebrating eight decades of Dad&apos;s amazing life.
                </p>
                <div className="badge badge-primary">
                  🏖️ July 5–12, 2026
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/stay" className="block text-sm hover:text-[var(--brand-primary)] transition-colors">
                    🏡 Stay Information
                  </Link>
                  <Link href="/things-to-do" className="block text-sm hover:text-[var(--brand-primary)] transition-colors">
                    🌊 Activities & Attractions
                  </Link>
                  <Link href="/itinerary" className="block text-sm hover:text-[var(--brand-primary)] transition-colors">
                    📅 Interactive Schedule
                  </Link>
                  <Link href="/travel-notes" className="block text-sm hover:text-[var(--brand-primary)] transition-colors">
                    📝 Share Travel Plans
                  </Link>
                  <a 
                    href="https://www.vrbo.com/4622953?uni_link=5197121" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block text-sm hover:text-[var(--brand-primary)] transition-colors"
                  >
                    🔗 VRBO Listing
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Location</h4>
                <p className="text-sm opacity-75 mb-2">
                  Fairhaven & Mattapoisett
                </p>
                <p className="text-sm opacity-75 mb-4">
                  Massachusetts, USA
                </p>
                <p className="text-xs opacity-60">
                  Waterfront home on beautiful Buzzards Bay
                </p>
              </div>
            </div>
            <div className="border-t border-[var(--border-light)] mt-8 pt-8 text-center">
              <p className="text-xs opacity-60">
                Made with ❤️ for Dad&apos;s 80th • Hosted on Vercel
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}