import { useEffect, useState, type ReactNode } from 'react'

export interface GlitchTextProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  /** 偶发抖动的概率（0-1）。默认 0.15。 */
  spontaneous?: number
  /** data 属性，用于 RGB 分离层 */
  text?: string
}

/**
 * hover 时 RGB 分离 + 偶发抖动。
 * 如果 children 是纯字符串，会自动提取到 data-text；否则需要显式传 `text`。
 */
export function GlitchText({
  children,
  className = '',
  as: Tag = 'span' as keyof JSX.IntrinsicElements,
  spontaneous = 0.18,
  text,
}: GlitchTextProps) {
  const [twitch, setTwitch] = useState(false)

  useEffect(() => {
    let timer: number | undefined
    const schedule = () => {
      const delay = 2400 + Math.random() * 3600
      timer = window.setTimeout(() => {
        if (Math.random() < spontaneous) {
          setTwitch(true)
          window.setTimeout(() => setTwitch(false), 140 + Math.random() * 160)
        }
        schedule()
      }, delay)
    }
    schedule()
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [spontaneous])

  const resolvedText =
    text ?? (typeof children === 'string' ? children : undefined)

  const classes = [
    'glitch-text',
    twitch ? 'glitch-twitch' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Component = Tag as any
  return (
    <Component
      className={classes}
      data-text={resolvedText}
    >
      {children}
    </Component>
  )
}

export default GlitchText
