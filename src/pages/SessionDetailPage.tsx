import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { sessionExerciseStats } from '../lib/stats'
import { formatDateFr } from '../lib/date'

export function SessionDetailPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { sessions, removeSession } = useAppStore()
  const session = sessions.find((s) => s.id === sessionId)

  if (!session) {
    return (
      <div className="px-3 pt-4 text-zinc-500">
        Séance introuvable.{' '}
        <button onClick={() => navigate('/historique')} className="text-amber-400">
          Retour
        </button>
      </div>
    )
  }

  const loggedExercises = session.exercises.filter((e) => e.sets.some((s) => s.weight > 0 && s.reps > 0))

  return (
    <div className="space-y-3 px-3 pb-24 pt-4">
      <button onClick={() => navigate('/historique')} className="text-sm text-amber-400">
        ← Retour
      </button>

      <div>
        <h1 className="text-lg font-semibold text-zinc-100">{session.dayName}</h1>
        <p className="text-sm text-zinc-500">{formatDateFr(session.date)}</p>
      </div>

      {loggedExercises.map((log) => {
        const stats = sessionExerciseStats(log)
        return (
          <div key={log.exerciseId} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <div className="font-medium text-zinc-100">{log.exerciseName}</div>
            <div className="mt-1 text-xs text-zinc-500">
              max {stats.maxWeight}kg · volume {Math.round(stats.totalVolume)}kg · 1RM est. {Math.round(stats.estimated1RM)}kg
            </div>
            <div className="mt-2 space-y-1">
              {log.sets
                .filter((s) => s.weight > 0 && s.reps > 0)
                .map((s) => (
                  <div key={s.setIndex} className="text-sm text-zinc-300">
                    Série {s.setIndex + 1} — {s.weight}kg × {s.reps}
                  </div>
                ))}
            </div>
          </div>
        )
      })}

      <button
        onClick={async () => {
          await removeSession(session.id)
          navigate('/historique')
        }}
        className="mt-4 w-full rounded-xl bg-red-950 py-2.5 text-sm font-medium text-red-400"
      >
        Supprimer cette séance
      </button>
    </div>
  )
}
