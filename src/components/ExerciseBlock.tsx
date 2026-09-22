import type { ExerciseLog, ProgramExercise } from '../types'
import type { ExerciseHistoryPoint } from '../lib/stats'
import { personalRecords, sessionExerciseStats, suggestNextWeight, parseTargetReps } from '../lib/stats'
import { SetRow } from './SetRow'

export interface ExerciseBlockProps {
  exercise: ProgramExercise
  log: ExerciseLog
  history: ExerciseHistoryPoint[]
  lastLog?: ExerciseLog
  onSetChange: (setIndex: number, field: 'weight' | 'reps', value: number) => void
  onCopyPrevious: (setIndex: number) => void
  onCopyLastSession: () => void
  onSetDone: () => void
}

export function useExerciseBlockInfo({ exercise, log, history, lastLog }: Pick<ExerciseBlockProps, 'exercise' | 'log' | 'history' | 'lastLog'>) {
  const liveStats = sessionExerciseStats(log)
  const pr = personalRecords(history)
  const hasPr = history.length > 0 && (liveStats.maxWeight > pr.maxWeight || liveStats.estimated1RM > pr.estimated1RM)
  const isTime = exercise.trackingType === 'time'
  const isDuration = exercise.trackingType === 'duration'
  const lastPoint = history[history.length - 1]
  const targetHigh = parseTargetReps(exercise.targetReps).high
  const suggested = isTime || isDuration ? null : suggestNextWeight(lastLog, targetHigh)
  return { hasPr, isTime, isDuration, lastPoint, suggested }
}

export function ExerciseSummaryLine({ exercise, log, history, lastLog }: Pick<ExerciseBlockProps, 'exercise' | 'log' | 'history' | 'lastLog'>) {
  const { hasPr, isTime, isDuration, lastPoint } = useExerciseBlockInfo({ exercise, log, history, lastLog })
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-100">{exercise.exerciseName}</span>
        {hasPr && <span className="text-xs">🎉 record</span>}
      </div>
      <div className="mt-0.5 text-xs text-zinc-500">
        {exercise.muscleGroup} · {exercise.targetSets} × {exercise.targetReps} · repos {exercise.targetRestSec}s
      </div>
      {exercise.notes && <div className="mt-1 text-xs text-amber-400/80">⚡ {exercise.notes}</div>}
      {lastPoint &&
        (isTime ? (
          <div className="mt-1 text-xs text-zinc-600">
            Dernière fois : meilleure tenue {lastPoint.maxReps}s{lastPoint.maxWeight > 0 ? ` (+${lastPoint.maxWeight}kg)` : ''}
          </div>
        ) : isDuration ? (
          <div className="mt-1 text-xs text-zinc-600">Dernière fois : {lastPoint.maxReps} min</div>
        ) : (
          <div className="mt-1 text-xs text-zinc-600">
            Dernière fois : {lastPoint.maxWeight}kg max · vol {Math.round(lastPoint.totalVolume)}kg
          </div>
        ))}
    </div>
  )
}

export function ExerciseSetEditor({
  exercise,
  log,
  lastLog,
  history,
  onSetChange,
  onCopyPrevious,
  onCopyLastSession,
  onSetDone,
}: ExerciseBlockProps) {
  const { suggested } = useExerciseBlockInfo({ exercise, log, history, lastLog })
  return (
    <div>
      {lastLog && (
        <button onClick={onCopyLastSession} className="mb-2 rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-amber-400 active:bg-zinc-700">
          ⤵ Copier la dernière séance
        </button>
      )}
      {log.sets.map((set) => (
        <SetRow
          key={set.setIndex}
          set={set}
          isDone={set.reps > 0}
          suggestedWeight={set.setIndex === 0 ? suggested : null}
          trackingType={exercise.trackingType}
          onChange={(field, value) => onSetChange(set.setIndex, field, value)}
          onCopyPrevious={set.setIndex > 0 ? () => onCopyPrevious(set.setIndex) : undefined}
          onMarkDone={onSetDone}
        />
      ))}
    </div>
  )
}
