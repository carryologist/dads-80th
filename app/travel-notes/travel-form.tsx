"use client";
import { useState } from "react";

export default function TravelForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setStatus(null);
    const res = await fetch("/api/travel-notes", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setStatus("Something went wrong. Please try again.");
    } else {
      setStatus("Thanks! Your travel note has been recorded.");
      (document.getElementById("travel-notes-form") as HTMLFormElement)?.reset();
    }
    setSubmitting(false);
  }

  return (
    <form id="travel-notes-form" action={onSubmit} className="grid gap-3">
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="name">Name</label>
        <input id="name" name="name" required className="border rounded px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="origin_city">Origin City</label>
        <input id="origin_city" name="origin_city" required className="border rounded px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="origin_state">Origin State/Province</label>
        <input id="origin_state" name="origin_state" className="border rounded px-3 py-2 bg-transparent" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm" htmlFor="arrival_date">Arrival Date</label>
        <input id="arrival_date" name="arrival_date" type="date" required className="border rounded px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="arrival_time">Arrival Time (optional)</label>
        <input id="arrival_time" name="arrival_time" type="time" className="border rounded px-3 py-2 bg-transparent" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm" htmlFor="departure_date">Departure Date</label>
        <input id="departure_date" name="departure_date" type="date" required className="border rounded px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="departure_time">Departure Time (optional)</label>
        <input id="departure_time" name="departure_time" type="time" className="border rounded px-3 py-2 bg-transparent" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm" htmlFor="travel_mode">Travel Mode</label>
        <select id="travel_mode" name="travel_mode" className="border rounded px-3 py-2 bg-transparent">
          <option>Car</option>
          <option>Plane</option>
          <option>Train</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" className="border rounded px-3 py-2 bg-transparent" rows={4} />
      </div>
      <button disabled={submitting} className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit"}
      </button>
      {status && <p className="text-sm">{status}</p>}
    </form>
  );
}
