import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
  TOOLS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import NeonCard from '../components/fx/NeonCard'
import { ToolTaxonomyTree } from '../components/viz/ToolTaxonomyTree'
import type { ToolCategory, ToolEntry, ToolPermission } from '../data/types'

const CATEGORY_OPTIONS: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'file', label: 'file' },
  { id: 'shell', label: 'shell' },
  { id: 'search', label: 'search' },
  { id: 'web', label: 'web' },
  { id: 'agent', label: 'agent' },
  { id: 'task', label: 'task' },
  { id: 'team', label: 'team' },
  { id: 'plan', label: 'plan' },
  { id: 'worktree', label: 'worktree' },
  { id: 'mcp', label: 'mcp' },
  { id: 'lsp', label: 'lsp' },
  { id: 'schedule', label: 'schedule' },
  { id: 'memory', label: 'memory' },
  { id: 'meta', label: 'meta' },
]

const PERMISSION_BADGE: Record<ToolPermission, { label: string; className: string }> = {
  safe: { label: 'safe · 放行', className: 'border-cyber-neon/60 text-cyber-neon bg-cyber-neon/10' },
  ask: { label: 'ask · 问一下', className: 'border-cyber-yellow/60 text-cyber-yellow bg-cyber-yellow/10' },
  danger: { label: 'danger · 高危', className: 'border-cyber-pink/60 text-cyber-pink bg-cyber-pink/10' },
}

const CATEGORY_ACCENT: Record<ToolCategory, 'neon' | 'pink' | 'purple' | 'yellow' | 'blue'> = {
  file: 'neon',
  shell: 'pink',
  search: 'blue',
  web: 'purple',
  agent: 'yellow',
  task: 'neon',
  team: 'pink',
  plan: 'purple',
  worktree: 'yellow',
  mcp: 'blue',
  lsp: 'neon',
  schedule: 'pink',
  memory: 'purple',
  meta: 'blue',
}

export default function ToolExplorer() {
  const meta = SECTIONS.find((s) => s.id === 'tools')!
  const [cat, setCat] = useState<ToolCategory | 'all'>('all')
  const [view, setView] = useState<'grid' | 'tree'>('grid')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (cat === 'all' ? TOOLS : TOOLS.filter((t) => t.category === cat)),
    [cat],
  )

  const counts = useMemo(() => {
    const m: Partial<Record<ToolCategory, number>> = {}
    for (const t of TOOLS) m[t.category] = (m[t.category] ?? 0) + 1
    return m
  }, [])

  return (
    <SectionShell
      id="tools"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.tools}
      summary={SECTION_ONELINE.tools}
    >
      {/* 顶部操作条 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-cyber-dim">{filtered.length} / {TOOLS.length} tools</span>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-cyber-border bg-cyber-panel/50 p-0.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={[
              'rounded px-2 py-1',
              view === 'grid' ? 'bg-cyber-blue/20 text-cyber-blue' : 'text-cyber-dim hover:text-cyber-text',
            ].join(' ')}
          >
            卡片墙
          </button>
          <button
            type="button"
            onClick={() => setView('tree')}
            className={[
              'rounded px-2 py-1',
              view === 'tree' ? 'bg-cyber-blue/20 text-cyber-blue' : 'text-cyber-dim hover:text-cyber-text',
            ].join(' ')}
          >
            树视图 🌳
          </button>
        </div>
      </div>

      {/* 类别 chips */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_OPTIONS.map((opt) => {
          const active = opt.id === cat
          const count = opt.id === 'all' ? TOOLS.length : counts[opt.id as ToolCategory] ?? 0
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCat(opt.id)}
              className={[
                'rounded-full border px-3 py-1 font-mono text-[11px] transition-colors',
                active
                  ? 'border-cyber-blue/70 bg-cyber-blue/15 text-cyber-blue shadow-neon-blue'
                  : 'border-cyber-border bg-cyber-panel/50 text-cyber-dim hover:border-cyber-blue/40 hover:text-cyber-text',
              ].join(' ')}
            >
              {opt.label}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {view === 'tree' ? (
        <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
          <ToolTaxonomyTree tools={filtered} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => {
              const expanded = expandedId === t.id
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <ToolCard
                    tool={t}
                    expanded={expanded}
                    onToggle={() => setExpandedId(expanded ? null : t.id)}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </SectionShell>
  )
}

function ToolCard({
  tool,
  expanded,
  onToggle,
}: {
  tool: ToolEntry
  expanded: boolean
  onToggle: () => void
}) {
  const badge = PERMISSION_BADGE[tool.permission]
  return (
    <NeonCard
      accent={CATEGORY_ACCENT[tool.category]}
      className="cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{tool.icon}</span>
          <span className="font-pixel text-[11px] text-cyber-text">{tool.name}</span>
        </div>
        <span className="rounded bg-cyber-bg/70 px-1.5 py-0.5 font-mono text-[10px] text-cyber-dim">
          {tool.category}
        </span>
      </div>
      <div className="mt-2 font-mono text-[11px] leading-relaxed text-cyber-dim">
        {tool.description}
      </div>
      <div
        className={[
          'mt-2 inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px]',
          badge.className,
        ].join(' ')}
      >
        {badge.label}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.dl
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 space-y-1 border-t border-cyber-border/60 pt-2 font-mono text-[11px] text-cyber-text"
          >
            <div>
              <span className="text-cyber-dim">input · </span>
              {tool.input}
            </div>
            <div>
              <span className="text-cyber-dim">output · </span>
              {tool.output}
            </div>
            <div>
              <span className="text-cyber-dim">permission · </span>
              {tool.permission}
            </div>
          </motion.dl>
        )}
      </AnimatePresence>
      <div className="mt-2 text-right font-mono text-[10px] text-cyber-dim">
        {expanded ? '▴ 收起' : '▾ 看详情'}
      </div>
    </NeonCard>
  )
}
