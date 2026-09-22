import { useCallback, useEffect, useRef, useState } from 'react'
import { playBeep, vibrate } from '../lib/alert'

export function useRestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clear()
    setIsActive(false)
    setSecondsLeft(0)
  }, [clear])

  const start = useCallback(
    (seconds: number) => {
      clear()
      setTotalSeconds(seconds)
      setSecondsLeft(seconds)
      setIsActive(true)
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clear()
            playBeep()
            vibrate([200, 100, 200])
            setIsActive(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    },
    [clear],
  )

  const addSeconds = useCallback((delta: number) => {
    setSecondsLeft((s) => Math.max(0, s + delta))
    setTotalSeconds((t) => Math.max(t, t + delta))
  }, [])

  useEffect(() => clear, [clear])

  return { secondsLeft, totalSeconds, isActive, start, stop, addSeconds }
}
