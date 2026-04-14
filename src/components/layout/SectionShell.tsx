import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { AccentColor, SectionId } from '../../data/types'

const ACCENT_MAP: Record<
  AccentColor,
  { text: string; shadow: string; border: string; dot: string }
> = {
  neon: {
    text: 'neon-text-green',
    shadow: 'shadow-neon-green',
    border: 'border-cyber-neon/40',
    dot: 'bg-cyber-neon',
  },
  pink: {
    text: 'neon-text-pink',
    shadow: 'shadow-neon-pink',
    border: 'border-cyber-pink/40',
    dot: 'bg-cyber-pink',
  },
  purple: {
    text: 'neon-text-purple',
    shadow: 'shadow-neon-purple',
    border: 'border-cyber-purple/40',
    dot: 'bg-cyber-purple',
  },
  yellow: {
    text: 'neon-text-green',
    shadow: 'shadow-neon-green',
    border: 'border-cyber-yellow/40',
    dot: 'bg-cyber-yellow',
  },
  blue: {
    text: 'neon-text-green',
    shadow: 'shadow-neon-blue',
    border: 'border-cyber-blue/40',
    dot: 'bg-cyber-blue',
  },
}

export interface SectionShellProps {
  id: SectionId | string
  title: string
  subtitle?: string
  emoji?: string
  accent?: AccentColor
  introHook?: string
  summary?: string
  children?: ReactNode
}

export function SectionShell({
  id,
  title,
  subtitle,
  emoji,
  accent = 'neon',
  introHook,
  summary,
  children,
}: SectionShellProps) {
  const a = ACCENT_MAP[accent]
  return (
    <section
      id={id}
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24"
    >
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div
          className={[
            'mb-4 inline-flex items-center gap-2 rounded-full border bg-cyber-panel/60 px-3 py-1 font-mono text-xs',
            a.border,
          ].join(' ')}
        >
          <span className={['h-1.5 w-1.5 rounded-full', a.dot].join(' ')} />
          <span className="text-cyber-dim">section /</span>
          <span className={a.text}>{id}</span>
        </div>
        <h2
          className={[
            'font-pixel text-3xl leading-tight sm:text-4xl md:text-5xl',
            a.text,
          ].join(' ')}
        >
          {emoji ? <span className="mr-3">{emoji}</span> : null}
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-3xl text-base text-cyber-dim sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {introHook ? (
          <p className="mt-5 max-w-3xl whitespace-pre-line rounded-md border border-cyber-border bg-cyber-panel/50 p-4 font-mono text-sm text-cyber-text sm:text-base">
            {introHook}
          </p>
        ) : null}
      </motion.header>

      <div className="space-y-6">{children}</div>

      {summary ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={[
            'mt-10 rounded-md border-l-2 bg-cyber-panel/40 px-4 py-3 font-mono text-sm',
            a.border,
          ].join(' ')}
        >
          <span className="text-cyber-dim">// oneLine&nbsp;→&nbsp;</span>
          <span className="text-cyber-text">{summary}</span>
        </motion.p>
      ) : null}
    </section>
  )
}

export default SectionShell
