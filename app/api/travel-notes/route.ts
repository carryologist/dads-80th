import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Comprehensive logging function
function debugLog(step: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔍 TRAVEL-API: ${step}`);
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
    
    debugLog('Checking if travel_notes table exists');
    try {
      const existingCount = await prisma.travelNote.count();
      debugLog(`✅ Table exists with ${existingCount} records`);
      return true;
    } catch (tableError) {
      debugLog('❌ Table does not exist, creating it', { error: String(tableError) });
      
      // Create table manually
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "travel_notes" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "arrival_date" TIMESTAMP(3) NOT NULL,
          "departure_date" TIMESTAMP(3) NOT NULL,
          "travel_method" TEXT NOT NULL,
          "accommodation" TEXT NOT NULL,
          "notes" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "travel_notes_pkey" PRIMARY KEY ("id")
        )
      `;
      debugLog('✅ Table created successfully');
      
      // Verify table creation
      const newCount = await prisma.travelNote.count();
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
    const arrival_date = String(formData.get('arrival_date') || '')
    const departure_date = String(formData.get('departure_date') || '')
    const travel_method = String(formData.get('travel_method') || '')
    const accommodation = String(formData.get('accommodation') || '')
    const notes = String(formData.get('notes') || '') || null

    const parsedData = { name, arrival_date, departure_date, travel_method, accommodation, notes };
    debugLog('Parsed form data', parsedData);

    // Validation
    debugLog('Validating required fields');
    const validation = {
      name: !!name,
      arrival_date: !!arrival_date,
      departure_date: !!departure_date,
      travel_method: !!travel_method,
      accommodation: !!accommodation
    };
    debugLog('Validation results', validation);
    
    if (!name || !arrival_date || !departure_date || !travel_method || !accommodation) {
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
      
      debugLog('✅ Record created successfully', {
        id: travelNote.id,
        createdAt: travelNote.createdAt
      });
      
      // Verification step
      debugLog('Verifying record was saved');
      const verification = await prisma.travelNote.findUnique({
        where: { id: travelNote.id }
      });
      
      if (verification) {
        debugLog('✅ Verification successful - record exists in database');
        
        // Count total records
        const totalCount = await prisma.travelNote.count();
        debugLog(`✅ Total records in database: ${totalCount}`);
        
        return NextResponse.json({ 
          ok: true, 
          storage: 'database', 
          id: travelNote.id,
          message: 'Travel plans saved successfully!',
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
        message: 'Your travel plans have been received and logged! Database save failed but data was captured.',
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
    
    debugLog('Fetching all travel notes');
    const travelNotes = await prisma.travelNote.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    debugLog(`✅ Found ${travelNotes.length} travel notes`);
    
    if (travelNotes.length > 0) {
      debugLog('Sample record', travelNotes[0]);
    }
    
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
    
    debugLog('✅ Data transformation complete');
    
    return NextResponse.json({ 
      notes: transformedNotes, 
      storage: 'database',
      requestId,
      count: travelNotes.length
    })
  } catch (dbError) {
    debugLog('❌ Database error on GET', {
      error: String(dbError),
      stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
    });
    
    return NextResponse.json({ 
      notes: [], 
      storage: 'none', 
      error: String(dbError),
      requestId
    })
  }
}