import type { Day, Program, ProgramExercise, TrackingType } from '../types'
import { newId } from './id'

// Programme d'exemple reflétant le split validé avec l'utilisateur : 6 jours
// (Push / Pull / Legs / Pecs-Dos / Bras-Épaules / Cardio & Gainage), avec un
// volume hebdomadaire ciblé sur pecs / épaules (deltoïde latéral) / triceps
// en priorité (18 séries/semaine chacun). Les noms d'exercices sont des
// placeholders à remplacer par le vrai programme de l'utilisateur via
// l'écran "Programme".
export function buildSeedProgram(): Program {
  const ex = (
    exerciseName: string,
    muscleGroup: string,
    targetSets: number,
    targetReps: string,
    targetRestSec: number,
    trackingType?: TrackingType,
    notes?: string,
    groupId?: string,
  ) => ({ id: newId(), exerciseName, muscleGroup, targetSets, targetReps, targetRestSec, trackingType, notes, groupId })

  return {
    id: newId(),
    name: 'Push / Pull / Legs / Pecs-Dos / Bras-Épaules',
    days: [
      {
        id: newId(),
        name: 'Push',
        order: 0,
        exercises: [
          ex('Développé couché', 'Pecs', 4, '6-10', 120),
          ex('Chest press unilatéral', 'Pecs', 4, '6-8', 120),
          ex('Écarté poulie basse', 'Pecs (haut)', 3, '8-10', 10, undefined, 'Superset avec militaire explosif landmine', 'push-fly-landmine'),
          ex('Militaire explosif landmine', 'Épaules (avant)', 3, '6', 90, undefined, 'Par côté · superset avec écarté poulie basse', 'push-fly-landmine'),
          ex('Barre au front', 'Triceps', 3, '8-10', 10, undefined, 'Superset avec élévations latérales haltères', 'push-triceps-lat'),
          ex('Élévations latérales haltères', 'Épaules (latéral)', 4, '8-12', 60, undefined, 'Superset avec barre au front', 'push-triceps-lat'),
          ex('Dips machine', 'Triceps', 3, '8-10', 90),
        ],
      },
      {
        id: newId(),
        name: 'Pull',
        order: 1,
        exercises: [
          ex('Tractions lestées', 'Dos', 4, '6-10', 120),
          ex('Rowing barre', 'Dos', 3, '6-10', 90),
          ex('Tirage horizontal machine', 'Dos', 3, '6-10', 90),
          ex('Curl marteau', 'Biceps', 3, '6-10', 15, undefined, 'Superset avec arrière épaule poulie unilatéral', 'pull-curl-rear'),
          ex('Arrière épaule poulie unilatéral', 'Épaules (arrière)', 3, '6-10', 75, undefined, 'Superset avec curl marteau', 'pull-curl-rear'),
          ex('Curl barre EZ', 'Biceps', 3, '6-10', 75),
        ],
      },
      {
        id: newId(),
        name: 'Legs',
        order: 2,
        exercises: [
          ex('Squat barre', 'Quadriceps', 4, '6', 10, undefined, 'Contraste : enchaîner directement avec 4 squat jumps box après chaque série', 'legs-squat-jump'),
          ex('Squat jump box', 'Explosivité', 4, '4', 150, undefined, 'Contraste avec squat barre — repos complet avant la série suivante de squat', 'legs-squat-jump'),
          ex('Presse à cuisses', 'Quadriceps', 3, '6-10', 120),
          ex('RDL haltères', 'Ischios', 4, '8', 120),
          ex('Leg extension', 'Quadriceps', 3, '12-15', 15, undefined, 'Superset avec leg curl', 'legs-ext-curl'),
          ex('Leg curl', 'Ischios', 4, '10-15', 90, undefined, 'Superset avec leg extension', 'legs-ext-curl'),
          ex('Mollets debout', 'Mollets', 3, '12-20', 60),
          ex('Mollets assis', 'Mollets', 3, '15-20', 60),
        ],
      },
      {
        id: newId(),
        name: 'Pecs / Dos',
        order: 3,
        exercises: [
          ex('Développé incliné haltères', 'Pecs (haut)', 4, '8', 90),
          ex('Chest press', 'Pecs', 3, '6', 10, undefined, 'Contraste : enchaîner directement avec lancer de MB (4 reps) après chaque série', 'pd-chestpress-mb'),
          ex('Lancer de médecine ball', 'Explosivité', 3, '4', 120, undefined, 'Contraste avec chest press — repos complet avant la série suivante', 'pd-chestpress-mb'),
          ex('Chest fly', 'Pecs', 3, '10', 15, undefined, 'Superset avec tirage vertical unilatéral', 'pd-fly-tirage'),
          ex('Tirage vertical unilatéral', 'Dos', 3, '8', 90, undefined, 'Superset avec chest fly', 'pd-fly-tirage'),
          ex('Rowing bûcheron controlatéral', 'Dos', 4, '10', 90),
        ],
      },
      {
        id: newId(),
        name: 'Bras / Épaules',
        order: 4,
        exercises: [
          ex('Élévations latérales poulie', 'Épaules (latéral)', 3, '15-20', 45),
          ex('Élévations latérales haltères couché sur banc', 'Épaules (latéral)', 3, '12', 10, undefined, 'Couché sur banc incliné. Superset avec oiseau', 'be-lat-oiseau'),
          ex('Oiseau', 'Épaules (arrière)', 3, '12-15', 60, undefined, 'Superset avec élévations latérales couché', 'be-lat-oiseau'),
          ex('Extension triceps poulie', 'Triceps', 4, '10-15', 10, undefined, 'Superset avec curl pupitre', 'be-triceps-curl'),
          ex('Curl pupitre', 'Biceps', 3, '10-15', 60, undefined, 'Superset avec extension triceps poulie', 'be-triceps-curl'),
          ex('Curl incliné haltères', 'Biceps', 3, '10-12', 10, undefined, 'Superset avec extension triceps barre au front', 'be-curl-triceps2'),
          ex('Extension triceps barre au front', 'Triceps', 4, '8-12', 60, undefined, 'Superset avec curl incliné haltères', 'be-curl-triceps2'),
          ex('Extension triceps au-dessus de tête', 'Triceps', 2, '10', 45, undefined, 'Finisher'),
        ],
      },
      {
        id: newId(),
        name: 'Cardio & Gainage',
        order: 5,
        exercises: [
          ex('Planche sur barre (excentrique)', 'Gainage', 4, '4', 10, undefined, 'Par côté · circuit gainage 4 tours, enchaîner sans repos'),
          ex('Dragon flag excentrique', 'Gainage', 4, '5', 10, undefined, 'Par côté · circuit gainage, enchaîner'),
          ex('Farmer carry', 'Gainage', 4, '10', 10, undefined, '10m par côté · circuit gainage, enchaîner'),
          ex('Crunch poulie', 'Gainage', 4, '12', 10, undefined, 'Circuit gainage, enchaîner'),
          ex('Gainage latéral avec rotation', 'Gainage', 4, '10', 90, undefined, 'Par côté · fin du tour — repos avant le tour suivant'),
          ex('Cardio zone 2 (vélo)', 'Cardio', 1, '30-45', 0, 'duration'),
        ],
      },
    ],
  }
}

// Recharge le programme depuis le code (seedProgram.ts) tout en conservant les
// id existants pour les séances/exercices dont le nom n'a pas changé, afin que
// l'historique déjà loggé reste rattaché aux bons exercices dans Progression.
// Les nouveaux exercices ou ceux renommés démarrent avec un id neuf (et donc
// sans historique préalable, ce qui est attendu).
export function mergeProgramWithSeed(oldProgram: Program | null): Program {
  const fresh = buildSeedProgram()
  if (!oldProgram) return fresh

  const days: Day[] = fresh.days.map((newDay) => {
    const oldDay = oldProgram.days.find((d) => d.name === newDay.name)
    const exercises: ProgramExercise[] = newDay.exercises.map((newEx) => {
      const oldEx = oldDay?.exercises.find((e) => e.exerciseName === newEx.exerciseName)
      return oldEx ? { ...newEx, id: oldEx.id } : newEx
    })
    return { ...newDay, id: oldDay?.id ?? newDay.id, exercises }
  })

  return { ...fresh, id: oldProgram.id, days }
}
