import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AGENT_LOOP_STEPS,
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import TerminalBlock from '../components/fx/TerminalBlock'
import NeonCard from '../components/fx/NeonCard'
import { AgentLoopDiagram } from '../components/viz/AgentLoopDiagram'
import type { AgentLoopStage, AgentLoopStep } from '../data/types'

type ScriptedStep = Pick<AgentLoopStep, 'stage' | 'text'> & {
  title?: string
}

interface Preset {
  id: string
  label: string
  prompt: string
  script: ScriptedStep[]
}

const PRESETS: Preset[] = [
  {
    id: 'preset-rename',
    label: '把 .js 批量改成 .ts',
    prompt: '帮我把仓库里的 .js 文件都改成 .ts，注意 import 路径也要改。',
    script: [
      { stage: 'think', title: 'QueryEngine.think', text: '// 目标：把仓库里所有 .js 改成 .ts。先看看有多少。' },
      { stage: 'call', title: 'tool_use', text: '>> GlobTool({ pattern: "**/*.js" })' },
      { stage: 'execute', title: 'tool_result', text: '<< 37 files matched' },
      { stage: 'feed', title: 'feed', text: '// 把 37 个路径写回上下文。' },
      { stage: 'think', title: 'QueryEngine.think', text: '// 下一步：读一个 → edit → 再读下一个，避免塞爆。' },
      { stage: 'call', title: 'tool_use', text: '>> FileEditTool({ path: "src/utils/hash.js" })' },
      { stage: 'execute', title: 'tool_result', text: '<< diff: 12 lines changed' },
      { stage: 'continue', title: 'loop', text: '// 还剩 36 个文件，继续。' },
    ],
  },
  {
    id: 'preset-bug',
    label: '修一个 flaky 测试',
    prompt: 'tests/payments.spec.ts 经常挂，帮我定位一下原因。',
    script: [
      { stage: 'think', title: 'QueryEngine.think', text: '// 先把失败的测试跑一下，看看报错。' },
      { stage: 'call', title: 'tool_use', text: '>> BashTool({ cmd: "npm test -- payments" })' },
      { stage: 'execute', title: 'tool_result', text: '<< FAIL · expected 42 got 41 (timing)' },
      { stage: 'feed', title: 'feed', text: '// stack trace 指向 computeFee() 的一个 setTimeout。' },
      { stage: 'think', title: 'QueryEngine.think', text: '// 怀疑是竞态——去读 computeFee 源。' },
      { stage: 'call', title: 'tool_use', text: '>> FileReadTool({ path: "src/payments/fee.ts" })' },
      { stage: 'execute', title: 'tool_result', text: '<< 发现一个依赖 Date.now() 的 race' },
      { stage: 'continue', title: 'loop', text: '// 已定位，接下来会打补丁 + 加 fake timer。' },
    ],
  },
  {
    id: 'preset-readme',
    label: '根据源码写一份 README',
    prompt: '给 src/tools/ 写一份 README，列出每个工具的用途。',
    script: [
      { stage: 'think', title: 'QueryEngine.think', text: '// 先扫一下 src/tools/ 里都有哪些文件。' },
      { stage: 'call', title: 'tool_use', text: '>> GlobTool({ pattern: "src/tools/*.ts" })' },
      { stage: 'execute', title: 'tool_result', text: '<< 41 files' },
      { stage: 'feed', title: 'feed', text: '// 按批读 10 个文件，抽出工具名 + 描述。' },
      { stage: 'think', title: 'QueryEngine.think', text: '// 下一步：把条目合并成 Markdown 表格。' },
      { stage: 'call', title: 'tool_use', text: '>> FileWriteTool({ path: "src/tools/README.md" })' },
      { stage: 'execute', title: 'tool_result', text: '<< wrote 1.8 KB' },
      { stage: 'continue', title: 'loop', text: '// 首版完成，准备让用户 review。' },
    ],
  },
]

const STAGE_ACCENT: Record<AgentLoopStage, { label: string; color: string; tag: string }> = {
  think: { label: 'think', color: '#00ffd1', tag: 'text-cyber-neon' },
  call: { label: 'tool_use', color: '#b14bff', tag: 'text-cyber-purple' },
  execute: { label: 'execute', color: '#ffe94b', tag: 'text-cyber-yellow' },
  feed: { label: 'feed', color: '#ff2e88', tag: 'text-cyber-pink' },
  continue: { label: 'loop', color: '#4bc7ff', tag: 'text-cyber-blue' },
}

