import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WHISPERS } from '../../data/whispers'

const FALLBACK = '这个术语还在等 D 解释…'

export interface WhisperProps {
  term: string
  children: ReactNode
  className?: string
}

/**
 * 气泡注释。hover / tap 时弹出 term 的白话解释。
 * 文案来自 src/data/whispers.ts（Teammate D 维护）。
 */
export function Whisper({ term, children, className = '' }: WhisperProps) {
  const [open, setOpen] = useState(false)
  const touchTimer = useRef<number | null>(null)

  const entry = WHISPERS[term]
  const text = entry?.plain ?? FALLBACK

  const onTap = () => {
    setOpen((v) => !v)
    if (touchTimer.current) window.clearTimeout(touchTimer.current)
    touchTimer.current = window.setTimeout(() => setOpen(false), 3200)
  }

  useEffect(() => {
    return () => {
      if (touchTimer.current) window.clearTimeout(touchTimer.current)
    }
  }, [])

  return (
    <span
      className={
        'relative inline-block whisper-term cursor-help border-b border-dotted border-cyber-neon/70 text-cyber-neon ' +
        className
      }
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={onTap}
      tabIndex={0}
      role="button"
      aria-label={`解释：${term}`}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            key="bubble"
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="whisper-bubble pointer-events-none absolute left-1/2 bottom-full z-50 -translate-x-1/2 -translate-y-2 min-w-[180px] max-w-[280px] rounded-md border border-cyber-neon/50 bg-cyber-panel/95 px-3 py-2 text-xs font-sans leading-relaxed text-cyber-text shadow-neon-green"
          >
            <span className="block text-[10px] uppercase tracking-wider text-cyber-neon mb-1">
              {term}
            </span>
            <span className="block">{text}</span>
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 rotate-45 bg-cyber-panel/95 border-r border-b border-cyber-neon/50"
              aria-hidden
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export default Whisper
