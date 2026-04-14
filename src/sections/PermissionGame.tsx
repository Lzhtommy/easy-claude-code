import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  PERMISSION_SCENARIOS,
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import NeonCard from '../components/fx/NeonCard'
import { useAppStore } from '../store/useAppStore'
import type { PermissionChoice } from '../data/types'

const CHOICES: {
  id: PermissionChoice
  label: string
  hint: string
  accent: 'neon' | 'yellow' | 'pink'
}[] = [
  { id: 'allow', label: '允许', hint: '放行一次', accent: 'neon' },
  { id: 'ask', label: '询问', hint: '再确认下', accent: 'yellow' },
  { id: 'deny', label: '拒绝', hint: '这步不做', accent: 'pink' },
]

const ACCENT_STYLE: Record<'neon' | 'yellow' | 'pink', string> = {
  neon: 'border-cyber-neon/60 bg-cyber-neon/10 text-cyber-neon hover:shadow-neon-green',
  yellow: 'border-cyber-yellow/60 bg-cyber-yellow/10 text-cyber-yellow',
  pink: 'border-cyber-pink/60 bg-cyber-pink/10 text-cyber-pink hover:shadow-neon-pink',
}

function rank(pct: number): { title: string; desc: string } {
  if (pct >= 100) return { title: '偏执狂级 · paranoid', desc: '你比 toolPermission.ts 还严——Claude Code 的保险丝在你面前都要绷紧。' }
  if (pct >= 80) return { title: '二进制特工 · operator', desc: '判断力在线。偶尔手滑，但兜得住。' }
  if (pct >= 60) return { title: '安全官学徒 · apprentice', desc: '已经能拦住大多数炸弹——下次遇到 rm -rf 记得深呼吸。' }
  return { title: '点允许肌肉记忆 · reflex clicker', desc: '建议先去读一遍 CLAUDE.md——那颗允许按钮不该是默认反应。' }
}

