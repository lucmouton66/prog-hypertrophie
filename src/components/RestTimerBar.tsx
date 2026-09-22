interface Props {
  secondsLeft: number
  totalSeconds: number
  onStop: () => void
  onAddSeconds: (delta: number) => void
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function RestTimerBar({ secondsLeft, totalSeconds, onStop, onAddSeconds }: Props) {
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0
  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3">
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-amber-500/40 bg-zinc-900 shadow-lg">
        <div className="h-1 bg-zinc-800">
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-sm text-zinc-400">Repos</span>
          <span className="text-xl font-semibold tabular-nums text-amber-400">{formatTime(secondsLeft)}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onAddSeconds(-15)}
              className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 active:bg-zinc-700"
            >
              -15s
            </button>
            <button
              onClick={() => onAddSeconds(15)}
              className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 active:bg-zinc-700"
            >
              +15s
            </button>
            <button
              onClick={onStop}
              className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 active:bg-zinc-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
