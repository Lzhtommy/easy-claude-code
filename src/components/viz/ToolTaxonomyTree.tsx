import { hierarchy, tree as d3Tree } from 'd3-hierarchy'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ToolCategory, ToolEntry } from '../../data/types'

export interface ToolTaxonomyTreeProps {
  tools: ToolEntry[]
  width?: number
  height?: number
  onSelectTool?: (tool: ToolEntry) => void
}

const CATEGORY_LABEL: Record<ToolCategory, string> = {
  file: '文件',
  shell: 'Shell',
  search: '搜索',
  web: 'Web',
  agent: 'Agent',
  task: '任务',
  team: '团队',
  plan: 'Plan',
  worktree: 'Worktree',
  mcp: 'MCP',
  lsp: 'LSP',
  schedule: '调度',
  memory: '记忆',
  meta: '元',
}

const CATEGORY_COLOR: Record<ToolCategory, string> = {
  file: '#00ffd1',
  shell: '#ff2e88',
  search: '#4bc7ff',
  web: '#b14bff',
  agent: '#ffe94b',
  task: '#00ffd1',
  team: '#ff2e88',
  plan: '#b14bff',
  worktree: '#ffe94b',
  mcp: '#4bc7ff',
  lsp: '#00ffd1',
  schedule: '#ff2e88',
  memory: '#b14bff',
  meta: '#4bc7ff',
}

interface TreeNode {
  id: string
  name: string
  kind: 'root' | 'category' | 'tool'
  category?: ToolCategory
  tool?: ToolEntry
  children?: TreeNode[]
}

/**
 * 工具分类树：root → 分类 → 工具。
 * 水平 d3 tree layout 手动渲染 SVG，节点用类别色；hover / focus 时发光 + 显示 tooltip。
 */
export function ToolTaxonomyTree({
  tools,
  width = 860,
  height = 620,
  onSelectTool,
}: ToolTaxonomyTreeProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)

  const rootData: TreeNode = useMemo(() => {
    const grouped = new Map<ToolCategory, ToolEntry[]>()
    tools.forEach((t) => {
      if (!grouped.has(t.category)) grouped.set(t.category, [])
      grouped.get(t.category)!.push(t)
    })
    const children: TreeNode[] = Array.from(grouped.entries()).map(([cat, ts]) => ({
      id: `cat-${cat}`,
      name: CATEGORY_LABEL[cat] ?? cat,
      kind: 'category',
      category: cat,
      children: ts.map((t) => ({
        id: t.id,
        name: t.name,
        kind: 'tool',
        category: cat,
        tool: t,
      })),
    }))
    return {
      id: 'root',
      name: '40+ Tools',
      kind: 'root',
      children,
    }
  }, [tools])

  const laid = useMemo(() => {
    const root = hierarchy<TreeNode>(rootData)
    // 横向 tree：size([height, width])
    d3Tree<TreeNode>().size([height - 40, width - 200]).separation((a, b) => (a.parent === b.parent ? 1 : 1.6))(root)
    return root
  }, [rootData, width, height])

  const links = laid.links()
  const descendants = laid.descendants()

  const hovered = descendants.find((d) => d.data.id === hoverId)

  return (
    <div className="w-full" role="img" aria-label="Claude Code 工具分类树">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ minWidth: 560 }}
          className="block"
        >
          <defs>
            <radialGradient id="tax-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(75,199,255,0.06)" />
              <stop offset="100%" stopColor="rgba(75,199,255,0)" />
            </radialGradient>
          </defs>
          <rect width={width} height={height} fill="url(#tax-bg)" />

          {/* 连线 */}
          {links.map((lnk, i) => {
            // d3 tree: x = vertical, y = horizontal（因为 size([h, w])）
            const sx = (lnk.source as any).y + 20
            const sy = (lnk.source as any).x + 20
            const tx = (lnk.target as any).y + 20
            const ty = (lnk.target as any).x + 20
            const midX = (sx + tx) / 2
            const d = `M${sx},${sy} C${midX},${sy} ${midX},${ty} ${tx},${ty}`
            const cat = (lnk.target.data as TreeNode).category
            const color = cat ? CATEGORY_COLOR[cat] : '#4bc7ff'
            const active =
              hoverId != null &&
              (hoverId === (lnk.source.data as TreeNode).id ||
                hoverId === (lnk.target.data as TreeNode).id)
            return (
              <path
                key={`lnk-${i}`}
                d={d}
                fill="none"
                stroke={color}
                strokeOpacity={active ? 0.9 : 0.35}
                strokeWidth={active ? 1.6 : 1}
              />
            )
          })}

          {/* 节点 */}
          {descendants.map((n) => {
            const data = n.data
            const x = (n as any).y + 20
            const y = (n as any).x + 20
            const color =
              data.kind === 'root'
                ? '#e6e6ff'
                : data.category
                  ? CATEGORY_COLOR[data.category]
                  : '#4bc7ff'
            const r = data.kind === 'root' ? 10 : data.kind === 'category' ? 7 : 4.5
            const isHover = hoverId === data.id
            return (
              <g
                key={data.id}
                tabIndex={0}
                role={data.kind === 'tool' ? 'button' : undefined}
                aria-label={
                  data.kind === 'tool'
                    ? `${data.tool?.name}：${data.tool?.description}`
                    : data.name
                }
                onMouseEnter={() => setHoverId(data.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(data.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => data.tool && onSelectTool?.(data.tool)}
                style={{ cursor: data.kind === 'tool' ? 'pointer' : 'default', outline: 'none' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={r + (isHover ? 2 : 0)}
                  fill="#12121f"
                  stroke={color}
                  strokeWidth={isHover ? 2.2 : 1.4}
                  style={{ filter: `drop-shadow(0 0 ${isHover ? 10 : 4}px ${color})` }}
                />
                <text
                  x={x + r + 6}
                  y={y + 3}
                  fill={isHover ? color : '#e6e6ff'}
                  fontFamily='"JetBrains Mono", monospace'
                  fontSize={data.kind === 'tool' ? 10 : 11}
                  opacity={data.kind === 'tool' ? 0.85 : 1}
                  style={{ pointerEvents: 'none' }}
                >
                  {data.kind === 'tool' ? `${data.tool?.icon ?? ''} ${data.name}` : data.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* hover 信息 */}
      <motion.div
        key={hoverId ?? 'idle'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 min-h-[52px] rounded-md border border-cyber-border bg-cyber-panel/60 p-3 font-mono text-xs"
      >
        {hovered?.data.kind === 'tool' && hovered.data.tool ? (
          <div>
            <span
              className="mr-2 font-pixel text-[10px]"
              style={{ color: hovered.data.category ? CATEGORY_COLOR[hovered.data.category] : '#00ffd1' }}
            >
              {hovered.data.tool.name}
            </span>
            <span className="text-cyber-dim">
              [{hovered.data.tool.permission}]&nbsp;·&nbsp;输入：{hovered.data.tool.input}&nbsp;·&nbsp;输出：{hovered.data.tool.output}
            </span>
            <div className="mt-1 text-cyber-text">{hovered.data.tool.description}</div>
          </div>
        ) : hovered?.data.kind === 'category' ? (
          <div className="text-cyber-dim">
            <span className="text-cyber-text">{hovered.data.name}</span> · 共 {hovered.children?.length ?? 0} 个工具
          </div>
        ) : (
          <div className="text-cyber-dim">hover 一个节点查看详情</div>
        )}
      </motion.div>
    </div>
  )
}

export default ToolTaxonomyTree
