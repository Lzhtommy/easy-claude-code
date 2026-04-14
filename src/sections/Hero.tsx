import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/content'

const TYPED_TEXT = '> cat src/*.ts | less'

function useTyped(text: string, speed = 55) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i >= text.length) return
    const t = setTimeout(() => setI((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [i, text, speed])
  return text.slice(0, i)
}

export function Hero() {
  const typed = useTyped(TYPED_TEXT)
  const navTargets = SECTIONS.filter((s) => s.id !== 'hero').slice(0, 9)

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* 顶部小标签 */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyber-neon/40 bg-cyber-panel/60 px-3 py-1 font-mono text-xs text-cyber-neon"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-neon shadow-neon-green" />
          claude-code.leak · 2026-03-31 snapshot
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-pixel text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="neon-text-green">图解 Claude Code</span>
          <span className="text-cyber-text"> ·</span>
          <br />
          <span className="neon-text-pink">一本会动的源码百科</span>
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-cyber-dim sm:text-xl"
        >
          1,900 个文件、51 万行 TypeScript、40+ 工具、50+ 命令——
          <br className="hidden sm:block" />
          我们把它拆成了会动、会吐槽、会陪你跑的 10 个章节。
        </motion.p>

        {/* Typed 终端 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="terminal-frame scanlines mt-10 max-w-xl px-5 py-4 font-mono text-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-xs text-cyber-dim">
            <span className="h-2 w-2 rounded-full bg-cyber-pink" />
            <span className="h-2 w-2 rounded-full bg-cyber-yellow" />
            <span className="h-2 w-2 rounded-full bg-cyber-neon" />
            <span className="ml-2">~/Project/claude-code</span>
          </div>
          <div className="text-cyber-neon caret">{typed}</div>
        </motion.div>

        {/* 快速导航 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          {navTargets.map((s, idx) => (
            <motion.a
              key={s.id}
              href={`#${s.id}`}
              whileHover={{ y: -2 }}
              className="group rounded-md border border-cyber-border bg-cyber-panel/70 px-4 py-2 font-mono text-sm text-cyber-dim transition hover:border-cyber-neon/70 hover:text-cyber-neon hover:shadow-neon-green"
            >
              <span className="mr-2 text-xs text-cyber-dim group-hover:text-cyber-neon">
                0{idx + 1}
              </span>
              <span>{s.emoji}</span>{' '}
              <span className="align-middle">{s.title}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 font-mono text-xs text-cyber-dim"
        >
          ↓ scroll ↓ &nbsp;&nbsp;从一次泄露事件开始看起
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
