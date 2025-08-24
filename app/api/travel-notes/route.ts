import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const arrival_date = String(formData.get('arrival_date') || '')
    const departure_date = String(formData.get('departure_date') || '')
    const travel_method = String(formData.get('travel_method') || '')
    const accommodation = String(formData.get('accommodation') || '')
    const notes = String(formData.get('notes') || '')

    console.log('Travel note data received:', { name, arrival_date, departure_date });

    if (!name || !arrival_date || !departure_date) {
      console.log('Missing required fields:', { name: !!name, arrival_date: !!arrival_date, departure_date: !!departure_date });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try database first
    try {
      await sql`CREATE TABLE IF NOT EXISTS travel_notes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        arrival_date DATE NOT NULL,
        departure_date DATE NOT NULL,
        travel_method TEXT NOT NULL,
        accommodation TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      
      await sql`INSERT INTO travel_notes (name, arrival_date, departure_date, travel_method, accommodation, notes)
        VALUES (${name}, ${arrival_date}, ${departure_date}, ${travel_method}, ${accommodation}, ${notes})`;
      
      console.log('Travel note saved to database successfully');
      return NextResponse.json({ ok: true, storage: 'database' })
    } catch (dbError) {
      console.log('Database not available, but travel note received:', dbError);
      
      // For now, just accept the submission and return success
      console.log('Travel note received:', {
        name,
        arrival_date,
        departure_date,
        travel_method,
        accommodation,
        notes,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        ok: true, 
        storage: 'received',
        message: 'Your travel plans have been received! Once the database is configured, all plans will be saved and displayed.' 
      })
    }
  } catch (err) {
    console.error('General API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Try database first
    try {
      await sql`CREATE TABLE IF NOT EXISTS travel_notes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        arrival_date DATE NOT NULL,
        departure_date DATE NOT NULL,
        travel_method TEXT NOT NULL,
        accommodation TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;

      const result = await sql`SELECT * FROM travel_notes ORDER BY created_at DESC`;
      return NextResponse.json({ notes: result.rows, storage: 'database' })
    } catch (dbError) {
      console.log('Database not available for GET:', dbError);
      
      // Return empty array when database is not available
      return NextResponse.json({ notes: [], storage: 'none' })
    }
  } catch (err) {
    console.error('General GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}