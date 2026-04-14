/**
 * 全局数据模型。所有章节通过 content.ts 消费这些接口。
 * 作者：Teammate A（内容架构师）
 */

// -------------------- Section --------------------
export type SectionId =
  | 'hero'
  | 'leak'
  | 'architecture'
  | 'agent-loop'
  | 'tools'
  | 'permission'
  | 'memory'
  | 'multi-agent'
  | 'buddy'
  | 'hidden'

export type AccentColor =
  | 'neon'
  | 'pink'
  | 'purple'
  | 'yellow'
  | 'blue'

export interface Section {
  id: SectionId
  title: string
  subtitle: string
  emoji: string
  accentColor: AccentColor
  summary: string
  order: number
}

// -------------------- Knowledge Point --------------------
export interface KnowledgePoint {
  id: string
  term: string
  /** 一句话生活化比喻 */
  oneLiner: string
  /** 卡片收起时显示的浅层解释 */
  shallow: string
  /** 卡片展开后的深入解释（支持多段，用 \n\n 分隔） */
  deep: string
  tags: string[]
}

// -------------------- Architecture --------------------
export interface ArchLayer {
  id: string
  /** 层名，例如 "入口 / CLI 层" */
  name: string
  /** 职责描述 */
  role: string
  /** 代表性模块路径 */
  modules: string[]
  /** 霓虹配色 key */
  color: AccentColor
  order: number
}

// -------------------- Agent Loop --------------------
export type AgentLoopStage = 'think' | 'call' | 'execute' | 'feed' | 'continue'

export interface AgentLoopToolCall {
  tool: string
  args: Record<string, string | number | boolean>
  result?: string
}

export interface AgentLoopStep {
  id: string
  stage: AgentLoopStage
  /** 终端展示的一行文案 */
  text: string
  toolCall?: AgentLoopToolCall
  /** 打字机效果持续毫秒 */
  duration: number
}

// -------------------- Tools --------------------
export type ToolCategory =
  | 'file'
  | 'shell'
  | 'search'
  | 'web'
  | 'agent'
  | 'task'
  | 'team'
  | 'plan'
  | 'worktree'
  | 'mcp'
  | 'lsp'
  | 'schedule'
  | 'memory'
  | 'meta'

export type ToolPermission = 'safe' | 'ask' | 'danger'

export interface ToolEntry {
  id: string
  name: string
  category: ToolCategory
  /** 输入类型（中文简述） */
  input: string
  /** 输出类型（中文简述） */
  output: string
  permission: ToolPermission
  description: string
  /** 用作卡片左上角的图标字符（emoji 或 ascii） */
  icon: string
}

// -------------------- Permission Game --------------------
export type PermissionChoice = 'allow' | 'ask' | 'deny'

export interface PermissionScenario {
  id: string
  scenario: string
  tool: string
  recommended: PermissionChoice
  explain: string
}

// -------------------- Memory System --------------------
export interface MemoryLayer {
  id: string
  /** 层名：user / project / team / transient 等 */
  name: string
  tagline: string
  /** 深度 1=最浅，4=最深 */
  depth: 1 | 2 | 3 | 4
  whenWritten: string
  whoReads: string
  example: string
}

// -------------------- Multi-Agent --------------------
export type SpawnKind = 'fork' | 'remote' | 'in-process'

export interface SpawnMode {
  id: string
  kind: SpawnKind
  name: string
  tagline: string
  isolation: string
  cost: string
  useCase: string
  pros: string[]
  cons: string[]
}

// -------------------- Buddy Gacha --------------------
export type BuddyRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR'

export interface BuddySpecies {
  id: string
  /** 英文 id（来自 src/buddy/sprites.ts） */
  speciesKey: string
  /** 中文名 */
  name: string
  emoji: string
  /** ASCII 代表造型，换行用 \n */
  ascii: string
  rarity: BuddyRarity
  traits: string[]
}

// -------------------- Leak Timeline --------------------
export type LeakSeverity = 'info' | 'warn' | 'crit'

export interface LeakEventNode {
  id: string
  /** 时间戳，ISO 或可读字符串 */
  time: string
  title: string
  detail: string
  severity: LeakSeverity
}
