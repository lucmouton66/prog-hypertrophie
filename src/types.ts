export interface SetLog {
  setIndex: number
  weight: number
  reps: number
  isWarmup?: boolean
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: SetLog[]
}

export interface SessionLog {
  id: string
  dayId: string
  dayName: string
  date: string
  exercises: ExerciseLog[]
  notes?: string
}

export type TrackingType = 'reps' | 'time' | 'duration'

export interface ProgramExercise {
  id: string
  exerciseName: string
  muscleGroup: string
  targetSets: number
  targetReps: string
  targetRestSec: number
  notes?: string
  trackingType?: TrackingType
  groupId?: string
}

export interface Day {
  id: string
  name: string
  order: number
  exercises: ProgramExercise[]
}

export interface Program {
  id: string
  name: string
  days: Day[]
}

export interface BodyWeightEntry {
  id: string
  date: string
  weight: number
}

export type ProgressMetric = 'maxWeight' | 'totalVolume' | 'estimated1RM' | 'maxReps'
