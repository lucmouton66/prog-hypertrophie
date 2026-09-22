import { useRef, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAppStore } from '../store/AppStore'
import { newId } from '../lib/id'
import { todayISO, formatDateShortFr } from '../lib/date'
import { calculatePlates } from '../lib/plates'
import { exportAllData, importAllData, type ExportedData } from '../lib/db'
import { mergeProgramWithSeed } from '../lib/seedProgram'

export function ReglagesPage() {
  const { program, bodyweight, upsertBodyWeight, updateProgram, reloadAll } = useAppStore()
  const [weightInput, setWeightInput] = useState('')
  const [plateTarget, setPlateTarget] = useState('')
  const [barWeight, setBarWeight] = useState(20)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState('')
  const [reloadMessage, setReloadMessage] = useState('')

  async function handleReloadProgram() {
    const ok = confirm(
      "Recharger le programme depuis la dernière version ? Les exercices déjà présents (même nom) gardent leur historique. Les exercices renommés ou nouveaux repartiront sans historique.",
    )
    if (!ok) return
    await updateProgram(mergeProgramWithSeed(program))
    setReloadMessage('Programme mis à jour ✓')
  }

  async function addWeight() {
    const w = Number(weightInput)
    if (!w || w <= 0) return
    await upsertBodyWeight({ id: newId(), date: todayISO(), weight: w })
    setWeightInput('')
  }

  async function handleExport() {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prog-hypertrophie-export-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportedData
      if (!data.program || !Array.isArray(data.sessions)) throw new Error('format invalide')
      await importAllData(data)
      await reloadAll()
      setImportMessage('Import réussi ✓')
    } catch {
      setImportMessage("Échec de l'import — fichier invalide")
    }
  }

  const plateResult = plateTarget ? calculatePlates(Number(plateTarget), barWeight) : null
  const bwChartData = bodyweight.map((b) => ({ date: formatDateShortFr(b.date), weight: b.weight }))

  return (
    <div className="space-y-5 px-3 pb-24 pt-4">
      <h1 className="px-1 text-lg font-semibold text-zinc-100">Réglages</h1>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Poids de corps</h2>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="kg"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100"
          />
          <button onClick={addWeight} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-900">
            Ajouter
          </button>
        </div>
        {bwChartData.length > 1 && (
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bwChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Calculateur de plaques</h2>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={plateTarget}
            onChange={(e) => setPlateTarget(e.target.value)}
            placeholder="Charge totale (kg)"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100"
          />
          <select
            value={barWeight}
            onChange={(e) => setBarWeight(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-zinc-100"
          >
            <option value={20}>Barre 20kg</option>
            <option value={15}>Barre 15kg</option>
            <option value={10}>Barre 10kg</option>
          </select>
        </div>
        {plateResult && (
          <div className="mt-3 text-sm text-zinc-300">
            {plateResult.perSide.length === 0 ? (
              <p>Barre seule.</p>
            ) : (
              <p>
                Par côté : {plateResult.perSide.map((p) => `${p}kg`).join(' + ')}
                {!plateResult.reachable && (
                  <span className="ml-1 text-zinc-500">(≈ {plateResult.closestTotal}kg atteignable)</span>
                )}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Programme</h2>
        <p className="mb-3 text-xs text-zinc-500">
          Le programme est enregistré sur cet appareil dès la première ouverture. Recharge-le après chaque mise à jour
          pour récupérer les derniers exercices/réglages.
        </p>
        <button onClick={handleReloadProgram} className="w-full rounded-lg bg-zinc-800 py-2 text-sm font-medium text-amber-400">
          Recharger le programme
        </button>
        {reloadMessage && <p className="mt-2 text-xs text-zinc-400">{reloadMessage}</p>}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Sauvegarde des données</h2>
        <p className="mb-3 text-xs text-zinc-500">
          Les données sont stockées uniquement sur cet appareil. Exporte régulièrement pour ne rien perdre.
        </p>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex-1 rounded-lg bg-zinc-800 py-2 text-sm font-medium text-zinc-100">
            Exporter (JSON)
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 rounded-lg bg-zinc-800 py-2 text-sm font-medium text-zinc-100">
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        {importMessage && <p className="mt-2 text-xs text-zinc-400">{importMessage}</p>}
      </section>
    </div>
  )
}
