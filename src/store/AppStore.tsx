import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { BodyWeightEntry, Program, SessionLog } from '../types'
import * as db from '../lib/db'

interface AppStoreValue {
  loading: boolean
  program: Program | null
  sessions: SessionLog[]
  bodyweight: BodyWeightEntry[]
  updateProgram: (program: Program) => Promise<void>
  upsertSession: (session: SessionLog) => Promise<void>
  removeSession: (id: string) => Promise<void>
  upsertBodyWeight: (entry: BodyWeightEntry) => Promise<void>
  removeBodyWeight: (id: string) => Promise<void>
  reloadAll: () => Promise<void>
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [program, setProgram] = useState<Program | null>(null)
  const [sessions, setSessions] = useState<SessionLog[]>([])
  const [bodyweight, setBodyweight] = useState<BodyWeightEntry[]>([])

  const reloadAll = useCallback(async () => {
    const [p, s, b] = await Promise.all([db.getProgram(), db.getAllSessions(), db.getAllBodyWeight()])
    setProgram(p)
    setSessions(s)
    setBodyweight(b)
  }, [])

  useEffect(() => {
    reloadAll().finally(() => setLoading(false))
  }, [reloadAll])

  const updateProgram = useCallback(async (next: Program) => {
    setProgram(next)
    await db.saveProgram(next)
  }, [])

  const upsertSession = useCallback(async (session: SessionLog) => {
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id)
      if (idx === -1) return [session, ...prev]
      const copy = [...prev]
      copy[idx] = session
      return copy
    })
    await db.saveSession(session)
  }, [])

  const removeSession = useCallback(async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    await db.deleteSession(id)
  }, [])

  const upsertBodyWeight = useCallback(async (entry: BodyWeightEntry) => {
    setBodyweight((prev) => {
      const idx = prev.findIndex((b) => b.id === entry.id)
      const next = idx === -1 ? [...prev, entry] : prev.map((b) => (b.id === entry.id ? entry : b))
      return next.sort((a, b) => a.date.localeCompare(b.date))
    })
    await db.saveBodyWeight(entry)
  }, [])

  const removeBodyWeight = useCallback(async (id: string) => {
    setBodyweight((prev) => prev.filter((b) => b.id !== id))
    await db.deleteBodyWeight(id)
  }, [])

  const value = useMemo<AppStoreValue>(
    () => ({
      loading,
      program,
      sessions,
      bodyweight,
      updateProgram,
      upsertSession,
      removeSession,
      upsertBodyWeight,
      removeBodyWeight,
      reloadAll,
    }),
    [loading, program, sessions, bodyweight, updateProgram, upsertSession, removeSession, upsertBodyWeight, removeBodyWeight, reloadAll],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
