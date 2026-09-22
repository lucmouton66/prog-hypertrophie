import type { ProgramExercise } from '../types'

// Regroupe les exercices consécutifs qui partagent le même groupId (superset / contraste)
// en sous-listes, pour un affichage en une seule carte. Un exercice sans groupId (ou dont
// le groupId ne correspond à aucun voisin direct) reste seul dans sa propre liste.
export function groupExercises(exercises: ProgramExercise[]): ProgramExercise[][] {
  const groups: ProgramExercise[][] = []
  for (const exercise of exercises) {
    const last = groups[groups.length - 1]
    if (exercise.groupId && last && last[0].groupId === exercise.groupId) {
      last.push(exercise)
    } else {
      groups.push([exercise])
    }
  }
  return groups
}
