import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

function debugLog(step: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔍 DB-TEST: ${step}`);
  if (data) {
    console.log(`[${timestamp}] 📊 DB-DATA:`, JSON.stringify(data, null, 2));
  }
}

export async function GET() {
  const testId = Math.random().toString(36).substring(7);
  debugLog(`🚀 DATABASE TEST STARTED [${testId}]`);
  
  const results = {
    testId,
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, unknown>,
    environment: {} as Record<string, unknown>,
    summary: { passed: 0, failed: 0, total: 0 },
    overallStatus: '' as string,
    successRate: '' as string,
    criticalError: undefined as { error: string; stack: string } | undefined
  };
  
  try {
    // Environment variables check
    debugLog('Checking environment variables');
    results.environment = {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_protocol: process.env.DATABASE_URL?.split('://')[0] || 'none',
      DATABASE_URL_host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING
    };
    debugLog('✅ Environment check complete', results.environment);
    
    // Test 1: Basic Prisma connection
    debugLog('Test 1: Testing basic Prisma connection');
    try {
      await prisma.$connect();
      results.tests.connection = { status: 'PASS', message: 'Prisma connected successfully' };
      debugLog('✅ Test 1 PASSED: Prisma connection successful');
      results.summary.passed++;
    } catch (error) {
      results.tests.connection = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 1 FAILED: Prisma connection failed', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Test 2: Raw query execution
    debugLog('Test 2: Testing raw query execution');
    try {
      const rawResult = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
      results.tests.rawQuery = { status: 'PASS', result: rawResult };
      debugLog('✅ Test 2 PASSED: Raw query successful', rawResult);
      results.summary.passed++;
    } catch (error) {
      results.tests.rawQuery = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 2 FAILED: Raw query failed', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Test 3: Check if activity_suggestions table exists
    debugLog('Test 3: Checking activity_suggestions table');
    try {
      const count = await prisma.activitySuggestion.count();
      const sample = await prisma.activitySuggestion.findFirst();
      results.tests.activityTable = { 
        status: 'PASS', 
        recordCount: count,
        sampleRecord: sample ? {
          id: sample.id,
          name: sample.name,
          activityName: sample.activityName,
          createdAt: sample.createdAt
        } : null
      };
      debugLog(`✅ Test 3 PASSED: activity_suggestions table exists with ${count} records`);
      results.summary.passed++;
    } catch (error) {
      results.tests.activityTable = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 3 FAILED: activity_suggestions table issue', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Test 4: Check if travel_notes table exists
    debugLog('Test 4: Checking travel_notes table');
    try {
      const count = await prisma.travelNote.count();
      const sample = await prisma.travelNote.findFirst();
      results.tests.travelTable = { 
        status: 'PASS', 
        recordCount: count,
        sampleRecord: sample ? {
          id: sample.id,
          name: sample.name,
          arrivalDate: sample.arrivalDate,
          createdAt: sample.createdAt
        } : null
      };
      debugLog(`✅ Test 4 PASSED: travel_notes table exists with ${count} records`);
      results.summary.passed++;
    } catch (error) {
      results.tests.travelTable = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 4 FAILED: travel_notes table issue', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Test 5: Test creating a record
    debugLog('Test 5: Testing record creation');
    try {
      const testRecord = await prisma.activitySuggestion.create({
        data: {
          name: 'Test User',
          activityName: 'Database Test Activity',
          description: 'This is a test record created during database diagnostics',
          category: 'Other',
          location: 'Test Location',
          website: 'https://test.com',
          notes: 'Test notes - this record can be deleted'
        }
      });
      
      // Verify it was created
      const verification = await prisma.activitySuggestion.findUnique({
        where: { id: testRecord.id }
      });
      
      if (verification) {
        results.tests.recordCreation = { 
          status: 'PASS', 
          testRecordId: testRecord.id,
          message: 'Test record created and verified successfully'
        };
        debugLog('✅ Test 5 PASSED: Record creation and verification successful');
        results.summary.passed++;
        
        // Clean up test record
        await prisma.activitySuggestion.delete({
          where: { id: testRecord.id }
        });
        debugLog('✅ Test record cleaned up');
      } else {
        throw new Error('Test record was not found after creation');
      }
    } catch (error) {
      results.tests.recordCreation = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 5 FAILED: Record creation failed', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Test 6: Database schema validation
    debugLog('Test 6: Validating database schema');
    try {
      const schemaCheck = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'activity_suggestions' 
        ORDER BY ordinal_position
      `;
      
      results.tests.schemaValidation = { 
        status: 'PASS', 
        schema: schemaCheck,
        message: 'Database schema retrieved successfully'
      };
      debugLog('✅ Test 6 PASSED: Schema validation successful', schemaCheck);
      results.summary.passed++;
    } catch (error) {
      results.tests.schemaValidation = { status: 'FAIL', error: String(error) };
      debugLog('❌ Test 6 FAILED: Schema validation failed', { error: String(error) });
      results.summary.failed++;
    }
    results.summary.total++;
    
    // Overall assessment
    const successRate = (results.summary.passed / results.summary.total) * 100;
    results.overallStatus = successRate >= 80 ? 'HEALTHY' : successRate >= 50 ? 'DEGRADED' : 'CRITICAL';
    results.successRate = `${successRate.toFixed(1)}%`;
    
    debugLog(`🏁 DATABASE TEST COMPLETED [${testId}]`, {
      status: results.overallStatus,
      successRate: results.successRate,
      passed: results.summary.passed,
      failed: results.summary.failed
    });
    
    return NextResponse.json(results);
    
  } catch (error) {
    debugLog('❌ Database test failed with critical error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    results.criticalError = {
      error: String(error),
      stack: error instanceof Error ? (error.stack || 'No stack trace') : 'No stack trace'
    };
    results.overallStatus = 'CRITICAL';
    
    return NextResponse.json(results, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
      debugLog('✅ Prisma disconnected cleanly');
    } catch (disconnectError) {
      debugLog('❌ Prisma disconnect error', { error: String(disconnectError) });
    }
  }
}