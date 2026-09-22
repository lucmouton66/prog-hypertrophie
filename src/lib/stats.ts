import { estimate1RM } from './oneRepMax'
import type { ExerciseLog, ProgressMetric, SessionLog } from '../types'

export interface ExerciseSessionStats {
  maxWeight: number
  totalVolume: number
  estimated1RM: number
  maxReps: number
  workingSets: number
}

export function sessionExerciseStats(log: ExerciseLog): ExerciseSessionStats {
  // reps > 0 suffit : les exercices au poids du corps / chronométrés (gainage) ont weight = 0.
  const workingSets = log.sets.filter((s) => !s.isWarmup && s.reps > 0)
  const maxWeight = workingSets.reduce((m, s) => Math.max(m, s.weight), 0)
  const totalVolume = workingSets.reduce((v, s) => v + s.weight * s.reps, 0)
  const estimated1RM = workingSets.reduce((m, s) => Math.max(m, estimate1RM(s.weight, s.reps)), 0)
  const maxReps = workingSets.reduce((m, s) => Math.max(m, s.reps), 0)
  return { maxWeight, totalVolume, estimated1RM, maxReps, workingSets: workingSets.length }
}

export interface ExerciseHistoryPoint extends ExerciseSessionStats {
  date: string
  sessionId: string
}

export function exerciseHistory(sessions: SessionLog[], exerciseId: string): ExerciseHistoryPoint[] {
  return sessions
    .map((session) => {
      const log = session.exercises.find((e) => e.exerciseId === exerciseId)
      if (!log) return null
      const stats = sessionExerciseStats(log)
      if (stats.workingSets === 0) return null
      return { date: session.date, sessionId: session.id, ...stats }
    })
    .filter((p): p is ExerciseHistoryPoint => p !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function personalRecords(history: ExerciseHistoryPoint[]) {
  return history.reduce<Record<ProgressMetric, number>>(
    (best, point) => ({
      maxWeight: Math.max(best.maxWeight, point.maxWeight),
      totalVolume: Math.max(best.totalVolume, point.totalVolume),
      estimated1RM: Math.max(best.estimated1RM, point.estimated1RM),
      maxReps: Math.max(best.maxReps, point.maxReps),
    }),
    { maxWeight: 0, totalVolume: 0, estimated1RM: 0, maxReps: 0 },
  )
}

export function lastSessionForExercise(sessions: SessionLog[], exerciseId: string): SessionLog | undefined {
  return [...sessions]
    .filter((s) => s.exercises.some((e) => e.exerciseId === exerciseId && e.sets.some((set) => set.reps > 0)))
    .sort((a, b) => b.date.localeCompare(a.date))[0]
}

// Suggestion simple de surcharge progressive : si toutes les séries cibles ont
// été faites avec le nombre de reps haut de la fourchette la dernière fois,
// on propose +2.5kg ; sinon on repropose la même charge.
export function suggestNextWeight(
  lastLog: ExerciseLog | undefined,
  targetRepsHigh: number,
): number | null {
  if (!lastLog) return null
  const workingSets = lastLog.sets.filter((s) => !s.isWarmup && s.weight > 0)
  if (workingSets.length === 0) return null
  const maxWeight = Math.max(...workingSets.map((s) => s.weight))
  const allHitTop = workingSets.every((s) => s.reps >= targetRepsHigh)
  return allHitTop ? Math.round((maxWeight + 2.5) * 2) / 2 : maxWeight
}

export function parseTargetReps(targetReps: string): { low: number; high: number } {
  const match = targetReps.match(/(\d+)\s*-\s*(\d+)/)
  if (match) return { low: Number(match[1]), high: Number(match[2]) }
  const single = Number(targetReps.match(/\d+/)?.[0])
  return { low: single || 0, high: single || 0 }
}
