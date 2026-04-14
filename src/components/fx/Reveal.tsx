import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

export interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  y?: number
  once?: boolean
  duration?: number
}

/**
 * 滚动进入视口时淡入 + 上移。
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  duration = 0.6,
  className,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
