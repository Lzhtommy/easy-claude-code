import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ARCH_LAYERS,
  KNOWLEDGE_POINTS,
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import { LayerCake } from '../components/viz/LayerCake'
import type { AccentColor, ArchLayer } from '../data/types'

const ACCENT_TEXT: Record<AccentColor, string> = {
  neon: 'text-cyber-neon',
  pink: 'text-cyber-pink',
  purple: 'text-cyber-purple',
  yellow: 'text-cyber-yellow',
  blue: 'text-cyber-blue',
}
const ACCENT_BORDER: Record<AccentColor, string> = {
  neon: 'border-cyber-neon/60',
  pink: 'border-cyber-pink/60',
  purple: 'border-cyber-purple/60',
  yellow: 'border-cyber-yellow/60',
  blue: 'border-cyber-blue/60',
}

// 每层关联的深入说明（直接借用 KNOWLEDGE_POINTS，或 fallback 到 role）
function deepFor(layer: ArchLayer): string {
  const hints: Record<string, string> = {
    'arch-entry':
      'CLI 层是 Claude Code 和你之间的那块玻璃——Ink 把 React 画到终端、键盘事件经这里统一整形，再派发给命令层。ctrl+C、粘贴大段文本、slash 命令匹配都发生在这里。',
    'arch-command':
      '命令层像意图翻译官：50+ 个 slash 命令、Plan Mode、Vim bindings、语音输入，都在这里把“你想干嘛”转成“引擎要 load 哪个工具”。',
    'arch-engine':
      'Agent Loop 的心跳在这里跳。QueryEngine 维护流式状态机：tokens 预算、context 压缩、tool loop、思考模式切换、cache 复用——整份 while 循环就在 query/*。',
    'arch-tools':
      '工具层是 LLM 的四十多只手：file/shell/search/web/agent/task/team/plan/worktree/mcp/lsp/schedule/memory/meta。每只手都有 permission 等级，动手前过一道 toolPermission 闸。',
    'arch-services':
      '对外联络部：Anthropic API、MCP 客户端、OAuth、LSP、Plugins、Remote Triggers、Analytics——一切“跟外面说话”的事在这里签字盖章，出网前先过一遍 HTTP 代理与权限表。',
  }
  return hints[layer.id] ?? layer.role
}

export default function Architecture() {
  const meta = SECTIONS.find((s) => s.id === 'architecture')!
  const [activeId, setActiveId] = useState<string | undefined>(undefined)

  const onLayerOpen = (id: string) => {
    setActiveId((cur) => (cur === id ? undefined : id))
  }

  const active = ARCH_LAYERS.find((l) => l.id === activeId)
  const relatedKp = active
    ? KNOWLEDGE_POINTS.find((kp) =>
        kp.tags.some((t) => active.name.includes(t)) ||
        active.modules.some((m) => kp.deep.toLowerCase().includes(m.toLowerCase())),
      )
    : undefined

  return (
    <SectionShell
      id="architecture"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.architecture}
      summary={SECTION_ONELINE.architecture}
    >
      <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
        <LayerCake layers={ARCH_LAYERS} activeId={activeId} onLayerClick={onLayerOpen} />
        <div className="mt-2 text-center font-mono text-[11px] text-cyber-dim">
          点击任意一层 · 右侧会滑出这层的完整档案
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveId(undefined)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className={[
                'fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l bg-cyber-bg/95 p-6 shadow-2xl backdrop-blur-md',
                ACCENT_BORDER[active.color],
              ].join(' ')}
              role="dialog"
              aria-label={`${active.name} 详情`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-cyber-dim">layer drawer</div>
                  <h3 className={['mt-1 font-pixel text-xl', ACCENT_TEXT[active.color]].join(' ')}>
                    {active.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(undefined)}
                  className="rounded border border-cyber-border bg-cyber-panel/60 px-2 py-1 font-mono text-xs text-cyber-dim hover:text-cyber-text"
                >
                  ✕ 关闭
                </button>
              </div>

              <section className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-dim">role</div>
                <p className="mt-1 text-sm leading-relaxed text-cyber-text">{active.role}</p>
              </section>

              <section className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-dim">modules</div>
                <ul className="mt-2 space-y-1 font-mono text-[12px] text-cyber-text">
                  {active.modules.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2 rounded-md border border-cyber-border bg-cyber-panel/50 px-2 py-1.5"
                    >
                      <span className={ACCENT_TEXT[active.color]}>▸</span>
                      <code>{m}</code>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-dim">deep dive</div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-cyber-text">
                  {deepFor(active)}
                </p>
              </section>

              {relatedKp && (
                <section className="mt-5 rounded-md border border-cyber-border bg-cyber-panel/40 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-yellow">
                    related · {relatedKp.term}
                  </div>
                  <p className="mt-1 text-sm text-cyber-text">{relatedKp.oneLiner}</p>
                  <p className="mt-2 font-mono text-[11px] text-cyber-dim">{relatedKp.shallow}</p>
                </section>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </SectionShell>
  )
}
