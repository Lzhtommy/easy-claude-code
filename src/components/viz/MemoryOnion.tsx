import { motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import type { MemoryLayer } from '../../data/types'

export interface MemoryOnionProps {
  layers: MemoryLayer[]
  activeId?: string
  onActiveChange?: (id: string | null) => void
  size?: number
  /**
   * render prop：外部可根据当前激活层渲染详情面板。
   * 当没有提供时，组件内渲染一个默认详情面板。
   */
  renderDetail?: (active: MemoryLayer | null) => ReactNode
}

const DEPTH_COLOR: Record<number, string> = {
  1: '#4bc7ff',
  2: '#00ffd1',
  3: '#b14bff',
  4: '#ff2e88',
}

/**
 * 四层记忆洋葱图（最内 depth=1 会话层 / 最外 depth=4 用户层）。
 * 点击某层 → 其它层淡出。右侧通过 renderDetail 或默认 UI 显示详情。
 */
export function MemoryOnion({
  layers,
  activeId,
  onActiveChange,
  size = 340,
  renderDetail,
}: MemoryOnionProps) {
  const [localActive, setLocalActive] = useState<string | null>(null)
  const active = activeId ?? localActive

  const setActive = (id: string | null) => {
    setLocalActive(id)
    onActiveChange?.(id)
  }

  // 按 depth 升序：最小最内
  const sorted = [...layers].sort((a, b) => a.depth - b.depth)
  const maxR = size / 2 - 12
  const minR = 26

  const activeLayer = sorted.find((l) => l.id === active) ?? null

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div role="img" aria-label="记忆系统四层洋葱图">
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" className="block">
          <defs>
            <radialGradient id="onion-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(177,75,255,0.14)" />
              <stop offset="100%" stopColor="rgba(177,75,255,0)" />
            </radialGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={maxR + 8} fill="url(#onion-bg)" />

          {/* 由外到内绘制，这样点击最内层也能被命中 */}
          {[...sorted].reverse().map((l, idx, arr) => {
            const depthIdx = sorted.length - 1 - idx // 0=最内
            const r = minR + ((maxR - minR) * (depthIdx + 1)) / sorted.length
            const color = DEPTH_COLOR[l.depth] ?? '#00ffd1'
            const isActive = active === l.id
            const dim = active !== null && !isActive
            return (
              <motion.circle
                key={l.id}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill={`${color}22`}
                stroke={color}
                strokeWidth={isActive ? 3 : 1.5}
                style={{
                  filter: isActive ? `drop-shadow(0 0 14px ${color})` : `drop-shadow(0 0 4px ${color}66)`,
                  cursor: 'pointer',
                  transition: 'stroke-width 0.2s, filter 0.2s',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: dim ? 0.25 : 1 }}
                transition={{ duration: 0.35, delay: (arr.length - idx) * 0.05 }}
                onClick={() => setActive(isActive ? null : l.id)}
                role="button"
                tabIndex={0}
                aria-label={`${l.name}（第 ${l.depth} 层）`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(isActive ? null : l.id)
                  }
                }}
              />
            )
          })}

          {/* 层标签 —— 放在每层上缘 */}
          {sorted.map((l) => {
            const depthIdx = l.depth - 1
            const r = minR + ((maxR - minR) * (depthIdx + 1)) / sorted.length
            const color = DEPTH_COLOR[l.depth] ?? '#00ffd1'
            const isActive = active === l.id
            const dim = active !== null && !isActive
            return (
              <text
                key={`lbl-${l.id}`}
                x={size / 2}
                y={size / 2 - r + 14}
                textAnchor="middle"
                fill={color}
                opacity={dim ? 0.35 : 1}
                fontFamily='"JetBrains Mono", monospace'
                fontSize={10}
                style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}
              >
                L{l.depth} · {l.name.split('（')[0]}
              </text>
            )
          })}
        </svg>
        <div className="mt-2 text-center font-mono text-xs text-cyber-dim">
          点击某层 → 其它层淡出
        </div>
      </div>

      {/* 详情面板 */}
      <div className="min-h-[240px]">
        {renderDetail ? (
          renderDetail(activeLayer)
        ) : (
          <DefaultDetail layer={activeLayer} />
        )}
      </div>
    </div>
  )
}

function DefaultDetail({ layer }: { layer: MemoryLayer | null }) {
  if (!layer) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-md border border-dashed border-cyber-border bg-cyber-panel/30 p-6 font-mono text-sm text-cyber-dim">
        选一层，看看谁写 / 谁读。
      </div>
    )
  }
  const color = DEPTH_COLOR[layer.depth] ?? '#00ffd1'
  return (
    <div
      className="rounded-md border bg-cyber-panel/60 p-5"
      style={{ borderColor: color, boxShadow: `0 0 18px ${color}55` }}
    >
      <div className="mb-1 font-pixel text-sm" style={{ color }}>
        L{layer.depth} · {layer.name}
      </div>
      <p className="mt-2 text-sm text-cyber-text">{layer.tagline}</p>
      <dl className="mt-3 space-y-1 font-mono text-xs text-cyber-dim">
        <div>
          <span className="text-cyber-text">write:</span> {layer.whenWritten}
        </div>
        <div>
          <span className="text-cyber-text">reader:</span> {layer.whoReads}
        </div>
        <div className="mt-2 italic">e.g. {layer.example}</div>
      </dl>
    </div>
  )
}

export default MemoryOnion
