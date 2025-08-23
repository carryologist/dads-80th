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
  } catch (e) {
    // Ignore errors so the page still renders if DB is not configured yet.
  }

  function fmtDate(d: string) {
    try {
      return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
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
      return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    } catch {
      return t;
    }
  }

  return (
    <div className="grid gap-8 max-w-3xl">
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold">Travel Notes</h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Add your arrival and departure so everyone can coordinate rides and arrivals.
        </p>
      </div>

      <TravelForm />

      <div className="grid gap-3">
        <h2 className="text-xl font-medium">Family travel plans</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-black/70 dark:text-white/70">No submissions yet.</p>
        ) : (
          <ul className="grid gap-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded border p-3">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm">
                  From {r.origin_city}
                  {r.origin_state ? `, ${r.origin_state}` : ""}
                </div>
                <div className="text-sm">
                  {fmtDate(r.arrival_date)} {fmtTime(r.arrival_time)} → {fmtDate(r.departure_date)} {fmtTime(r.departure_time)} {r.travel_mode ? `• ${r.travel_mode}` : ""}
                </div>
                {r.notes ? <div className="text-sm mt-1 whitespace-pre-wrap">{r.notes}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}