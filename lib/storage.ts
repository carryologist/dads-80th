import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Activity Suggestions
export interface ActivitySuggestion {
  id: string;
  name: string;
  activity_name: string;
  description: string;
  location: string;
  website: string;
  category: string;
  notes: string;
  created_at: string;
}

export async function saveActivitySuggestion(suggestion: Omit<ActivitySuggestion, 'id' | 'created_at'>) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, 'activity-suggestions.json');
  
  let suggestions: ActivitySuggestion[] = [];
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    suggestions = JSON.parse(data);
  } catch {
    // File doesn't exist yet, start with empty array
  }
  
  const newSuggestion: ActivitySuggestion = {
    ...suggestion,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  suggestions.push(newSuggestion);
  await fs.writeFile(filePath, JSON.stringify(suggestions, null, 2));
  
  return newSuggestion;
}

export async function getActivitySuggestions(): Promise<ActivitySuggestion[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, 'activity-suggestions.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Travel Notes
export interface TravelNote {
  id: string;
  name: string;
  arrival_date: string;
  departure_date: string;
  travel_method: string;
  accommodation: string;
  notes: string;
  created_at: string;
}

export async function saveTravelNote(note: Omit<TravelNote, 'id' | 'created_at'>) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, 'travel-notes.json');
  
  let notes: TravelNote[] = [];
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    notes = JSON.parse(data);
  } catch {
    // File doesn't exist yet, start with empty array
  }
  
  const newNote: TravelNote = {
    ...note,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  notes.push(newNote);
  await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
  
  return newNote;
}

export async function getTravelNotes(): Promise<TravelNote[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, 'travel-notes.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
