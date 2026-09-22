import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { ExerciseCard } from '../components/ExerciseCard'
import { SupersetCard } from '../components/SupersetCard'
import type { ExerciseBlockProps } from '../components/ExerciseBlock'
import { RestTimerBar } from '../components/RestTimerBar'
import { useRestTimer } from '../hooks/useRestTimer'
import { exerciseHistory, lastSessionForExercise } from '../lib/stats'
import { groupExercises } from '../lib/grouping'
import { todayISO } from '../lib/date'
import type { Day, ProgramExercise, SessionLog } from '../types'

function buildDraftSession(day: Day): SessionLog {
  return {
    id: `${day.id}_${todayISO()}`,
    dayId: day.id,
    dayName: day.name,
    date: todayISO(),
    exercises: day.exercises.map((pe) => ({
      exerciseId: pe.id,
      exerciseName: pe.exerciseName,
      sets: Array.from({ length: pe.targetSets }, (_, i) => ({ setIndex: i, weight: 0, reps: 0 })),
    })),
  }
}

export function SeancesPage() {
  const { program, sessions, upsertSession } = useAppStore()
  const { dayId } = useParams()
  const navigate = useNavigate()
  const timer = useRestTimer()

  const days = program?.days ?? []
  const activeDay = days.find((d) => d.id === dayId) ?? days[0]

  const draftId = activeDay ? `${activeDay.id}_${todayISO()}` : null
  const [session, setSession] = useState<SessionLog | null>(null)

  useEffect(() => {
    if (!activeDay) return
    const existing = sessions.find((s) => s.id === `${activeDay.id}_${todayISO()}`)
    setSession(existing ?? buildDraftSession(activeDay))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay?.id])

  const pastSessions = useMemo(() => sessions.filter((s) => s.id !== draftId), [sessions, draftId])

  function persist(updater: (s: SessionLog) => SessionLog) {
    setSession((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      upsertSession(next)
      return next
    })
  }

  if (!program || !activeDay) {
    return <div className="p-6 text-center text-zinc-500">Chargement…</div>
  }

  if (!dayId) {
    return <Navigate to={`/seances/${activeDay.id}`} replace />
  }

  if (!session) {
    return <div className="p-6 text-center text-zinc-500">Chargement…</div>
  }

  function buildBlockProps(pe: ProgramExercise): ExerciseBlockProps | null {
    if (!session) return null
    const log = session.exercises.find((e) => e.exerciseId === pe.id)
    if (!log) return null
    const history = exerciseHistory(pastSessions, pe.id)
    const lastSession = lastSessionForExercise(pastSessions, pe.id)
    const lastLog = lastSession?.exercises.find((e) => e.exerciseId === pe.id)

    return {
      exercise: pe,
      log,
      history,
      lastLog,
      onSetChange: (setIndex, field, value) =>
        persist((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.exerciseId === pe.id
              ? { ...e, sets: e.sets.map((set) => (set.setIndex === setIndex ? { ...set, [field]: value } : set)) }
              : e,
          ),
        })),
      onCopyPrevious: (setIndex) =>
        persist((s) => {
          const ex = s.exercises.find((e) => e.exerciseId === pe.id)
          const prevSet = ex?.sets.find((set) => set.setIndex === setIndex - 1)
          if (!prevSet) return s
          return {
            ...s,
            exercises: s.exercises.map((e) =>
              e.exerciseId === pe.id
                ? {
                    ...e,
                    sets: e.sets.map((set) => (set.setIndex === setIndex ? { ...set, weight: prevSet.weight, reps: prevSet.reps } : set)),
                  }
                : e,
            ),
          }
        }),
      onCopyLastSession: () =>
        persist((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.exerciseId === pe.id && lastLog
              ? { ...e, sets: e.sets.map((set, i) => (lastLog.sets[i] ? { ...set, weight: lastLog.sets[i].weight, reps: lastLog.sets[i].reps } : set)) }
              : e,
          ),
        })),
      onSetDone: () => timer.start(pe.targetRestSec),
    }
  }

  const groups = groupExercises(activeDay.exercises)

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-zinc-800 bg-zinc-950/95 px-3 pb-2 pt-4 backdrop-blur">
        {days.map((d) => (
          <button
            key={d.id}
            onClick={() => navigate(`/seances/${d.id}`)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              d.id === activeDay.id ? 'bg-amber-400 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-3 pt-3">
        {groups.map((group) => {
          const items = group.map(buildBlockProps).filter((i): i is ExerciseBlockProps => i !== null)
          if (items.length === 0) return null
          if (items.length === 1) return <ExerciseCard key={items[0].exercise.id} {...items[0]} />
          const label = group.some((pe) => pe.notes?.toLowerCase().includes('contraste')) ? 'Contraste' : 'Superset'
          return <SupersetCard key={group[0].groupId ?? group[0].id} items={items} label={label} />
        })}
      </div>

      {timer.isActive && (
        <RestTimerBar
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          onStop={timer.stop}
          onAddSeconds={timer.addSeconds}
        />
      )}
    </div>
  )
}