// 默认脚本：循环 2 轮（首轮用 AGENT_LOOP_STEPS 里较完整的片段；第二轮快速收束）
function buildDefaultScript(userPrompt: string): ScriptedStep[] {
  const base: ScriptedStep[] = [
    { stage: 'think', title: 'QueryEngine.think', text: `// 收到任务：${userPrompt.slice(0, 60)}` },
    ...AGENT_LOOP_STEPS.map((s) => ({ stage: s.stage, text: s.text })),
    { stage: 'think', title: 'QueryEngine.think', text: '// 第二轮：逐个处理未完成项。' },
    { stage: 'call', title: 'tool_use', text: '>> FileEditTool({ path: "..." })' },
    { stage: 'execute', title: 'tool_result', text: '<< patched OK' },
    { stage: 'continue', title: 'loop', text: '// 任务队列清空，准备收尾。' },
  ]
  return base
}

export default function AgentLoop() {
  const meta = SECTIONS.find((s) => s.id === 'agent-loop')!
  const [prompt, setPrompt] = useState(PRESETS[0].prompt)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [steps, setSteps] = useState<ScriptedStep[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const timerRef = useRef<number | undefined>(undefined)

  const currentScript = useMemo(() => {
    const matched = PRESETS.find((p) => p.prompt === prompt)
    return matched ? matched.script : buildDefaultScript(prompt || '空任务')
  }, [prompt])

  const activeStage: AgentLoopStage | undefined =
    visibleCount > 0 ? steps[visibleCount - 1]?.stage : undefined

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const run = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setRunning(true)
    setDone(false)
    setSteps(currentScript)
    setVisibleCount(0)
    const stepOnce = (i: number) => {
      setVisibleCount(i + 1)
      if (i + 1 >= currentScript.length) {
        timerRef.current = window.setTimeout(() => {
          setRunning(false)
          setDone(true)
        }, 900)
        return
      }
      timerRef.current = window.setTimeout(() => stepOnce(i + 1), 1500)
    }
    timerRef.current = window.setTimeout(() => stepOnce(0), 250)
  }

  const reset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setRunning(false)
    setDone(false)
    setSteps([])
    setVisibleCount(0)
  }

  return (
    <SectionShell
      id="agent-loop"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS['agent-loop']}
      summary={SECTION_ONELINE['agent-loop']}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        {/* 左侧：模拟器 */}
        <NeonCard accent="yellow" interactive={false} className="space-y-4">
          <div className="font-mono text-xs text-cyber-dim">
            // 给这位实习生派个活，然后看他怎么转圈子
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPrompt(p.prompt)}
                className={[
                  'rounded-md border px-3 py-1.5 font-mono text-xs transition-colors',
                  prompt === p.prompt
                    ? 'border-cyber-yellow/70 bg-cyber-yellow/10 text-cyber-yellow'
                    : 'border-cyber-border bg-cyber-panel/50 text-cyber-dim hover:border-cyber-yellow/40 hover:text-cyber-text',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="描述一下你想让 Claude Code 干什么…"
            className="w-full resize-none rounded-md border border-cyber-border bg-cyber-bg/80 p-3 font-mono text-sm text-cyber-text placeholder:text-cyber-dim focus:border-cyber-yellow/70 focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running || !prompt.trim()}
              className="rounded-md border border-cyber-neon/60 bg-cyber-neon/10 px-4 py-2 font-mono text-sm text-cyber-neon transition-all hover:bg-cyber-neon/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {running ? '▶ running…' : '▶ 运行 Agent Loop'}
            </button>
            {(done || running) && (
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-cyber-border bg-cyber-panel/50 px-3 py-2 font-mono text-xs text-cyber-dim hover:text-cyber-text"
              >
                reset
              </button>
            )}
            <span className="ml-auto font-mono text-[11px] text-cyber-dim">
              step {visibleCount}/{steps.length}
            </span>
          </div>

          {/* 步骤流 */}
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {steps.slice(0, visibleCount).map((s, idx) => {
                const accent = STAGE_ACCENT[s.stage]
                return (
                  <motion.div
                    key={`${idx}-${s.text}`}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TerminalBlock
                      title={`[${accent.label}] ${s.title ?? 'loop'}`}
                      lines={[s.text]}
                      animate={false}
                      language="ts"
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-md border border-cyber-neon/60 bg-cyber-neon/10 px-4 py-3 font-mono text-sm text-cyber-neon shadow-neon-green"
              >
                ✓ 任务完成 · Agent 下班，token 账单稍后送达。
              </motion.div>
            )}
            {!running && !done && steps.length === 0 && (
              <div className="rounded-md border border-dashed border-cyber-border bg-cyber-panel/30 px-4 py-6 text-center font-mono text-xs text-cyber-dim">
                按“运行”开始循环 · 每步约 1.5s 出现一行
              </div>
            )}
          </div>
        </NeonCard>

        {/* 右侧：循环图 */}
        <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
          <AgentLoopDiagram activeStage={activeStage} />
        </div>
      </div>
    </SectionShell>
  )
}
