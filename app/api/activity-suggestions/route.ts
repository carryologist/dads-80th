import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const activity_name = String(formData.get('activity_name') || '')
    const description = String(formData.get('description') || '')
    const location = String(formData.get('location') || '')
    const website = String(formData.get('website') || '')
    const category = String(formData.get('category') || '')
    const notes = String(formData.get('notes') || '')

    if (!name || !activity_name || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sql`CREATE TABLE IF NOT EXISTS activity_suggestions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      website TEXT,
      category TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    await sql`INSERT INTO activity_suggestions (name, activity_name, description, location, website, category, notes)
      VALUES (${name}, ${activity_name}, ${description}, ${location}, ${website}, ${category}, ${notes})`;

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS activity_suggestions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      website TEXT,
      category TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    const result = await sql`SELECT * FROM activity_suggestions ORDER BY created_at DESC`;
    return NextResponse.json({ suggestions: result.rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
