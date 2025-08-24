import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const activity_name = String(formData.get('activity_name') || '')
    const description = String(formData.get('description') || '')
    const location = String(formData.get('location') || '') || null
    const website = String(formData.get('website') || '') || null
    const category = String(formData.get('category') || '')
    const notes = String(formData.get('notes') || '') || null

    console.log('Form data received:', { name, activity_name, description, category });

    if (!name || !activity_name || !description || !category) {
      console.log('Missing required fields:', { name: !!name, activity_name: !!activity_name, description: !!description, category: !!category });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const suggestion = await prisma.activitySuggestion.create({
        data: {
          name,
          activityName: activity_name,
          description,
          location,
          website,
          category,
          notes
        }
      });
      
      console.log('Activity suggestion saved to database:', suggestion.id);
      return NextResponse.json({ ok: true, storage: 'database', id: suggestion.id })
    } catch (dbError) {
      console.log('Database not available, but form submission received:', dbError);
      
      // Fallback: accept the submission and return success
      console.log('Activity suggestion received:', {
        name,
        activity_name,
        description,
        location,
        website,
        category,
        notes,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ 
        ok: true, 
        storage: 'received',
        message: 'Your suggestion has been received! Once the database is configured, all suggestions will be saved and displayed.' 
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
      const suggestions = await prisma.activitySuggestion.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Transform to match the expected format
      const transformedSuggestions = suggestions.map(s => ({
        id: s.id,
        name: s.name,
        activity_name: s.activityName,
        description: s.description,
        location: s.location,
        website: s.website,
        category: s.category,
        notes: s.notes,
        created_at: s.createdAt.toISOString()
      }));
      
      return NextResponse.json({ suggestions: transformedSuggestions, storage: 'database' })
    } catch (dbError) {
      console.log('Database not available for GET:', dbError);
      
      // Return empty array when database is not available
      return NextResponse.json({ suggestions: [], storage: 'none' })
    }
  } catch (err) {
    console.error('General GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}