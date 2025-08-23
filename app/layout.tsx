import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dad&apos;s 80th — July 5–12, 2026",
  description: "Info for our family trip: house details, things to do, and travel notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b border-black/10 dark:border-white/10">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4 text-sm">
            <Link href="/" className="font-medium">
              Dad&apos;s 80th
            </Link>
            <div className="flex gap-4">
              <Link href="/stay">Stay Info</Link>
              <Link href="/things-to-do">Things to Do</Link>
              <Link href="/travel-notes">Travel Notes</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8 min-h-[70vh]">
          {children}
        </main>
        <footer className="border-t border-black/10 dark:border-white/10 text-xs text-center p-6">
          July 5–12, 2026 • Hosted on Vercel
        </footer>
      </body>
    </html>
  );
}