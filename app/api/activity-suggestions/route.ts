import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { saveActivitySuggestion, getActivitySuggestions } from '../../../lib/storage'

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

    // Try database first, fallback to file storage
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
      
      await sql`INSERT INTO activity_suggestions (name, activity_name, description, location, website, category, notes)
        VALUES (${name}, ${activity_name}, ${description}, ${location}, ${website}, ${category}, ${notes})`;
      
      console.log('Data saved to database successfully');
      return NextResponse.json({ ok: true, storage: 'database' })
    } catch (dbError) {
      console.log('Database failed, using file storage:', dbError);
      
      // Fallback to file storage
      try {
        await saveActivitySuggestion({
          name,
          activity_name,
          description,
          location,
          website,
          category,
          notes
        });
        
        console.log('Data saved to file storage successfully');
        return NextResponse.json({ ok: true, storage: 'file' })
      } catch (fileError) {
        console.error('File storage also failed:', fileError);
        return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 })
      }
    }
  } catch (err) {
    console.error('General API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Try database first, fallback to file storage
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
      return NextResponse.json({ suggestions: result.rows, storage: 'database' })
    } catch (dbError) {
      console.log('Database failed, using file storage for GET:', dbError);
      
      // Fallback to file storage
      const suggestions = await getActivitySuggestions();
      return NextResponse.json({ suggestions, storage: 'file' })
    }
  } catch (err) {
    console.error('General GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}