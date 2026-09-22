import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { BodyWeightEntry, Program, SessionLog } from '../types'
import { buildSeedProgram } from './seedProgram'

interface AppDB extends DBSchema {
  program: {
    key: string
    value: Program
  }
  sessions: {
    key: string
    value: SessionLog
    indexes: { 'by-date': string }
  }
  bodyweight: {
    key: string
    value: BodyWeightEntry
    indexes: { 'by-date': string }
  }
}

const DB_NAME = 'prog-hypertrophie'
const DB_VERSION = 1
const PROGRAM_KEY = 'current'

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('program')) {
          db.createObjectStore('program')
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' })
          store.createIndex('by-date', 'date')
        }
        if (!db.objectStoreNames.contains('bodyweight')) {
          const store = db.createObjectStore('bodyweight', { keyPath: 'id' })
          store.createIndex('by-date', 'date')
        }
      },
    })
  }
  return dbPromise
}

export async function getProgram(): Promise<Program> {
  const db = await getDB()
  const existing = await db.get('program', PROGRAM_KEY)
  if (existing) return existing
  const seed = buildSeedProgram()
  await db.put('program', seed, PROGRAM_KEY)
  return seed
}

export async function saveProgram(program: Program): Promise<void> {
  const db = await getDB()
  await db.put('program', program, PROGRAM_KEY)
}

export async function getAllSessions(): Promise<SessionLog[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('sessions', 'by-date')
  return all.sort((a, b) => b.date.localeCompare(a.date))
}

export async function saveSession(session: SessionLog): Promise<void> {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sessions', id)
}

export async function getAllBodyWeight(): Promise<BodyWeightEntry[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('bodyweight', 'by-date')
  return all.sort((a, b) => a.date.localeCompare(b.date))
}

export async function saveBodyWeight(entry: BodyWeightEntry): Promise<void> {
  const db = await getDB()
  await db.put('bodyweight', entry)
}

export async function deleteBodyWeight(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('bodyweight', id)
}

export interface ExportedData {
  version: 1
  exportedAt: string
  program: Program
  sessions: SessionLog[]
  bodyweight: BodyWeightEntry[]
}

export async function exportAllData(): Promise<ExportedData> {
  const [program, sessions, bodyweight] = await Promise.all([
    getProgram(),
    getAllSessions(),
    getAllBodyWeight(),
  ])
  return { version: 1, exportedAt: new Date().toISOString(), program, sessions, bodyweight }
}

export async function importAllData(data: ExportedData): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['program', 'sessions', 'bodyweight'], 'readwrite')
  await tx.objectStore('program').put(data.program, PROGRAM_KEY)
  const sessionsStore = tx.objectStore('sessions')
  await sessionsStore.clear()
  for (const s of data.sessions) await sessionsStore.put(s)
  const bwStore = tx.objectStore('bodyweight')
  await bwStore.clear()
  for (const b of data.bodyweight) await bwStore.put(b)
  await tx.done
}