export default function PermissionGame() {
  const meta = SECTIONS.find((s) => s.id === 'permission')!
  const { permissionScore, setPermissionScore, resetPermission } = useAppStore()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, PermissionChoice>>({})
  const [feedback, setFeedback] = useState<null | { correct: boolean; choice: PermissionChoice }>(null)
  const [shake, setShake] = useState(0)

  const total = PERMISSION_SCENARIOS.length
  const done = index >= total
  const current = PERMISSION_SCENARIOS[index]

  const correctCount = useMemo(
    () =>
      Object.entries(answers).filter(([id, c]) => {
        const q = PERMISSION_SCENARIOS.find((p) => p.id === id)
        return q && q.recommended === c
      }).length,
    [answers],
  )
  const pct = Math.round((correctCount / total) * 100)

  const choose = (c: PermissionChoice) => {
    if (!current || feedback) return
    const correct = c === current.recommended
    setAnswers((prev) => ({ ...prev, [current.id]: c }))
    setFeedback({ correct, choice: c })
    setShake((s) => s + 1)
    if (correct) {
      setPermissionScore(permissionScore + 1)
    }
  }

  const next = () => {
    setFeedback(null)
    setIndex((i) => i + 1)
  }

  const restart = () => {
    resetPermission()
    setIndex(0)
    setAnswers({})
    setFeedback(null)
  }

  return (
    <SectionShell
      id="permission"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.permission}
      summary={SECTION_ONELINE.permission}
    >
      {/* 进度条 */}
      <div className="flex items-center gap-3 font-mono text-xs text-cyber-dim">
        <span>题目 {Math.min(index + 1, total)}/{total}</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-cyber-border">
          <motion.div
            className="absolute inset-y-0 left-0 bg-cyber-neon"
            initial={false}
            animate={{ width: `${(Math.min(index, total) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-cyber-neon">score {permissionScore}</span>
      </div>

      <AnimatePresence mode="wait">
        {!done && current ? (
          <motion.div
            key={current.id + '-' + shake}
            initial={{ opacity: 0, y: 12 }}
            animate={
              feedback && !feedback.correct
                ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, -3, 3, 0] }
                : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <NeonCard accent="neon" interactive={false} className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-cyber-dim">
                <span className="rounded border border-cyber-border bg-cyber-bg/60 px-1.5 py-0.5 text-cyber-neon">
                  Q{index + 1}
                </span>
                <span>tool: <span className="text-cyber-yellow">{current.tool}</span></span>
              </div>

              <p className="text-base text-cyber-text sm:text-lg">{current.scenario}</p>

              <div className="grid gap-2 sm:grid-cols-3">
                {CHOICES.map((c) => {
                  const answered = !!feedback
                  const isMine = feedback?.choice === c.id
                  const isCorrectOne = current.recommended === c.id
                  const highlight =
                    answered && isCorrectOne
                      ? 'ring-2 ring-cyber-neon shadow-neon-green'
                      : answered && isMine && !feedback?.correct
                        ? 'ring-2 ring-cyber-pink shadow-neon-pink'
                        : ''
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      onClick={() => choose(c.id)}
                      whileTap={{ scale: 0.96 }}
                      whileHover={!answered ? { scale: 1.02 } : undefined}
                      disabled={answered}
                      className={[
                        'rounded-md border px-4 py-3 text-left transition-all',
                        ACCENT_STYLE[c.accent],
                        highlight,
                        answered ? 'cursor-default opacity-90' : '',
                      ].join(' ')}
                    >
                      <div className="font-pixel text-sm">{c.label}</div>
                      <div className="mt-1 font-mono text-[11px] opacity-80">{c.hint}</div>
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={[
                      'rounded-md border p-3 font-mono text-xs leading-relaxed',
                      feedback.correct
                        ? 'border-cyber-neon/50 bg-cyber-neon/10 text-cyber-text'
                        : 'border-cyber-pink/50 bg-cyber-pink/10 text-cyber-text',
                    ].join(' ')}
                  >
                    <div className={feedback.correct ? 'text-cyber-neon' : 'text-cyber-pink'}>
                      {feedback.correct
                        ? '✓ 正确 · 这题你守住了'
                        : `✗ 差一点 · 推荐答案是 ${current.recommended}`}
                    </div>
                    <div className="mt-1 text-cyber-dim">{current.explain}</div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={next}
                        className="rounded-md border border-cyber-neon/60 bg-cyber-neon/10 px-3 py-1.5 text-cyber-neon hover:bg-cyber-neon/20"
                      >
                        下一题 →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </NeonCard>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NeonCard accent="neon" interactive={false} className="space-y-4 text-center">
              <div className="font-pixel text-2xl text-cyber-neon">
                {correctCount} / {total}
              </div>
              <div className="font-mono text-xs text-cyber-dim">正确率 {pct}%</div>
              <div className="font-pixel text-lg text-cyber-text">{rank(pct).title}</div>
              <p className="mx-auto max-w-md text-sm text-cyber-dim">{rank(pct).desc}</p>

              <div className="mx-auto max-w-xl space-y-2 text-left">
                {PERMISSION_SCENARIOS.map((q, i) => {
                  const mine = answers[q.id]
                  const ok = mine === q.recommended
                  return (
                    <div
                      key={q.id}
                      className={[
                        'rounded-md border p-3 font-mono text-[11px]',
                        ok ? 'border-cyber-neon/40 bg-cyber-neon/5' : 'border-cyber-pink/40 bg-cyber-pink/5',
                      ].join(' ')}
                    >
                      <div className="text-cyber-dim">
                        Q{i + 1} · {q.tool} · 你选 <span className={ok ? 'text-cyber-neon' : 'text-cyber-pink'}>{mine ?? '—'}</span>
                        <span className="ml-2 opacity-70">推荐 {q.recommended}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={restart}
                className="rounded-md border border-cyber-neon/60 bg-cyber-neon/10 px-4 py-2 font-mono text-sm text-cyber-neon hover:bg-cyber-neon/20"
              >
                ↺ 再来一轮
              </button>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  )
}
