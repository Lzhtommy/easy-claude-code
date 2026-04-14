import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { BuddyRarity, BuddySpecies } from '../../data/types'
import { BUDDY_SPECIES } from '../../data/content'

export interface BuddyStatsProps {
  /** 如果给定，就按此 Buddy 算 traits → Radar 维度。 */
  currentBuddy?: BuddySpecies
  /** 全部物种。默认为 BUDDY_SPECIES。 */
  species?: BuddySpecies[]
}

const RARITY_COLOR: Record<BuddyRarity, string> = {
  N: '#4bc7ff',
  R: '#00ffd1',
  SR: '#b14bff',
  SSR: '#ffe94b',
  UR: '#ff2e88',
}

const RARITY_ORDER: BuddyRarity[] = ['N', 'R', 'SR', 'SSR', 'UR']

/** 雷达维度 */
const RADAR_AXES = ['DEBUGGING', 'CHAOS', 'SNARK', 'FOCUS', 'WISDOM'] as const

/** 从 traits + rarity + speciesKey 衍生一个确定性的属性分数（0-100）。 */
function deriveStats(buddy: BuddySpecies): Record<(typeof RADAR_AXES)[number], number> {
  const rarityBoost: Record<BuddyRarity, number> = { N: 10, R: 20, SR: 35, SSR: 55, UR: 80 }
  const base = rarityBoost[buddy.rarity]
  // 用字符串哈希做稳定扰动，保证同一只 buddy 每次雷达图一样
  const hash = (s: string) => {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
    return Math.abs(h)
  }
  const seed = hash(buddy.speciesKey)
  const axis = (name: string) => {
    const n = hash(buddy.speciesKey + '/' + name)
    return Math.min(100, base + ((n + seed) % 45))
  }
  return {
    DEBUGGING: axis('DEBUGGING'),
    CHAOS: axis('CHAOS'),
    SNARK: axis('SNARK'),
    FOCUS: axis('FOCUS'),
    WISDOM: axis('WISDOM'),
  }
}

const tooltipStyle = {
  background: '#12121f',
  border: '1px solid #1e1e35',
  borderRadius: 6,
  color: '#e6e6ff',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 12,
}

export function BuddyStats({ currentBuddy, species = BUDDY_SPECIES }: BuddyStatsProps) {
  const pieData = useMemo(() => {
    const counts: Record<BuddyRarity, number> = { N: 0, R: 0, SR: 0, SSR: 0, UR: 0 }
    species.forEach((s) => {
      counts[s.rarity] += 1
    })
    return RARITY_ORDER.map((r) => ({
      name: r,
      value: counts[r],
      color: RARITY_COLOR[r],
    })).filter((d) => d.value > 0)
  }, [species])

  const radarData = useMemo(() => {
    const stats = currentBuddy ? deriveStats(currentBuddy) : null
    return RADAR_AXES.map((axis) => ({
      axis,
      value: stats ? stats[axis] : 0,
      fullMark: 100,
    }))
  }, [currentBuddy])

  const total = pieData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Buddy 统计图表">
      {/* 饼图：稀有度分布 */}
      <div
        className="rounded-md border border-cyber-border bg-cyber-panel/50 p-4"
        role="img"
        aria-label="Buddy 按稀有度分布饼图"
      >
        <div className="mb-2 font-mono text-xs text-cyber-dim">
          稀有度分布 · 共 {total} 只
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                stroke="#0a0a12"
                strokeWidth={2}
                label={({ name, value }) => `${name} · ${value}`}
                labelLine={false}
                isAnimationActive
              >
                {pieData.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.color}
                    style={{ filter: `drop-shadow(0 0 6px ${d.color})` }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, n: string) => [`${v} 只`, `稀有度 ${n}`]}
              />
              <Legend
                wrapperStyle={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#6b6b8a' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 雷达图：当前 buddy 属性 */}
      <div
        className="rounded-md border border-cyber-border bg-cyber-panel/50 p-4"
        role="img"
        aria-label={
          currentBuddy
            ? `${currentBuddy.name} 属性雷达图`
            : '属性雷达图，待抽取 Buddy'
        }
      >
        <div className="mb-2 flex items-baseline justify-between font-mono text-xs text-cyber-dim">
          <span>属性雷达</span>
          <span className="text-cyber-text">
            {currentBuddy ? (
              <>
                <span className="mr-1">{currentBuddy.emoji}</span>
                {currentBuddy.name}
                <span className="ml-2" style={{ color: RARITY_COLOR[currentBuddy.rarity] }}>
                  [{currentBuddy.rarity}]
                </span>
              </>
            ) : (
              '先去扭蛋，再看属性'
            )}
          </span>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="#1e1e35" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#6b6b8a', fontFamily: '"JetBrains Mono", monospace', fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6b6b8a', fontSize: 9 }}
                axisLine={false}
                tickCount={5}
              />
              <Radar
                dataKey="value"
                stroke={currentBuddy ? RARITY_COLOR[currentBuddy.rarity] : '#00ffd1'}
                fill={currentBuddy ? RARITY_COLOR[currentBuddy.rarity] : '#00ffd1'}
                fillOpacity={0.25}
                strokeWidth={2}
                isAnimationActive
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, _n: string, entry: any) => [`${v}`, entry?.payload?.axis ?? '']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default BuddyStats
