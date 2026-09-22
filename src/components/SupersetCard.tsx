import { useState } from 'react'
import type { ExerciseBlockProps } from './ExerciseBlock'
import { ExerciseSetEditor, ExerciseSummaryLine } from './ExerciseBlock'

interface Props {
  items: ExerciseBlockProps[]
  label?: string
}

export function SupersetCard({ items, label = 'Superset' }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-zinc-900/60">
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-start justify-between px-4 py-3 text-left">
        <div className="flex-1">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400/90">⚡ {label}</div>
          {items.map((item) => (
            <ExerciseSummaryLine key={item.exercise.id} exercise={item.exercise} log={item.log} history={item.history} lastLog={item.lastLog} />
          ))}
        </div>
        <span className="shrink-0 pl-2 text-zinc-500">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800">
          {items.map((item, i) => (
            <div key={item.exercise.id} className={i > 0 ? 'border-t border-zinc-800/60' : ''}>
              <div className="px-4 pt-2 text-xs font-semibold text-zinc-400">{item.exercise.exerciseName}</div>
              <div className="px-4 pb-3 pt-1">
                <ExerciseSetEditor {...item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
