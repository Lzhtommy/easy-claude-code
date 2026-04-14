import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { AgentLoopStage } from '../../data/types'

export interface AgentLoopDiagramProps {
  activeStage?: AgentLoopStage
  size?: number
}

interface Node {
  stage: AgentLoopStage
  label: string
  cost: string
  angle: number // 弧度
}

const NODES: Node[] = [
  { stage: 'think', label: 'think', cost: '~200 tok / 300ms', angle: -Math.PI / 2 },
  { stage: 'call', label: 'tool_use', cost: '~50 tok / 10ms', angle: 0 },
  { stage: 'execute', label: 'execute', cost: '工具自身耗时', angle: Math.PI / 2 },
  { stage: 'feed', label: 'feed', cost: '~工具输出大小', angle: Math.PI },
]

const STAGE_COLOR: Record<AgentLoopStage, string> = {
  think: '#00ffd1',
  call: '#b14bff',
  execute: '#ffe94b',
  feed: '#ff2e88',
  continue: '#4bc7ff',
}

/**
 * Agent Loop 环形图：
 * - 圆环路径 + strokeDashoffset 动画模拟沿路径流动的电流
 * - 四个节点分布在 0 / 90 / 180 / 270 度
 * - hover 节点显示开销
 */
export function AgentLoopDiagram({ activeStage, size = 360 }: AgentLoopDiagramProps) {
  const [hover, setHover] = useState<AgentLoopStage | null>(null)
  const r = size / 2 - 48
  const cx = size / 2
  const cy = size / 2

  const circumference = useMemo(() => 2 * Math.PI * r, [r])

  return (
    <div className="relative mx-auto w-full max-w-md" role="img" aria-label="Agent Loop 循环图">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        className="block"
        aria-hidden
      >
        <defs>
          <radialGradient id="loop-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,255,209,0.08)" />
            <stop offset="100%" stopColor="rgba(0,255,209,0)" />
          </radialGradient>
          <linearGradient id="loop-current" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffd1" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ffd1" stopOpacity="1" />
            <stop offset="100%" stopColor="#b14bff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 背景光晕 */}
        <circle cx={cx} cy={cy} r={r + 32} fill="url(#loop-bg)" />

        {/* 底层静态圆环 */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
        />
        {/* 电流：沿路径的高亮段 */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#loop-current)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.22} ${circumference * 0.78}`}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -circumference }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
          style={{ filter: 'drop-shadow(0 0 6px #00ffd1)' }}
        />

        {/* 箭头提示：顺时针方向 */}
        {NODES.map((n) => {
          const arrowAngle = n.angle + 0.12
          const ax = cx + Math.cos(arrowAngle) * r
          const ay = cy + Math.sin(arrowAngle) * r
          const tangent = arrowAngle + Math.PI / 2
          const size = 6
          return (
            <polygon
              key={`arr-${n.stage}`}
              points={`${ax},${ay} ${ax - size * Math.cos(tangent - 0.35)},${ay - size * Math.sin(tangent - 0.35)} ${ax - size * Math.cos(tangent + 0.35)},${ay - size * Math.sin(tangent + 0.35)}`}
              fill="#00ffd1"
              opacity={0.5}
            />
          )
        })}

        {/* 节点 */}
        {NODES.map((n) => {
          const x = cx + Math.cos(n.angle) * r
          const y = cy + Math.sin(n.angle) * r
          const isActive = activeStage === n.stage || hover === n.stage
          const color = STAGE_COLOR[n.stage]
          return (
            <g
              key={n.stage}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}，开销约 ${n.cost}`}
              onMouseEnter={() => setHover(n.stage)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.stage)}
              onBlur={() => setHover(null)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <circle
                cx={x}
                cy={y}
                r={isActive ? 28 : 22}
                fill="#12121f"
                stroke={color}
                strokeWidth={2}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 12px ${color})`
                    : `drop-shadow(0 0 4px ${color}80)`,
                  transition: 'r 0.2s, filter 0.2s',
                }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill={color}
                fontFamily='"JetBrains Mono", monospace'
                fontSize={11}
              >
                {n.label}
              </text>
            </g>
          )
        })}

        {/* 中心标签 */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#e6e6ff"
          fontFamily='"Press Start 2P", monospace'
          fontSize={11}
        >
          Agent Loop
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#6b6b8a"
          fontFamily='"JetBrains Mono", monospace'
          fontSize={9}
        >
          QueryEngine.ts
        </text>
      </svg>

      {/* hover 提示 */}
      <div className="mt-3 h-10 text-center font-mono text-xs text-cyber-dim">
        {hover ? (
          <span>
            <span style={{ color: STAGE_COLOR[hover] }}>{hover}</span> · {NODES.find((n) => n.stage === hover)?.cost}
          </span>
        ) : (
          <span className="opacity-60">hover 节点看开销</span>
        )}
      </div>
    </div>
  )
}

export default AgentLoopDiagram
