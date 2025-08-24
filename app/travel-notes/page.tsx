'use client'

import { useState } from 'react'
import { prisma } from "../../lib/prisma";
import TravelPlanForm from "../../components/TravelPlanForm";
import EditModal from "../../components/EditModal";

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

// Client component for handling edit/delete actions
function TravelNoteCard({ 
  note, 
  index,
  onEdit,
  onDelete 
}: { 
  note: TravelNote
  index: number
  onEdit?: (note: TravelNote) => void
  onDelete?: (noteId: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (confirm(`Are you sure you want to delete ${note.name}'s travel plans? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        await onDelete(note.id)
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete travel note. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTravelIcon = (method: string) => {
    const iconMap: { [key: string]: string } = {
      'Flying': '✈️',
      'Driving': '🚗',
      'Train': '🚂',
      'Bus': '🚌',
      'Other': '🧳'
    }
    return iconMap[method] || '🧳'
  }

  return (
    <div 
      key={note.id}
      className="card border-2 border-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent hover:scale-[1.02] transition-transform duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">
          {getTravelIcon(note.travel_method)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h3 className="font-display text-xl font-semibold flex-1">
              {note.name}
            </h3>
            <div className="badge badge-blue text-xs">
              {note.travel_method}
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(note)}
                  className="btn btn-secondary text-sm"
                  title="Edit travel plans"
                >
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn-secondary text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Delete travel plans"
                >
                  {isDeleting ? '⏳' : '🗑️'} {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-sm font-medium">Arriving</p>
                <p className="text-sm opacity-75">{formatDate(note.arrival_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-sm font-medium">Departing</p>
                <p className="text-sm opacity-75">{formatDate(note.departure_date)}</p>
              </div>
            </div>
          </div>
          
          {note.accommodation && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏨</span>
              <div>
                <p className="text-sm font-medium">Staying at</p>
                <p className="text-sm opacity-75">{note.accommodation}</p>
              </div>
            </div>
          )}
          
          {note.notes && (
            <div className="mt-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
              <p className="text-sm opacity-80">
                💭 {note.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Client component wrapper
function TravelNotesClient({ 
  initialTravelNotes 
}: { 
  initialTravelNotes: TravelNote[]
}) {
  const [travelNotes, setTravelNotes] = useState(initialTravelNotes)
  const [editingNote, setEditingNote] = useState<TravelNote | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (note: TravelNote) => {
    setEditingNote(note)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (formData: Record<string, string>) => {
    if (!editingNote?.id) return
    
    setIsLoading(true)
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value)
      })
      
      const response = await fetch(`/api/travel-notes?id=${editingNote.id}`, {
        method: 'PUT',
        body: form
      })
      
      if (!response.ok) {
        throw new Error('Failed to update travel note')
      }
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Edit failed:', error)
      alert('Failed to update travel note. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    const response = await fetch(`/api/travel-notes?id=${noteId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete travel note')
    }
    
    // Refresh the page to show updated data
    window.location.reload()
  }

  const editFields = editingNote ? [
    {
      name: 'name',
      label: 'Your Name',
      type: 'text' as const,
      required: true,
      value: editingNote.name || ''
    },
    {
      name: 'arrival_date',
      label: 'Arrival Date',
      type: 'date' as const,
      required: true,
      value: editingNote.arrival_date || ''
    },
    {
      name: 'departure_date',
      label: 'Departure Date',
      type: 'date' as const,
      required: true,
      value: editingNote.departure_date || ''
    },
    {
      name: 'travel_method',
      label: 'Travel Method',
      type: 'select' as const,
      required: true,
      options: ['Flying', 'Driving', 'Train', 'Bus', 'Other'],
      value: editingNote.travel_method || ''
    },
    {
      name: 'accommodation',
      label: 'Where are you staying?',
      type: 'text' as const,
      required: true,
      value: editingNote.accommodation || ''
    },
    {
      name: 'notes',
      label: 'Additional Notes',
      type: 'textarea' as const,
      value: editingNote.notes || ''
    }
  ] : []

  return (
    <div className="container space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="badge badge-primary mb-4">✈️ Travel Coordination</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Travel <span className="text-gradient">Plans</span>
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Help coordinate everyone&apos;s arrival and departure times for Dad&apos;s celebration. 
          Share your travel details so we can plan activities and meals together!
        </p>
      </div>

      {/* Existing Travel Plans */}
      {travelNotes.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
              📅 Family <span className="text-gradient">Travel Plans</span>
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              Here&apos;s who&apos;s coming and when they&apos;ll be there!
            </p>
          </div>
          
          <div className="grid gap-6">
            {travelNotes.map((note, index) => (
              <TravelNoteCard
                key={note.id}
                note={note}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Travel Plan Form */}
      <section className="max-w-2xl mx-auto">
        <div className="card card-travel p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🗓️</div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Share Your Travel Plans
            </h2>
            <p className="text-sm opacity-75">
              Let everyone know when you&apos;re arriving and departing so we can coordinate activities!
            </p>
          </div>
          <TravelPlanForm />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="card card-travel p-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Ready to Celebrate?
          </h2>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            With everyone&apos;s travel plans coordinated, we can make sure Dad&apos;s 80th birthday 
            celebration is perfectly timed for maximum family fun!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/things-to-do" className="btn btn-primary">
              🌊 Explore Activities
            </a>
            <a href="/stay" className="btn btn-secondary">
              🏡 View House Details
            </a>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSaveEdit}
        title="Edit Travel Plans"
        fields={editFields}
        isLoading={isLoading}
      />
    </div>
  )
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