import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { LeakEventNode, LeakSeverity } from '../../data/types'

export interface LeakTimelineVizProps {
  events: LeakEventNode[]
  onSelect?: (id: string) => void
  selectedId?: string
}

const SEVERITY_COLOR: Record<LeakSeverity, string> = {
  info: '#4bc7ff',
  warn: '#ffe94b',
  crit: '#ff2e88',
}

const SEVERITY_LABEL: Record<LeakSeverity, string> = {
  info: 'INFO',
  warn: 'WARN',
  crit: 'CRIT',
}

/** 把事件时间字符串解析成毫秒时间戳（尽量健壮）。 */
function parseTime(time: string): number {
  // 形如 "2026-03-31 00:42 UTC"
  const m = time.match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
  if (m) {
    const [, y, mo, d, hh = '0', mm = '0'] = m
    return Date.UTC(+y, +mo - 1, +d, +hh, +mm)
  }
  const t = Date.parse(time)
  return Number.isFinite(t) ? t : 0
}

/**
 * 水平时间轴 SVG：
 * - X 轴为事件时间范围（会自动在首尾留 padding）
 * - 节点颜色 = severity；上下交替以避免标签重叠
 * - 点击节点 → onSelect + 本地 selected 高亮
 */
export function LeakTimelineViz({ events, onSelect, selectedId }: LeakTimelineVizProps) {
  const [localSel, setLocalSel] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const sel = selectedId ?? localSel

  const width = 960
  const height = 220
  const pad = 48

  const sorted = useMemo(
    () => [...events].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
    [events],
  )

  const [minT, maxT] = useMemo(() => {
    if (sorted.length === 0) return [0, 1]
    const times = sorted.map((e) => parseTime(e.time))
    const mn = Math.min(...times)
    const mx = Math.max(...times)
    if (mx === mn) return [mn - 3600_000, mx + 3600_000]
    return [mn, mx]
  }, [sorted])

  const xFor = (t: number) => pad + ((t - minT) / (maxT - minT)) * (width - pad * 2)

  // X 轴刻度：每 4 小时一个（在跨度内）
  const ticks = useMemo(() => {
    const step = 4 * 60 * 60 * 1000
    const start = Math.ceil(minT / step) * step
    const out: { t: number; label: string }[] = []
    for (let t = start; t <= maxT; t += step) {
      const d = new Date(t)
      const hh = String(d.getUTCHours()).padStart(2, '0')
      out.push({ t, label: `${hh}:00` })
    }
    return out
  }, [minT, maxT])

  const handleSelect = (id: string) => {
    setLocalSel((cur) => (cur === id ? null : id))
    onSelect?.(id)
  }

  return (
    <div className="w-full" role="img" aria-label="泄露事件时间线">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ minWidth: 520 }}
          className="block"
        >
          <defs>
            <linearGradient id="tl-axis" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2e88" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00ffd1" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* 主轴 */}
          <line
            x1={pad}
            y1={height / 2}
            x2={width - pad}
            y2={height / 2}
            stroke="url(#tl-axis)"
            strokeWidth={2}
          />
          {/* 轴刻度 */}
          {ticks.map((tk) => (
            <g key={`tk-${tk.t}`}>
              <line
                x1={xFor(tk.t)}
                y1={height / 2 - 4}
                x2={xFor(tk.t)}
                y2={height / 2 + 4}
                stroke="#6b6b8a"
              />
              <text
                x={xFor(tk.t)}
                y={height / 2 + 20}
                textAnchor="middle"
                fill="#6b6b8a"
                fontFamily='"JetBrains Mono", monospace'
                fontSize={10}
              >
                {tk.label}
              </text>
            </g>
          ))}

          {/* 事件节点 */}
          {sorted.map((e, i) => {
            const x = xFor(parseTime(e.time))
            const above = i % 2 === 0
            const y = above ? height / 2 - 56 : height / 2 + 56
            const color = SEVERITY_COLOR[e.severity]
            const isSel = sel === e.id
            const isHover = hoverId === e.id
            const dim = sel !== null && !isSel
            return (
              <g
                key={e.id}
                onClick={() => handleSelect(e.id)}
                onMouseEnter={() => setHoverId(e.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(e.id)}
                onBlur={() => setHoverId(null)}
                tabIndex={0}
                role="button"
                aria-label={`${e.time}，${e.title}（${SEVERITY_LABEL[e.severity]}）`}
                aria-pressed={isSel}
                style={{ cursor: 'pointer', outline: 'none', opacity: dim ? 0.4 : 1, transition: 'opacity 0.2s' }}
              >
                {/* 垂直引线 */}
                <line
                  x1={x}
                  y1={height / 2}
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeOpacity={isSel || isHover ? 0.9 : 0.4}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                {/* 主节点 */}
                <motion.circle
                  cx={x}
                  cy={height / 2}
                  r={isSel || isHover ? 9 : 6}
                  fill="#12121f"
                  stroke={color}
                  strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  style={{ filter: `drop-shadow(0 0 ${isSel || isHover ? 10 : 4}px ${color})` }}
                />
                {/* 标签节点 */}
                <rect
                  x={x - 80}
                  y={y - (above ? 28 : -4)}
                  width={160}
                  height={28}
                  rx={4}
                  fill="rgba(18,18,31,0.9)"
                  stroke={color}
                  strokeOpacity={isSel || isHover ? 1 : 0.5}
                />
                <text
                  x={x}
                  y={y - (above ? 14 : -14)}
                  textAnchor="middle"
                  fill={color}
                  fontFamily='"JetBrains Mono", monospace'
                  fontSize={10}
                >
                  [{SEVERITY_LABEL[e.severity]}]
                </text>
                <text
                  x={x}
                  y={y - (above ? 2 : -26)}
                  textAnchor="middle"
                  fill="#e6e6ff"
                  fontFamily='"JetBrains Mono", monospace'
                  fontSize={10}
                >
                  {e.title.length > 14 ? e.title.slice(0, 13) + '…' : e.title}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      {/* 图例 */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-cyber-dim">
        {(Object.keys(SEVERITY_COLOR) as LeakSeverity[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: SEVERITY_COLOR[s], boxShadow: `0 0 6px ${SEVERITY_COLOR[s]}` }}
            />
            <span style={{ color: SEVERITY_COLOR[s] }}>{SEVERITY_LABEL[s]}</span>
          </span>
        ))}
        <span className="opacity-70">· 点击节点看详情</span>
      </div>
    </div>
  )
}

export default LeakTimelineViz
