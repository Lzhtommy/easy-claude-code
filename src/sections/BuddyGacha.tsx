import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BUDDY_SPECIES,
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import NeonCard from '../components/fx/NeonCard'
import { useAppStore } from '../store/useAppStore'
import { BuddyStats } from '../components/viz/BuddyStats'
import type { BuddyRarity, BuddySpecies } from '../data/types'

const RARITY_COLOR: Record<BuddyRarity, string> = {
  N: '#6b6b8a',
  R: '#4bc7ff',
  SR: '#b14bff',
  SSR: '#ffe94b',
  UR: '#ff2e88',
}

const RARITY_LABEL: Record<BuddyRarity, string> = {
  N: 'Normal',
  R: 'Rare',
  SR: 'Super Rare',
  SSR: 'SSR',
  UR: 'Ultra Rare',
}

// 基于 speciesKey 生成确定性分数（0-100）
function hash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return Math.abs(h)
}

const STATS = ['DEBUG', 'CHAOS', 'SNARK'] as const
function buddyStats(b: BuddySpecies): Record<(typeof STATS)[number], number> {
  const h = hash(b.speciesKey)
  const rarityBoost: Record<BuddyRarity, number> = { N: 10, R: 20, SR: 35, SSR: 55, UR: 75 }
  const base = rarityBoost[b.rarity]
  return {
    DEBUG: Math.min(100, base + ((h >> 0) & 31) + 5),
    CHAOS: Math.min(100, base + ((h >> 8) & 31) + 3),
    SNARK: Math.min(100, base + ((h >> 16) & 31) + 4),
  }
}

