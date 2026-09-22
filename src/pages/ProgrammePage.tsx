import { useState } from 'react'
import { useAppStore } from '../store/AppStore'
import { newId } from '../lib/id'
import type { Day, Program, ProgramExercise } from '../types'

function emptyExercise(): ProgramExercise {
  return { id: newId(), exerciseName: '', muscleGroup: '', targetSets: 3, targetReps: '8-12', targetRestSec: 90 }
}

export function ProgrammePage() {
  const { program, updateProgram } = useAppStore()
  const [openDayId, setOpenDayId] = useState<string | null>(null)

  if (!program) return <div className="p-6 text-center text-zinc-500">Chargement…</div>

  function patch(next: Program) {
    updateProgram(next)
  }

  function patchDay(dayId: string, fn: (d: Day) => Day) {
    if (!program) return
    patch({ ...program, days: program.days.map((d) => (d.id === dayId ? fn(d) : d)) })
  }

  function patchExercise(dayId: string, exerciseId: string, fn: (e: ProgramExercise) => ProgramExercise) {
    patchDay(dayId, (d) => ({ ...d, exercises: d.exercises.map((e) => (e.id === exerciseId ? fn(e) : e)) }))
  }

  function addDay() {
    if (!program) return
    const day: Day = { id: newId(), name: `Séance ${program.days.length + 1}`, order: program.days.length, exercises: [] }
    patch({ ...program, days: [...program.days, day] })
    setOpenDayId(day.id)
  }

  function removeDay(dayId: string) {
    if (!program) return
    if (!confirm('Supprimer cette séance du programme ?')) return
    patch({ ...program, days: program.days.filter((d) => d.id !== dayId) })
  }

  function addExercise(dayId: string) {
    patchDay(dayId, (d) => ({ ...d, exercises: [...d.exercises, emptyExercise()] }))
  }

  function removeExercise(dayId: string, exerciseId: string) {
    patchDay(dayId, (d) => ({ ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }))
  }

  return (
    <div className="space-y-3 px-3 pb-24 pt-4">
      <h1 className="px-1 text-lg font-semibold text-zinc-100">Programme</h1>

      <input
        value={program.name}
        onChange={(e) => patch({ ...program, name: e.target.value })}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 font-medium text-zinc-100"
        placeholder="Nom du programme"
      />

      {program.days.map((day) => {
        const isOpen = openDayId === day.id
        return (
          <div key={day.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <input
                value={day.name}
                onChange={(e) => patchDay(day.id, (d) => ({ ...d, name: e.target.value }))}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-sm font-medium text-zinc-100"
              />
              <button onClick={() => setOpenDayId(isOpen ? null : day.id)} className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400">
                {isOpen ? 'Fermer' : `${day.exercises.length} exo`}
              </button>
              <button onClick={() => removeDay(day.id)} className="rounded-lg bg-red-950 px-2.5 py-1.5 text-xs text-red-400">
                ✕
              </button>
            </div>

            {isOpen && (
              <div className="space-y-2 border-t border-zinc-800 px-3 py-2.5">
                {day.exercises.map((ex) => (
                  <div key={ex.id} className="space-y-1.5 rounded-xl bg-zinc-800/60 p-2.5">
                    <div className="flex gap-1.5">
                      <input
                        value={ex.exerciseName}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, exerciseName: e.target.value }))}
                        placeholder="Nom de l'exercice"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
                      />
                      <button onClick={() => removeExercise(day.id, ex.id)} className="rounded-lg bg-red-950 px-2 text-xs text-red-400">
                        ✕
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        value={ex.muscleGroup}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, muscleGroup: e.target.value }))}
                        placeholder="Groupe musculaire"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300"
                      />
                      <input
                        type="number"
                        value={ex.targetSets}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, targetSets: Number(e.target.value) }))}
                        placeholder="Séries"
                        className="w-16 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-xs text-zinc-300"
                      />
                      <input
                        value={ex.targetReps}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, targetReps: e.target.value }))}
                        placeholder="8-12"
                        className="w-16 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-xs text-zinc-300"
                      />
                      <input
                        type="number"
                        value={ex.targetRestSec}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, targetRestSec: Number(e.target.value) }))}
                        placeholder="Repos (s)"
                        className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-center text-xs text-zinc-300"
                      />
                      <select
                        value={ex.trackingType ?? 'reps'}
                        onChange={(e) =>
                          patchExercise(day.id, ex.id, (x) => ({ ...x, trackingType: e.target.value as ProgramExercise['trackingType'] }))
                        }
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-1.5 py-1.5 text-xs text-zinc-300"
                      >
                        <option value="reps">kg × reps</option>
                        <option value="time">tenue (sec)</option>
                        <option value="duration">durée (min)</option>
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        value={ex.notes ?? ''}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, notes: e.target.value || undefined }))}
                        placeholder="Note (ex: superset avec...)"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-400"
                      />
                      <input
                        value={ex.groupId ?? ''}
                        onChange={(e) => patchExercise(day.id, ex.id, (x) => ({ ...x, groupId: e.target.value || undefined }))}
                        placeholder="Groupe (ex: g1)"
                        title="Même valeur que l'exercice voisin = affichés ensemble dans une seule carte"
                        className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-400"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => addExercise(day.id)} className="w-full rounded-lg bg-zinc-800 py-2 text-xs font-medium text-amber-400">
                  + Ajouter un exercice
                </button>
              </div>
            )}
          </div>
        )
      })}

      <button onClick={addDay} className="w-full rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-amber-400">
        + Ajouter une séance
      </button>
    </div>
  )
}
