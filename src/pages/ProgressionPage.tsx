import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppStore } from '../store/AppStore'
import { exerciseHistory, personalRecords } from '../lib/stats'
import { formatDateShortFr } from '../lib/date'
import type { ProgressMetric, TrackingType } from '../types'

function buildMetrics(trackingType: TrackingType): { key: ProgressMetric; label: string; unit: string; color: string }[] {
  if (trackingType === 'time') {
    return [
      { key: 'maxReps', label: 'Meilleure tenue', unit: 's', color: '#34d399' },
      { key: 'maxWeight', label: 'Charge ajoutée', unit: 'kg', color: '#fbbf24' },
    ]
  }
  if (trackingType === 'duration') {
    return [
      { key: 'maxReps', label: 'Durée', unit: ' min', color: '#60a5fa' },
      { key: 'maxWeight', label: 'Puissance', unit: 'W', color: '#fbbf24' },
    ]
  }
  return [
    { key: 'maxWeight', label: 'Charge max', unit: 'kg', color: '#fbbf24' },
    { key: 'totalVolume', label: 'Volume total', unit: 'kg', color: '#60a5fa' },
    { key: 'estimated1RM', label: '1RM estimé', unit: 'kg', color: '#34d399' },
  ]
}

export function ProgressionPage() {
  const { program, sessions } = useAppStore()

  const allExercises = useMemo(() => {
    const map = new Map<string, { name: string; trackingType: TrackingType }>()
    for (const day of program?.days ?? []) {
      for (const ex of day.exercises) map.set(ex.id, { name: ex.exerciseName, trackingType: ex.trackingType ?? 'reps' })
    }
    return [...map.entries()].map(([id, v]) => ({ id, ...v }))
  }, [program])

  const [exerciseId, setExerciseId] = useState<string>(allExercises[0]?.id ?? '')
  const activeExercise = allExercises.find((e) => e.id === exerciseId) ?? allExercises[0]
  const METRICS = useMemo(() => buildMetrics(activeExercise?.trackingType ?? 'reps'), [activeExercise?.trackingType])
  const [metric, setMetric] = useState<ProgressMetric>('maxWeight')

  const activeExerciseId = activeExercise?.id

  useEffect(() => {
    setMetric(METRICS[0].key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExerciseId])
  const history = useMemo(() => exerciseHistory(sessions, activeExerciseId ?? ''), [sessions, activeExerciseId])
  const pr = useMemo(() => personalRecords(history), [history])
  const metricInfo = METRICS.find((m) => m.key === metric) ?? METRICS[0]

  const chartData = history.map((p) => ({
    date: formatDateShortFr(p.date),
    value: Math.round(p[metric] * 10) / 10,
  }))

  return (
    <div className="space-y-4 px-3 pb-24 pt-4">
      <h1 className="px-1 text-lg font-semibold text-zinc-100">Progression</h1>

      {allExercises.length === 0 ? (
        <p className="px-1 text-sm text-zinc-500">Ajoute des exercices à ton programme pour voir des courbes.</p>
      ) : (
        <>
          <select
            value={activeExerciseId ?? ''}
            onChange={(e) => setExerciseId(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-zinc-100"
          >
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`flex-1 rounded-xl px-2 py-2 text-xs font-medium ${
                  metric === m.key ? 'bg-amber-400 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className={`grid gap-2 ${METRICS.length === 1 ? 'grid-cols-1' : METRICS.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {METRICS.map((m) => (
              <div key={m.key} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-2 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-zinc-500">{m.label}</div>
                <div className="mt-0.5 text-sm font-semibold text-zinc-100">
                  {pr[m.key] ? Math.round(pr[m.key]) : '–'}
                  {pr[m.key] ? m.unit : ''}
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 ? (
            <p className="px-1 text-sm text-zinc-500">Pas encore de séance loggée pour cet exercice.</p>
          ) : (
            <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#d4d4d8' }}
                    formatter={(value) => [`${value}${metricInfo.unit}`, metricInfo.label]}
                  />
                  <Line type="monotone" dataKey="value" stroke={metricInfo.color} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
