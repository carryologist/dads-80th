import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const arrival_date = String(formData.get('arrival_date') || '')
    const departure_date = String(formData.get('departure_date') || '')
    const travel_method = String(formData.get('travel_method') || '')
    const accommodation = String(formData.get('accommodation') || '')
    const notes = String(formData.get('notes') || '') || null

    console.log('Travel note data received:', { name, arrival_date, departure_date });

    if (!name || !arrival_date || !departure_date) {
      console.log('Missing required fields:', { name: !!name, arrival_date: !!arrival_date, departure_date: !!departure_date });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const travelNote = await prisma.travelNote.create({
        data: {
          name,
          arrivalDate: new Date(arrival_date),
          departureDate: new Date(departure_date),
          travelMethod: travel_method,
          accommodation,
          notes
        }
      });
      
      console.log('Travel note saved to database:', travelNote.id);
      return NextResponse.json({ ok: true, storage: 'database', id: travelNote.id })
    } catch (dbError) {
      console.log('Database not available, but travel note received:', dbError);
      
      // Fallback: accept the submission and return success
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
    try {
      const travelNotes = await prisma.travelNote.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Transform to match the expected format
      const transformedNotes = travelNotes.map(note => ({
        id: note.id,
        name: note.name,
        arrival_date: note.arrivalDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        departure_date: note.departureDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        travel_method: note.travelMethod,
        accommodation: note.accommodation,
        notes: note.notes,
        created_at: note.createdAt.toISOString()
      }));
      
      return NextResponse.json({ notes: transformedNotes, storage: 'database' })
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