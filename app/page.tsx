import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">Dad&apos;s 80th</h1>
      <p className="text-sm text-black/70 dark:text-white/70">July 5–12, 2026</p>
      <p>
        Welcome! This site has details about where we&apos;re staying, ideas for things to do nearby,
        and a place to share your travel plans so we can coordinate rides and arrivals.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/stay" className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Stay Info</Link>
        <Link href="/things-to-do" className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Things to Do</Link>
        <Link href="/travel-notes" className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Share Travel Notes</Link>
        <a
          href="https://www.vrbo.com/4622953?uni_link=5197121"
          target="_blank"
          rel="noreferrer"
          className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
        >
          View the VRBO listing
        </a>
      </div>
    </div>
  );
}