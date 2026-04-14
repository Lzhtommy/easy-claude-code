import { motion } from 'framer-motion'
import { useState } from 'react'
import type { AccentColor, ArchLayer } from '../../data/types'

export interface LayerCakeProps {
  layers: ArchLayer[]
  onLayerClick?: (id: string) => void
  activeId?: string
}

const COLOR: Record<AccentColor, { stroke: string; fill: string; text: string; glow: string }> = {
  neon: { stroke: '#00ffd1', fill: 'rgba(0,255,209,0.12)', text: '#00ffd1', glow: '0 0 18px rgba(0,255,209,0.55)' },
  pink: { stroke: '#ff2e88', fill: 'rgba(255,46,136,0.12)', text: '#ff2e88', glow: '0 0 18px rgba(255,46,136,0.55)' },
  purple: { stroke: '#b14bff', fill: 'rgba(177,75,255,0.14)', text: '#b14bff', glow: '0 0 18px rgba(177,75,255,0.55)' },
  yellow: { stroke: '#ffe94b', fill: 'rgba(255,233,75,0.12)', text: '#ffe94b', glow: '0 0 18px rgba(255,233,75,0.45)' },
  blue: { stroke: '#4bc7ff', fill: 'rgba(75,199,255,0.12)', text: '#4bc7ff', glow: '0 0 18px rgba(75,199,255,0.55)' },
}

/**
 * 五层蛋糕式架构图。
 * 桌面：横向堆叠的透视蛋糕（自下而上）；移动：纵向列表。
 * 点击某层：放大 + 发光 + 暴露 activeId，调用 onLayerClick。
 */
export function LayerCake({ layers, onLayerClick, activeId }: LayerCakeProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [localActive, setLocalActive] = useState<string | null>(null)
  const active = activeId ?? localActive

  // 由下到上渲染（order 大的在下或上？按 order: 1 顶层；这里希望 L1 入口在最上、L5 服务在最底）
  const sorted = [...layers].sort((a, b) => a.order - b.order)

  const handle = (id: string) => {
    setLocalActive((cur) => (cur === id ? null : id))
    onLayerClick?.(id)
  }

  return (
    <div
      className="w-full"
      role="group"
      aria-label="Claude Code 五层架构蛋糕图"
    >
      {/* 桌面：伪 3D 蛋糕 */}
      <div className="hidden md:block">
        <div className="relative mx-auto flex flex-col items-center gap-2 py-4">
          {sorted.map((l, idx) => {
            const c = COLOR[l.color]
            const isActive = active === l.id
            const isHover = hoverId === l.id
            const widthPct = 95 - idx * 6 // 蛋糕从上到下略有收缩（顶层略窄）
            return (
              <motion.button
                key={l.id}
                type="button"
                onMouseEnter={() => setHoverId(l.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => handle(l.id)}
                aria-pressed={isActive}
                aria-label={`${l.name}：${l.role}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isActive ? 1.04 : isHover ? 1.02 : 1,
                }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                style={{
                  width: `${widthPct}%`,
                  borderColor: c.stroke,
                  background: c.fill,
                  boxShadow: isActive || isHover ? c.glow : 'none',
                  color: c.text,
                }}
                className="group relative flex items-center justify-between gap-6 rounded-md border px-6 py-4 text-left transition-[box-shadow,transform,background] duration-300 hover:bg-cyber-panel/90"
              >
                <div>
                  <div className="font-pixel text-sm sm:text-base" style={{ color: c.text }}>
                    {l.name}
                  </div>
                  <p className="mt-1 max-w-xl text-xs text-cyber-text sm:text-sm">{l.role}</p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 flex flex-wrap gap-1 font-mono text-[11px]"
                    >
                      {l.modules.map((m) => (
                        <span
                          key={m}
                          className="rounded border border-cyber-border bg-cyber-bg/70 px-1.5 py-0.5 text-cyber-dim"
                        >
                          {m}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
                <div className="shrink-0 font-mono text-[10px] text-cyber-dim">order&nbsp;{l.order}</div>
                {/* 层边缘高光 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.stroke}, transparent)` }}
                />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 移动：纵向列表 */}
      <div className="md:hidden">
        <ul className="space-y-2">
          {sorted.map((l) => {
            const c = COLOR[l.color]
            const isActive = active === l.id
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => handle(l.id)}
                  aria-pressed={isActive}
                  className="w-full rounded-md border bg-cyber-panel/60 p-3 text-left"
                  style={{
                    borderColor: c.stroke,
                    boxShadow: isActive ? c.glow : 'none',
                  }}
                >
                  <div className="font-pixel text-xs" style={{ color: c.text }}>
                    {l.name}
                  </div>
                  <p className="mt-1 text-xs text-cyber-text">{l.role}</p>
                  {isActive && (
                    <div className="mt-2 flex flex-wrap gap-1 font-mono text-[10px] text-cyber-dim">
                      {l.modules.map((m) => (
                        <span key={m} className="rounded border border-cyber-border px-1.5 py-0.5">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default LayerCake
