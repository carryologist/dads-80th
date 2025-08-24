import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Comprehensive logging function
function debugLog(step: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔍 ACTIVITY-API: ${step}`);
  if (data) {
    console.log(`[${timestamp}] 📊 DATA:`, JSON.stringify(data, null, 2));
  }
}

// Initialize database tables with extensive logging
async function initializeDatabase() {
  debugLog('Starting database initialization');
  
  try {
    debugLog('Testing basic Prisma connection');
    await prisma.$connect();
    debugLog('✅ Prisma connection successful');
    
    debugLog('Testing raw query execution');
    const testQuery = await prisma.$queryRaw`SELECT NOW() as current_time`;
    debugLog('✅ Raw query successful', testQuery);
    
    debugLog('Checking if activity_suggestions table exists');
    try {
      const existingCount = await prisma.activitySuggestion.count();
      debugLog(`✅ Table exists with ${existingCount} records`);
      return true;
    } catch (tableError) {
      debugLog('❌ Table does not exist, creating it', { error: String(tableError) });
      
      // Create table manually
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
      debugLog('✅ Table created successfully');
      
      // Verify table creation
      const newCount = await prisma.activitySuggestion.count();
      debugLog(`✅ Verified table creation with ${newCount} records`);
      return true;
    }
  } catch (error) {
    debugLog('❌ Database initialization failed', { 
      error: String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  debugLog(`🚀 POST REQUEST STARTED [${requestId}]`);
  
  try {
    // Environment check
    debugLog('Environment variables check', {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_starts_with: process.env.DATABASE_URL?.substring(0, 20) + '...',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    });
    
    // Initialize database
    debugLog('Initializing database');
    await initializeDatabase();
    debugLog('✅ Database initialization complete');
    
    // Parse form data
    debugLog('Parsing form data');
    const formData = await request.formData();
    
    const formEntries = Array.from(formData.entries());
    debugLog('Raw form entries', formEntries);
    
    const name = String(formData.get('name') || '')
    const activity_name = String(formData.get('activity_name') || '')
    const description = String(formData.get('description') || '')
    const location = String(formData.get('location') || '') || null
    const website = String(formData.get('website') || '') || null
    const category = String(formData.get('category') || '')
    const notes = String(formData.get('notes') || '') || null

    const parsedData = { name, activity_name, description, location, website, category, notes };
    debugLog('Parsed form data', parsedData);

    // Validation
    debugLog('Validating required fields');
    const validation = {
      name: !!name,
      activity_name: !!activity_name,
      description: !!description,
      category: !!category
    };
    debugLog('Validation results', validation);
    
    if (!name || !activity_name || !description || !category) {
      debugLog('❌ Validation failed - missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields',
        validation,
        requestId
      }, { status: 400 })
    }
    debugLog('✅ Validation passed');

    // Database save attempt
    debugLog('Attempting to save to database');
    
    try {
      debugLog('Creating Prisma record');
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
      
      debugLog('✅ Record created successfully', {
        id: suggestion.id,
        createdAt: suggestion.createdAt
      });
      
      // Verification step
      debugLog('Verifying record was saved');
      const verification = await prisma.activitySuggestion.findUnique({
        where: { id: suggestion.id }
      });
      
      if (verification) {
        debugLog('✅ Verification successful - record exists in database');
        
        // Count total records
        const totalCount = await prisma.activitySuggestion.count();
        debugLog(`✅ Total records in database: ${totalCount}`);
        
        return NextResponse.json({ 
          ok: true, 
          storage: 'database', 
          id: suggestion.id,
          message: 'Activity suggestion saved successfully!',
          requestId,
          totalRecords: totalCount
        })
      } else {
        debugLog('❌ Verification failed - record not found after creation');
        throw new Error('Record verification failed');
      }
      
    } catch (dbError) {
      debugLog('❌ Database save failed', {
        error: String(dbError),
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace',
        name: dbError instanceof Error ? dbError.name : 'Unknown error type'
      });
      
      // Fallback logging
      debugLog('📝 Logging to console as fallback', parsedData);
      
      return NextResponse.json({ 
        ok: true, 
        storage: 'logged',
        message: 'Your suggestion has been received and logged! Database save failed but data was captured.',
        requestId,
        error: String(dbError)
      })
    }
  } catch (err) {
    debugLog('❌ General API error', {
      error: String(err),
      stack: err instanceof Error ? err.stack : 'No stack trace'
    });
    
    return NextResponse.json({ 
      error: 'Server error: ' + String(err),
      requestId
    }, { status: 500 })
  }
}

export async function GET() {
  const requestId = Math.random().toString(36).substring(7);
  debugLog(`📖 GET REQUEST STARTED [${requestId}]`);
  
  try {
    debugLog('Initializing database for GET request');
    await initializeDatabase();
    debugLog('✅ Database initialization complete for GET');
    
    debugLog('Fetching all activity suggestions');
    const suggestions = await prisma.activitySuggestion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    debugLog(`✅ Found ${suggestions.length} activity suggestions`);
    
    if (suggestions.length > 0) {
      debugLog('Sample record', suggestions[0]);
    }
    
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
    
    debugLog('✅ Data transformation complete');
    
    return NextResponse.json({ 
      suggestions: transformedSuggestions, 
      storage: 'database',
      requestId,
      count: suggestions.length
    })
  } catch (dbError) {
    debugLog('❌ Database error on GET', {
      error: String(dbError),
      stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
    });
    
    return NextResponse.json({ 
      suggestions: [], 
      storage: 'none', 
      error: String(dbError),
      requestId
    })
  }
}