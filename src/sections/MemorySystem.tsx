import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MEMORY_LAYERS,
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import NeonCard from '../components/fx/NeonCard'
import { MemoryOnion } from '../components/viz/MemoryOnion'

const TIMELINE_COLORS = ['#00ffd1', '#4bc7ff', '#b14bff', '#ff2e88']

export default function MemorySystem() {
  const meta = SECTIONS.find((s) => s.id === 'memory')!
  const [activeIdx, setActiveIdx] = useState<number>(0)

  return (
    <SectionShell
      id="memory"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.memory}
      summary={SECTION_ONELINE.memory}
    >
      {/* 上半部分：Onion */}
      <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
        <MemoryOnion layers={MEMORY_LAYERS} />
      </div>

      {/* 下半部分：时间线槽位 —— B 接入 */}
      <div
        id="memory-timeline-slot"
        className="rounded-md border border-cyber-border bg-cyber-panel/40 p-5"
      >
        <div className="mb-4 font-mono text-xs text-cyber-dim">
          // 一条生命线：从最浅的便签，到最深的守夜保安
        </div>

        {/* 时间轴 */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-cyber-neon via-cyber-purple to-cyber-pink opacity-60" />
          <div className="relative flex items-start justify-between gap-2">
            {MEMORY_LAYERS.map((layer, idx) => {
              const color = TIMELINE_COLORS[idx % TIMELINE_COLORS.length]
              const active = activeIdx === idx
              const label = layer.name.split('（')[0]
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className="group relative flex flex-1 flex-col items-center text-center"
                >
                  <motion.span
                    animate={{ scale: active ? 1.15 : 1 }}
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-pixel text-[10px]"
                    style={{
                      borderColor: color,
                      background: active ? color : 'rgba(18,18,31,0.9)',
                      color: active ? '#0a0a12' : color,
                      boxShadow: active ? `0 0 16px ${color}` : `0 0 6px ${color}55`,
                    }}
                  >
                    L{layer.depth}
                  </motion.span>
                  <span
                    className="mt-2 max-w-[9rem] font-mono text-[11px] leading-tight"
                    style={{ color: active ? color : '#6b6b8a' }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 节点详情卡 */}
        <AnimatePresence mode="wait">
          {MEMORY_LAYERS[activeIdx] && (
            <motion.div
              key={MEMORY_LAYERS[activeIdx].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <NeonCard
                accent={activeIdx % 2 === 0 ? 'purple' : 'blue'}
                interactive={false}
                className="space-y-3"
              >
                <div className="font-pixel text-sm text-cyber-text">
                  {MEMORY_LAYERS[activeIdx].name}
                </div>
                <div className="font-mono text-xs text-cyber-dim">
                  {MEMORY_LAYERS[activeIdx].tagline}
                </div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-cyber-border bg-cyber-bg/60 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-cyber-neon">
                      谁来读 · whoReads
                    </dt>
                    <dd className="mt-1 text-sm text-cyber-text">
                      {MEMORY_LAYERS[activeIdx].whoReads}
                    </dd>
                  </div>
                  <div className="rounded-md border border-cyber-border bg-cyber-bg/60 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-cyber-pink">
                      何时写 · whenWritten
                    </dt>
                    <dd className="mt-1 text-sm text-cyber-text">
                      {MEMORY_LAYERS[activeIdx].whenWritten}
                    </dd>
                  </div>
                </dl>
                <div className="rounded-md border border-dashed border-cyber-border bg-cyber-panel/30 p-3 font-mono text-[12px] text-cyber-text">
                  <span className="text-cyber-yellow">example · </span>
                  {MEMORY_LAYERS[activeIdx].example}
                </div>
              </NeonCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  )
}
