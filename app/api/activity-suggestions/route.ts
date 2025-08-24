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

    console.log('Form data received:', { name, activity_name, description, category });

    if (!name || !activity_name || !description || !category) {
      console.log('Missing required fields:', { name: !!name, activity_name: !!activity_name, description: !!description, category: !!category });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try to create table
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
      console.log('Table creation/check successful');
    } catch (tableError) {
      console.error('Table creation error:', tableError);
      return NextResponse.json({ error: 'Database setup error' }, { status: 500 })
    }

    // Try to insert data
    try {
      await sql`INSERT INTO activity_suggestions (name, activity_name, description, location, website, category, notes)
        VALUES (${name}, ${activity_name}, ${description}, ${location}, ${website}, ${category}, ${notes})`;
      console.log('Data insertion successful');
    } catch (insertError) {
      console.error('Data insertion error:', insertError);
      return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('General API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}