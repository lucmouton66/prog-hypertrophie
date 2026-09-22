import type { SetLog, TrackingType } from '../types'

interface Props {
  set: SetLog
  isDone: boolean
  suggestedWeight?: number | null
  trackingType?: TrackingType
  onChange: (field: 'weight' | 'reps', value: number) => void
  onCopyPrevious?: () => void
  onMarkDone: () => void
}

export function SetRow({ set, isDone, suggestedWeight, trackingType = 'reps', onChange, onCopyPrevious, onMarkDone }: Props) {
  const isTime = trackingType === 'time'
  const isDuration = trackingType === 'duration'

  if (isDuration) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <span className="w-5 shrink-0 text-center text-xs text-zinc-500">{set.setIndex + 1}</span>

        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder="watts"
            value={set.weight || ''}
            onChange={(e) => onChange('weight', Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-center text-base tabular-nums text-zinc-100 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <span className="text-xs text-zinc-600">·</span>

        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder="minutes"
            value={set.reps || ''}
            onChange={(e) => onChange('reps', Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-center text-base tabular-nums text-zinc-100 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <button
          onClick={onMarkDone}
          title="Fait"
          className={`shrink-0 rounded-lg px-2.5 py-2 text-sm font-semibold ${
            isDone ? 'bg-amber-400 text-zinc-900' : 'bg-zinc-800 text-zinc-500'
          }`}
        >
          ✓
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-5 shrink-0 text-center text-xs text-zinc-500">{set.setIndex + 1}</span>

      <div className="relative flex-1">
        <input
          type="number"
          inputMode="decimal"
          placeholder={suggestedWeight ? String(suggestedWeight) : 'kg'}
          value={set.weight || ''}
          onChange={(e) => onChange('weight', Number(e.target.value))}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-center text-base tabular-nums text-zinc-100 focus:border-amber-400 focus:outline-none"
        />
      </div>

      <span className="text-xs text-zinc-600">×</span>

      <div className="flex-1">
        <input
          type="number"
          inputMode="numeric"
          placeholder={isTime ? 'sec' : 'reps'}
          value={set.reps || ''}
          onChange={(e) => onChange('reps', Number(e.target.value))}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-center text-base tabular-nums text-zinc-100 focus:border-amber-400 focus:outline-none"
        />
      </div>

      {onCopyPrevious && (
        <button
          onClick={onCopyPrevious}
          title="Copier la série précédente"
          className="shrink-0 rounded-lg bg-zinc-800 px-2 py-2 text-xs text-zinc-400 active:bg-zinc-700"
        >
          ⧉
        </button>
      )}

      <button
        onClick={onMarkDone}
        title="Série faite"
        className={`shrink-0 rounded-lg px-2.5 py-2 text-sm font-semibold ${
          isDone ? 'bg-amber-400 text-zinc-900' : 'bg-zinc-800 text-zinc-500'
        }`}
      >
        ✓
      </button>
    </div>
  )
}
