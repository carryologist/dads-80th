import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all itinerary events
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] GET /api/itinerary-events - Starting request`);
  
  try {
    // Initialize database and table if needed
    console.log(`[${requestId}] Ensuring itinerary_events table exists...`);
    
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "itinerary_events" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "start_time" TIMESTAMP(3) NOT NULL,
          "end_time" TIMESTAMP(3) NOT NULL,
          "location" TEXT,
          "url" TEXT,
          "category" TEXT NOT NULL DEFAULT 'general',
          "color" TEXT NOT NULL DEFAULT '#0ea5e9',
          "created_by" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "itinerary_events_pkey" PRIMARY KEY ("id")
        )
      `;
      console.log(`[${requestId}] ✅ Table initialization completed`);
    } catch (tableError) {
      console.log(`[${requestId}] ⚠️ Table might already exist:`, tableError);
    }

    // Get URL parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    console.log(`[${requestId}] Fetching events with filters:`, { startDate, endDate });
    
    let events;
    if (startDate && endDate) {
      events = await prisma.itineraryEvent.findMany({
        where: {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      });
    } else {
      events = await prisma.itineraryEvent.findMany({
        orderBy: {
          startTime: 'asc'
        }
      });
    }
    
    console.log(`[${requestId}] ✅ Successfully fetched ${events.length} events`);
    
    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ Error fetching events:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events', 
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new itinerary event
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] POST /api/itinerary-events - Starting request`);
  
  try {
    const body = await request.json();
    console.log(`[${requestId}] Request body:`, body);
    
    // Validate required fields
    const { title, startTime, endTime } = body;
    if (!title || !startTime || !endTime) {
      console.log(`[${requestId}] ❌ Missing required fields`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: title, startTime, endTime',
          requestId 
        },
        { status: 400 }
      );
    }
    
    // Validate time order
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      console.log(`[${requestId}] ❌ Invalid time range`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Start time must be before end time',
          requestId 
        },
        { status: 400 }
      );
    }
    
    console.log(`[${requestId}] Creating event with validated data...`);
    
    const event = await prisma.itineraryEvent.create({
      data: {
        title,
        description: body.description || null,
        startTime: start,
        endTime: end,
        location: body.location || null,
        url: body.url || null,
        category: body.category || 'general',
        color: body.color || '#0ea5e9',
        createdBy: body.createdBy || null
      }
    });
    
    console.log(`[${requestId}] ✅ Successfully created event:`, event.id);
    
    return NextResponse.json({
      success: true,
      event,
      message: 'Event created successfully',
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ Error creating event:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create event', 
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update existing itinerary event
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] PUT /api/itinerary-events - Starting request`);
  
  try {
    const body = await request.json();
    console.log(`[${requestId}] Request body:`, body);
    
    const { id, title, startTime, endTime } = body;
    if (!id || !title || !startTime || !endTime) {
      console.log(`[${requestId}] ❌ Missing required fields`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: id, title, startTime, endTime',
          requestId 
        },
        { status: 400 }
      );
    }
    
    // Validate time order
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      console.log(`[${requestId}] ❌ Invalid time range`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Start time must be before end time',
          requestId 
        },
        { status: 400 }
      );
    }
    
    console.log(`[${requestId}] Updating event ${id}...`);
    
    const event = await prisma.itineraryEvent.update({
      where: { id },
      data: {
        title,
        description: body.description || null,
        startTime: start,
        endTime: end,
        location: body.location || null,
        url: body.url || null,
        category: body.category || 'general',
        color: body.color || '#0ea5e9'
      }
    });
    
    console.log(`[${requestId}] ✅ Successfully updated event:`, event.id);
    
    return NextResponse.json({
      success: true,
      event,
      message: 'Event updated successfully',
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ Error updating event:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update event', 
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete itinerary event
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] DELETE /api/itinerary-events - Starting request`);
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log(`[${requestId}] ❌ Missing event ID`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing event ID',
          requestId 
        },
        { status: 400 }
      );
    }
    
    console.log(`[${requestId}] Deleting event ${id}...`);
    
    await prisma.itineraryEvent.delete({
      where: { id }
    });
    
    console.log(`[${requestId}] ✅ Successfully deleted event:`, id);
    
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] ❌ Error deleting event:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete event', 
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}