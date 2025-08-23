export default function StayInfo() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Stay Info</h1>
      <p>We&apos;re staying July 5–12, 2026.</p>
      <p>
        VRBO listing: {" "}
        <a
          href="https://www.vrbo.com/4622953?uni_link=5197121"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:opacity-80"
        >
          https://www.vrbo.com/4622953
        </a>
      </p>
      <div className="text-sm text-black/70 dark:text-white/70">
        <p>We&apos;ll add address, check-in/out, Wi‑Fi, parking, and house rules here.</p>
      </div>
    </div>
  );
}
