import type { ReactNode, HTMLAttributes } from 'react'

export type NeonAccent = 'neon' | 'pink' | 'purple' | 'yellow' | 'blue'

export interface NeonCardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: NeonAccent
  children: ReactNode
  className?: string
  interactive?: boolean
}

const ACCENT_CLASS: Record<NeonAccent, string> = {
  neon: 'glow-border-neon hover:shadow-neon-green',
  pink: 'glow-border-pink hover:shadow-neon-pink',
  purple: 'glow-border-purple hover:shadow-neon-purple',
  yellow: 'glow-border-yellow',
  blue: 'glow-border-blue hover:shadow-neon-blue',
}

export function NeonCard({
  accent = 'neon',
  children,
  className = '',
  interactive = true,
  ...rest
}: NeonCardProps) {
  const classes = [
    'relative rounded-lg bg-cyber-panel/70 backdrop-blur-sm p-5',
    'border transition-all duration-300',
    ACCENT_CLASS[accent],
    interactive
      ? 'hover:-translate-y-1 hover:bg-cyber-panel/90 cursor-default'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

export default NeonCard
