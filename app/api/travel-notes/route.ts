import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const origin_city = String(formData.get('origin_city') || '')
    const origin_state = String(formData.get('origin_state') || '')
    const arrival_date = String(formData.get('arrival_date') || '')
    const arrival_time = String(formData.get('arrival_time') || '')
    const departure_date = String(formData.get('departure_date') || '')
    const departure_time = String(formData.get('departure_time') || '')
    const travel_mode = String(formData.get('travel_mode') || '')
    const notes = String(formData.get('notes') || '')

    if (!name || !origin_city || !arrival_date || !departure_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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

    await sql`INSERT INTO travelers (name, origin_city, origin_state, arrival_date, arrival_time, departure_date, departure_time, travel_mode, notes)
      VALUES (${name}, ${origin_city}, ${origin_state}, ${arrival_date}, ${arrival_time || null}, ${departure_date}, ${departure_time || null}, ${travel_mode}, ${notes})`;

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}