const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]

export interface PlateResult {
  perSide: number[]
  reachable: boolean
  closestTotal: number
}

// Calcule les plaques à charger de chaque côté d'une barre pour atteindre
// `targetTotal` kg, barre comprise (`barWeight`).
export function calculatePlates(targetTotal: number, barWeight = 20): PlateResult {
  const perSideTarget = (targetTotal - barWeight) / 2
  if (perSideTarget <= 0) return { perSide: [], reachable: targetTotal === barWeight, closestTotal: barWeight }

  let remaining = perSideTarget
  const perSide: number[] = []
  for (const plate of AVAILABLE_PLATES) {
    while (remaining + 1e-6 >= plate) {
      perSide.push(plate)
      remaining = Math.round((remaining - plate) * 100) / 100
    }
  }
  const achievedPerSide = perSide.reduce((a, b) => a + b, 0)
  const closestTotal = barWeight + achievedPerSide * 2
  return { perSide, reachable: Math.abs(closestTotal - targetTotal) < 0.01, closestTotal }
}
