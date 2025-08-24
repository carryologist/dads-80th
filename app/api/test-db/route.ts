import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    
    // Test basic connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test raw query
    console.log('Testing raw query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
    
    // Check if tables exist
    console.log('Checking if activity_suggestions table exists...');
    try {
      const count = await prisma.activitySuggestion.count();
      console.log(`✅ activity_suggestions table exists with ${count} records`);
    } catch (tableError) {
      console.log('❌ activity_suggestions table does not exist:', tableError);
    }
    
    // Check if travel_notes table exists
    console.log('Checking if travel_notes table exists...');
    try {
      const count = await prisma.travelNote.count();
      console.log(`✅ travel_notes table exists with ${count} records`);
    } catch (tableError) {
      console.log('❌ travel_notes table does not exist:', tableError);
    }
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- DATABASE_URL starts with postgres:', process.env.DATABASE_URL?.startsWith('postgres'));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection test completed - check logs for details',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
