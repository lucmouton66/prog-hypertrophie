// Table de Berger : % de la 1RM en fonction du nombre de répétitions effectuées.
// Au-delà de 12 reps, la table de Berger classique ne couvre plus — on prolonge
// avec les valeurs usuellement citées dans les versions étendues de cette table.
const BERGER_PERCENT: Record<number, number> = {
  1: 1.0,
  2: 0.95,
  3: 0.92,
  4: 0.9,
  5: 0.87,
  6: 0.85,
  7: 0.83,
  8: 0.8,
  9: 0.77,
  10: 0.75,
  11: 0.73,
  12: 0.7,
  13: 0.68,
  14: 0.67,
  15: 0.65,
  16: 0.64,
  17: 0.63,
  18: 0.61,
  19: 0.6,
  20: 0.59,
}

export function bergerPercent(reps: number): number {
  const r = Math.round(reps)
  if (r <= 1) return BERGER_PERCENT[1]
  if (r >= 20) return BERGER_PERCENT[20]
  return BERGER_PERCENT[r] ?? BERGER_PERCENT[20]
}

export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0
  return weight / bergerPercent(reps)
}
