import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { sessionExerciseStats } from '../lib/stats'
import { formatDateFr } from '../lib/date'

export function HistoriquePage() {
  const { sessions } = useAppStore()
  const navigate = useNavigate()

  const sorted = useMemo(() => [...sessions].sort((a, b) => b.date.localeCompare(a.date)), [sessions])

  return (
    <div className="space-y-3 px-3 pb-24 pt-4">
      <h1 className="px-1 text-lg font-semibold text-zinc-100">Historique</h1>

      {sorted.length === 0 && <p className="px-1 text-sm text-zinc-500">Aucune séance enregistrée pour l'instant.</p>}

      {sorted.map((session) => {
        const loggedExercises = session.exercises.filter((e) => e.sets.some((s) => s.weight > 0 && s.reps > 0))
        const totalVolume = loggedExercises.reduce((sum, e) => sum + sessionExerciseStats(e).totalVolume, 0)
        if (loggedExercises.length === 0) return null

        return (
          <button
            key={session.id}
            onClick={() => navigate(`/historique/${session.id}`)}
            className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-100">{session.dayName}</span>
              <span className="text-xs text-zinc-500">{formatDateFr(session.date)}</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              {loggedExercises.length} exercice{loggedExercises.length > 1 ? 's' : ''} · volume total {Math.round(totalVolume)}kg
            </div>
          </button>
        )
      })}
    </div>
  )
}
