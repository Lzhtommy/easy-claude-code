import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export type MessageKind = 'dispatch' | 'report' | 'dm'

export interface AgentNode {
  id: string
  label: string
  role: string
}

export interface AgentMessage {
  from: string
  to: string
  kind: MessageKind
}

export interface MultiAgentTopologyProps {
  lead?: AgentNode
  teammates?: AgentNode[]
  messages?: AgentMessage[]
  size?: number
}

const DEFAULT_LEAD: AgentNode = { id: 'lead', label: 'Lead', role: '调度 · 汇总' }
const DEFAULT_TEAMMATES: AgentNode[] = [
  { id: 'A', label: 'Teammate A', role: '内容架构' },
  { id: 'B', label: 'Teammate B', role: '互动系统' },
  { id: 'C', label: 'Teammate C', role: '视觉动效' },
  { id: 'D', label: 'Teammate D', role: '内容撰写' },
  { id: 'E', label: 'Teammate E', role: '数据可视化' },
]
const DEFAULT_MESSAGES: AgentMessage[] = [
  { from: 'lead', to: 'A', kind: 'dispatch' },
  { from: 'lead', to: 'B', kind: 'dispatch' },
  { from: 'lead', to: 'C', kind: 'dispatch' },
  { from: 'lead', to: 'D', kind: 'dispatch' },
  { from: 'lead', to: 'E', kind: 'dispatch' },
  { from: 'A', to: 'lead', kind: 'report' },
  { from: 'E', to: 'lead', kind: 'report' },
  { from: 'D', to: 'A', kind: 'dm' },
  { from: 'E', to: 'B', kind: 'dm' },
]

const KIND_COLOR: Record<MessageKind, string> = {
  dispatch: '#00ffd1',
  report: '#ff2e88',
  dm: '#b14bff',
}

const KIND_LABEL: Record<MessageKind, string> = {
  dispatch: '任务派发',
  report: '完成汇报',
  dm: '协作 DM',
}

/**
 * 多 Agent 协作拓扑：Lead 居中，队员极坐标分布，消息曲线按类型着色并动画流动。
 */
export function MultiAgentTopology({
  lead = DEFAULT_LEAD,
  teammates = DEFAULT_TEAMMATES,
  messages = DEFAULT_MESSAGES,
  size = 440,
}: MultiAgentTopologyProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 56

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {
      [lead.id]: { x: cx, y: cy },
    }
    teammates.forEach((t, i) => {
      const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / teammates.length
      map[t.id] = { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R }
    })
    return map
  }, [lead.id, teammates, cx, cy, R])

  // 曲线控制点：两端点连线的中点 + 法向偏移
  const curvePath = (a: { x: number; y: number }, b: { x: number; y: number }, bend = 30) => {
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    // 法向：旋转 90°
    const nx = -dy / len
    const ny = dx / len
    const cxp = mx + nx * bend
    const cyp = my + ny * bend
    return `M${a.x},${a.y} Q${cxp},${cyp} ${b.x},${b.y}`
  }

  return (
    <div className="w-full" role="img" aria-label="多 Agent 协作拓扑图">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" className="block">
        <defs>
          <radialGradient id="ma-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,46,136,0.08)" />
            <stop offset="100%" stopColor="rgba(255,46,136,0)" />
          </radialGradient>
          {(['dispatch', 'report', 'dm'] as MessageKind[]).map((k) => (
            <marker
              key={k}
              id={`arrow-${k}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={KIND_COLOR[k]} />
            </marker>
          ))}
        </defs>

        <circle cx={cx} cy={cy} r={R + 40} fill="url(#ma-bg)" />
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 5"
        />

        {/* 消息曲线 */}
        {messages.map((m, i) => {
          const a = positions[m.from]
          const b = positions[m.to]
          if (!a || !b) return null
          const bend = m.kind === 'dm' ? 40 : m.kind === 'report' ? -20 : 20
          const d = curvePath(a, b, bend)
          const active = hoverId === m.from || hoverId === m.to
          return (
            <g key={`msg-${i}`} opacity={active ? 1 : 0.75}>
              <motion.path
                d={d}
                fill="none"
                stroke={KIND_COLOR[m.kind]}
                strokeWidth={active ? 2.2 : 1.4}
                strokeLinecap="round"
                strokeDasharray="6 10"
                markerEnd={`url(#arrow-${m.kind})`}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -64 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                style={{ filter: `drop-shadow(0 0 4px ${KIND_COLOR[m.kind]})` }}
              />
            </g>
          )
        })}

        {/* 节点 */}
        {[lead, ...teammates].map((n) => {
          const p = positions[n.id]
          const isLead = n.id === lead.id
          const isHover = hoverId === n.id
          const color = isLead ? '#ff2e88' : '#00ffd1'
          const radius = isLead ? 34 : 24
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}：${n.role}`}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(n.id)}
              onBlur={() => setHoverId(null)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={radius + (isHover ? 4 : 0)}
                fill="#12121f"
                stroke={color}
                strokeWidth={2}
                style={{ filter: `drop-shadow(0 0 ${isHover ? 14 : 6}px ${color})`, transition: 'r 0.2s, filter 0.2s' }}
              />
              <text
                x={p.x}
                y={p.y + 3}
                textAnchor="middle"
                fill={color}
                fontFamily='"Press Start 2P", monospace'
                fontSize={isLead ? 11 : 10}
              >
                {isLead ? 'LEAD' : n.id}
              </text>
              <text
                x={p.x}
                y={p.y + radius + 14}
                textAnchor="middle"
                fill="#e6e6ff"
                fontFamily='"JetBrains Mono", monospace'
                fontSize={10}
              >
                {isLead ? lead.label : n.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* 图例 */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-cyber-dim">
        {(Object.keys(KIND_COLOR) as MessageKind[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-2 w-6 rounded"
              style={{ background: KIND_COLOR[k], boxShadow: `0 0 6px ${KIND_COLOR[k]}` }}
            />
            <span style={{ color: KIND_COLOR[k] }}>{KIND_LABEL[k]}</span>
          </span>
        ))}
        {hoverId && (
          <span className="ml-2">
            <span className="text-cyber-text">hover：</span>
            {hoverId === lead.id
              ? `${lead.label}（${lead.role}）`
              : (() => {
                  const t = teammates.find((tm) => tm.id === hoverId)
                  return t ? `${t.label}（${t.role}）` : ''
                })()}
          </span>
        )}
      </div>
    </div>
  )
}

export default MultiAgentTopology
