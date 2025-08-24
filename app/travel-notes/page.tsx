import { prisma } from "../../lib/prisma";
import TravelPlanForm from "../../components/TravelPlanForm";
import TravelNotesClient from "../../components/TravelNotesClient";

interface TravelNote {
  id: string;
  name: string;
  arrival_date: string;
  departure_date: string;
  travel_method: string;
  accommodation: string;
  notes?: string;
  created_at: string;
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function TravelNotes() {
  let travelNotes: TravelNote[] = []

  try {
    const notes = await prisma.travelNote.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match the expected format
    travelNotes = notes.map(note => ({
      id: note.id,
      name: note.name,
      arrival_date: note.arrivalDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      departure_date: note.departureDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      travel_method: note.travelMethod,
      accommodation: note.accommodation,
      notes: note.notes || undefined,
      created_at: note.createdAt.toISOString()
    }))
  } catch (error) {
    console.log('Could not fetch travel notes:', error)
    // Page will render without travel notes
  }

  return (
    <TravelNotesClient 
      initialTravelNotes={travelNotes}
    />
  )
}