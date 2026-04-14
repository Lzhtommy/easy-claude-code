import { useState } from 'react'
import { SECTION_INTRO_HOOKS, SECTION_ONELINE, SECTIONS, LEAK_EVENTS } from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import { LeakTimelineViz } from '../components/viz/LeakTimelineViz'
import type { LeakSeverity } from '../data/types'

const SEVERITY_COLOR: Record<LeakSeverity, string> = {
  info: '#4bc7ff',
  warn: '#ffe94b',
  crit: '#ff2e88',
}

export default function LeakTimeline() {
  const meta = SECTIONS.find((s) => s.id === 'leak')!
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = LEAK_EVENTS.find((e) => e.id === activeId) ?? null

  return (
    <SectionShell
      id="leak"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.leak}
      summary={SECTION_ONELINE.leak}
    >
      <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
        <LeakTimelineViz
          events={LEAK_EVENTS}
          selectedId={activeId ?? undefined}
          onSelect={(id) => setActiveId((cur) => (cur === id ? null : id))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 左：事件详情 */}
        <div className="min-h-[200px]">
          {active ? (
            <div
              className="rounded-md border bg-cyber-panel/60 p-5"
              style={{
                borderColor: SEVERITY_COLOR[active.severity],
                boxShadow: `0 0 18px ${SEVERITY_COLOR[active.severity]}55`,
              }}
            >
              <div className="mb-1 font-mono text-xs text-cyber-dim">{active.time}</div>
              <div className="font-pixel text-sm" style={{ color: SEVERITY_COLOR[active.severity] }}>
                [{active.severity}] {active.title}
              </div>
              <p className="mt-3 text-sm text-cyber-text">{active.detail}</p>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-md border border-dashed border-cyber-border bg-cyber-panel/30 p-6 font-mono text-sm text-cyber-dim">
              点击时间轴上任意一个节点，看这一刻发生了啥。
            </div>
          )}
        </div>

        {/* 右：事件清单 */}
        <div>
          <div className="mb-2 font-mono text-xs text-cyber-dim">事件清单</div>
          <ul className="space-y-2">
            {LEAK_EVENTS.map((e) => {
              const isActive = activeId === e.id
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId((cur) => (cur === e.id ? null : e.id))}
                    aria-pressed={isActive}
                    className="w-full rounded-md border border-cyber-border bg-cyber-panel/40 p-3 text-left font-mono text-xs transition-colors hover:border-cyber-neon/50"
                    style={isActive ? { borderColor: SEVERITY_COLOR[e.severity] } : undefined}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span style={{ color: SEVERITY_COLOR[e.severity] }}>
                        [{e.severity}]
                      </span>
                      <span className="text-[10px] text-cyber-dim">{e.time}</span>
                    </div>
                    <div className="mt-1 text-cyber-text">{e.title}</div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
