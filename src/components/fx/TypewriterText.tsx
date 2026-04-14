import { useEffect, useRef, useState } from 'react'

export interface TypewriterTextProps {
  text: string
  speed?: number // 毫秒每字符
  onDone?: () => void
  showCaret?: boolean
  className?: string
  startDelay?: number
}

export function TypewriterText({
  text,
  speed = 28,
  onDone,
  showCaret = true,
  className,
  startDelay = 0,
}: TypewriterTextProps) {
  const [idx, setIdx] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    setIdx(0)
    let cancelled = false
    let timer: number | undefined

    const tick = (i: number) => {
      if (cancelled) return
      if (i >= text.length) {
        if (!doneRef.current) {
          doneRef.current = true
          onDone?.()
        }
        return
      }
      setIdx(i + 1)
      timer = window.setTimeout(() => tick(i + 1), speed)
    }

    const start = window.setTimeout(() => tick(0), startDelay)
    return () => {
      cancelled = true
      window.clearTimeout(start)
      if (timer) window.clearTimeout(timer)
    }
  }, [text, speed, startDelay, onDone])

  const visible = text.slice(0, idx)
  const done = idx >= text.length

  return (
    <span className={className}>
      <span>{visible}</span>
      {showCaret && (
        <span
          className="inline-block ml-0.5 text-cyber-neon animate-blink align-baseline"
          aria-hidden
        >
          {done ? '▊' : '▋'}
        </span>
      )}
    </span>
  )
}

export default TypewriterText
