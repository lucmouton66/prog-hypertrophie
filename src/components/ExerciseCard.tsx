import { useState } from 'react'
import type { ExerciseLog, ProgramExercise } from '../types'
import type { ExerciseHistoryPoint } from '../lib/stats'
import { ExerciseSetEditor, ExerciseSummaryLine } from './ExerciseBlock'

interface Props {
  exercise: ProgramExercise
  log: ExerciseLog
  history: ExerciseHistoryPoint[]
  lastLog?: ExerciseLog
  onSetChange: (setIndex: number, field: 'weight' | 'reps', value: number) => void
  onCopyPrevious: (setIndex: number) => void
  onCopyLastSession: () => void
  onSetDone: () => void
}

export function ExerciseCard(props: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <ExerciseSummaryLine exercise={props.exercise} log={props.log} history={props.history} lastLog={props.lastLog} />
        <span className="shrink-0 pl-2 text-zinc-500">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 pb-3 pt-2">
          <ExerciseSetEditor {...props} />
        </div>
      )}
    </div>
  )
}
