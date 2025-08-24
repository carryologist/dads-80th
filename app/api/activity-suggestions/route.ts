import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Initialize database tables
async function initializeDatabase() {
  try {
    // This will create tables if they don't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "activity_suggestions" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "activity_name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "location" TEXT,
        "website" TEXT,
        "category" TEXT NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "activity_suggestions_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('Activity suggestions table ready');
    return true;
  } catch (error) {
    console.log('Database initialization error (might already exist):', error);
    return true; // Continue anyway, table might already exist
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== ACTIVITY SUGGESTION POST REQUEST ===');
    
    // Initialize database first
    await initializeDatabase();
    
    const formData = await request.formData()
    const name = String(formData.get('name') || '')
    const activity_name = String(formData.get('activity_name') || '')
    const description = String(formData.get('description') || '')
    const location = String(formData.get('location') || '') || null
    const website = String(formData.get('website') || '') || null
    const category = String(formData.get('category') || '')
    const notes = String(formData.get('notes') || '') || null

    console.log('Form data received:', { name, activity_name, description, category, location, website, notes });

    if (!name || !activity_name || !description || !category) {
      console.log('Missing required fields:', { name: !!name, activity_name: !!activity_name, description: !!description, category: !!category });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      console.log('Attempting to save to database...');
      
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
      
      console.log('✅ Activity suggestion saved successfully:', suggestion.id);
      
      // Verify it was saved by reading it back
      const verification = await prisma.activitySuggestion.findUnique({
        where: { id: suggestion.id }
      });
      
      console.log('✅ Verification - record exists:', !!verification);
      
      return NextResponse.json({ 
        ok: true, 
        storage: 'database', 
        id: suggestion.id,
        message: 'Activity suggestion saved successfully!'
      })
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      
      // Fallback: accept the submission and return success
      console.log('📝 Logging activity suggestion for manual review:', {
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
        storage: 'logged',
        message: 'Your suggestion has been received and logged! If you don\'t see it appear shortly, please let us know.' 
      })
    }
  } catch (err) {
    console.error('❌ General API error:', err)
    return NextResponse.json({ error: 'Server error: ' + String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('=== ACTIVITY SUGGESTIONS GET REQUEST ===');
    
    // Initialize database first
    await initializeDatabase();
    
    try {
      console.log('Fetching activity suggestions from database...');
      
      const suggestions = await prisma.activitySuggestion.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`✅ Found ${suggestions.length} activity suggestions`);
      
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
      console.error('❌ Database error on GET:', dbError);
      
      // Return empty array when database is not available
      return NextResponse.json({ suggestions: [], storage: 'none', error: String(dbError) })
    }
  } catch (err) {
    console.error('❌ General GET error:', err)
    return NextResponse.json({ error: 'Server error: ' + String(err) }, { status: 500 })
  }
}