export default function BuddyGacha() {
  const meta = SECTIONS.find((s) => s.id === 'buddy')!
  const { currentBuddy, rollBuddy, collectedIds, rollHistory } = useAppStore()
  const [rolling, setRolling] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const uniqCollected = useMemo(() => new Set(collectedIds), [collectedIds])

  const handleRoll = () => {
    if (rolling) return
    setRolling(true)
    setRevealed(false)
    const duration = 1200 + Math.random() * 600
    window.setTimeout(() => {
      rollBuddy()
      setRolling(false)
      setRevealed(true)
    }, duration)
  }

  const shown = currentBuddy
  const stats = shown ? buddyStats(shown) : null
  const color = shown ? RARITY_COLOR[shown.rarity] : '#6b6b8a'

  return (
    <SectionShell
      id="buddy"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.buddy}
      summary={SECTION_ONELINE.buddy}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        {/* 扭蛋机 */}
        <NeonCard accent="yellow" interactive={false} className="space-y-4">
          <div className="mx-auto w-full max-w-xs">
            <GachaMachine rolling={rolling} color={color} />
          </div>

          <button
            type="button"
            onClick={handleRoll}
            disabled={rolling}
            className="w-full rounded-md border border-cyber-yellow/70 bg-cyber-yellow/10 px-4 py-3 font-pixel text-sm text-cyber-yellow transition-all hover:bg-cyber-yellow/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rolling ? '✦ 孵化中…' : '孵化一个 Buddy 🥚'}
          </button>

          <div className="text-center font-mono text-[11px] text-cyber-dim">
            已收集 {uniqCollected.size} / {BUDDY_SPECIES.length} · 历史 {rollHistory.length} 次
          </div>
        </NeonCard>

        {/* 结果 + 属性 */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {shown && revealed ? (
              <motion.div
                key={shown.id + '-' + rollHistory.length}
                initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <NeonCard
                  accent={
                    shown.rarity === 'UR'
                      ? 'pink'
                      : shown.rarity === 'SSR'
                        ? 'yellow'
                        : shown.rarity === 'SR'
                          ? 'purple'
                          : shown.rarity === 'R'
                            ? 'blue'
                            : 'neon'
                  }
                  interactive={false}
                  className="space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-cyber-dim">{shown.emoji} new buddy</div>
                      <div className="font-pixel text-lg" style={{ color }}>
                        {shown.name}
                      </div>
                    </div>
                    <span
                      className="rounded-md border px-2 py-1 font-pixel text-xs"
                      style={{
                        borderColor: color,
                        color,
                        boxShadow: `0 0 8px ${color}55`,
                      }}
                    >
                      {shown.rarity} · {RARITY_LABEL[shown.rarity]}
                    </span>
                  </div>
                  <pre
                    className="rounded-md border border-cyber-border bg-cyber-bg/70 p-4 text-center font-mono leading-tight"
                    style={{ fontSize: '15px', color }}
                  >
                    {shown.ascii}
                  </pre>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px] text-cyber-dim">
                    {shown.traits.map((t) => (
                      <span key={t} className="rounded border border-cyber-border bg-cyber-panel/60 px-1.5 py-0.5">
                        · {t}
                      </span>
                    ))}
                  </div>
                  {stats && (
                    <div className="space-y-1">
                      {STATS.map((key) => (
                        <StatBar
                          key={key}
                          label={key}
                          value={stats[key]}
                          color={color}
                        />
                      ))}
                    </div>
                  )}
                </NeonCard>
              </motion.div>
            ) : (
              <motion.div
                key="empty-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-md border border-dashed border-cyber-border bg-cyber-panel/30 p-8 text-center font-mono text-xs text-cyber-dim"
              >
                {rolling ? '// 扭蛋机咔哒咔哒…' : '// 还没孵出来——点那颗按钮试试。'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* BuddyStats 雷达图 */}
          <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-2">
            <BuddyStats currentBuddy={shown} />
          </div>
        </div>
      </div>

      {/* 图鉴缩略墙 */}
      <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-cyber-dim">
          <span>// 图鉴墙 · 灰底 = 没抽到过</span>
          <span>
            {uniqCollected.size} / {BUDDY_SPECIES.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
          {BUDDY_SPECIES.map((b) => {
            const owned = uniqCollected.has(b.id)
            return (
              <div
                key={b.id}
                title={owned ? b.name : '? · 还没抽到'}
                className={[
                  'flex aspect-square flex-col items-center justify-center rounded-md border text-center font-mono text-[10px] transition-all',
                  owned
                    ? 'border-cyber-border bg-cyber-panel/70 text-cyber-text'
                    : 'border-cyber-border/40 bg-cyber-bg/40 text-cyber-dim opacity-60',
                ].join(' ')}
                style={
                  owned
                    ? {
                        boxShadow: `0 0 4px ${RARITY_COLOR[b.rarity]}66`,
                        borderColor: `${RARITY_COLOR[b.rarity]}55`,
                      }
                    : undefined
                }
              >
                <span className="text-lg">{owned ? b.emoji : '❔'}</span>
                <span className="mt-0.5 truncate px-1" style={{ color: owned ? RARITY_COLOR[b.rarity] : undefined }}>
                  {owned ? b.rarity : '??'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      <span className="w-14 text-cyber-dim">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-cyber-border">
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="w-8 text-right text-cyber-text">{value}</span>
    </div>
  )
}

function GachaMachine({ rolling, color }: { rolling: boolean; color: string }) {
  return (
    <div className="relative" aria-hidden>
      <svg viewBox="0 0 240 280" className="block w-full">
        {/* 顶部球体（玻璃罩） */}
        <circle
          cx={120}
          cy={110}
          r={90}
          fill="rgba(18,18,31,0.6)"
          stroke={color}
          strokeWidth={3}
          style={{ filter: `drop-shadow(0 0 12px ${color}88)` }}
        />
        {/* 内部小球 */}
        {[
          { cx: 90, cy: 120, r: 14, c: '#00ffd1' },
          { cx: 150, cy: 100, r: 12, c: '#ff2e88' },
          { cx: 130, cy: 150, r: 10, c: '#ffe94b' },
          { cx: 100, cy: 80, r: 9, c: '#b14bff' },
          { cx: 160, cy: 140, r: 10, c: '#4bc7ff' },
        ].map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.c}
            opacity={0.8}
            animate={
              rolling
                ? {
                    cx: [b.cx, b.cx + 20, b.cx - 15, b.cx + 8, b.cx],
                    cy: [b.cy, b.cy - 18, b.cy + 14, b.cy - 6, b.cy],
                  }
                : {}
            }
            transition={{ duration: 0.8, repeat: rolling ? Infinity : 0, delay: i * 0.05 }}
          />
        ))}
        {/* 玻璃高光 */}
        <path d="M 60 70 Q 80 40, 130 50" stroke="rgba(255,255,255,0.25)" strokeWidth={4} fill="none" />

        {/* 机身 */}
        <rect x={40} y={190} width={160} height={70} rx={8} fill="rgba(18,18,31,0.9)" stroke={color} strokeWidth={2} />
        {/* 出口 */}
        <rect x={95} y={230} width={50} height={22} rx={3} fill="#0a0a12" stroke={color} strokeWidth={1.5} />
        {/* 把手 */}
        <motion.g
          animate={rolling ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6, repeat: rolling ? Infinity : 0, ease: 'linear' }}
          style={{ transformOrigin: '170px 215px' }}
        >
          <circle cx={170} cy={215} r={10} fill={color} opacity={0.9} />
          <rect x={168} y={204} width={4} height={14} fill="#0a0a12" />
        </motion.g>

        {/* 文字 */}
        <text x={120} y={218} textAnchor="middle" fill={color} fontFamily='"Press Start 2P", monospace' fontSize={10}>
          BUDDY
        </text>
      </svg>
    </div>
  )
}
