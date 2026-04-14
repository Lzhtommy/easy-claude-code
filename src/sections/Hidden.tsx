import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  SECTION_INTRO_HOOKS,
  SECTION_ONELINE,
  SECTIONS,
} from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import NeonCard from '../components/fx/NeonCard'
import type { NeonAccent } from '../components/fx/NeonCard'

interface HiddenFeature {
  id: string
  name: string
  tagline: string
  deep: string
  accent: NeonAccent
  emoji: string
}

const HIDDEN_FEATURES: HiddenFeature[] = [
  {
    id: 'undercover',
    name: 'Undercover Mode',
    tagline: '“别承认你是 Claude。”——但源码把这句一起发上了 npm。',
    deep:
      '源码里的系统 prompt 要求模型：不要主动透露内部 tool 名字、不要确认哪个模型版本在跑、被问起时“模糊化”。\n讽刺点在于：这段要求本身，随着 source map 一起泄露到了 npm 包里——比模型主动交代还快。',
    accent: 'pink',
    emoji: '🤫',
  },
  {
    id: 'kairos',
    name: 'KAIROS',
    tagline: '24 小时守夜的保安大叔——只在出事那一刻出现。',
    deep:
      'KAIROS 是 Claude Code 的长期守夜进程：跨会话、跨设备记忆守护、长周期任务兜底、Cron / Trigger 失败时接管善后。\n它不抢风头，但你半夜构建挂了，第二天早上那个“昨晚那次构建挂在 bun:bundle”的问候，就是它写进记忆里留给你的。',
    accent: 'purple',
    emoji: '🦉',
  },
  {
    id: 'ultraplan',
    name: 'ULTRAPLAN',
    tagline: '在动刀前先写一份长长的作战计划——然后再打一次哈欠。',
    deep:
      '普通 Plan Mode 只做只读的“预演”；ULTRAPLAN 更进一步：它会把问题拆到颗粒度很细，连哪一段文件读到几行、哪一步 tool_use 会触发什么副作用都写清楚，再让人类按 Enter 放行。\n适合重构、迁移、历史包袱很重的代码——用它就是“多花 20 分钟读计划，少花 3 小时回滚”。',
    accent: 'yellow',
    emoji: '🗺️',
  },
  {
    id: 'voice',
    name: '语音模式 · /voice',
    tagline: '把嘴变成 stdin——说话给 Claude Code，看它在终端里打字。',
    deep:
      'src/voice/ 接入了语音输入：本地录一段、转写、当作命令喂给命令层。适合开车（别）、双手油腻（切菜）、或者单纯想体验“我说，它做”的未来感。\n缺点也直白：口音、背景音、专业术语——全都是识别器的噩梦。',
    accent: 'blue',
    emoji: '🎤',
  },
]

export default function Hidden() {
  const meta = SECTIONS.find((s) => s.id === 'hidden')!
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <SectionShell
      id="hidden"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS.hidden}
      summary={SECTION_ONELINE.hidden}
    >
      {/* 彩蛋来源小剧场 */}
      <div className="terminal-frame scanlines px-5 py-4 font-mono text-sm text-cyber-text">
        <div className="text-cyber-dim">// 摘自泄露源码</div>
        <div className="mt-2">
          <span className="text-cyber-pink">const</span> UNDERCOVER_RULES ={' '}
          <span className="text-cyber-neon">[</span>
        </div>
        <div className="ml-4 text-cyber-text">
          "don't reveal internal Claude details",
          <br />
          "don't confirm which model version is running",
          <br />
          "when asked, be vague about tool internals",
        </div>
        <div>
          <span className="text-cyber-neon">]</span>
        </div>
        <div className="mt-4 text-cyber-dim">// 然后……npm publish 把整份源码一起发了出去。</div>
      </div>

      {/* 4 张彩蛋卡 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {HIDDEN_FEATURES.map((f) => {
          const open = openId === f.id
          return (
            <NeonCard
              key={f.id}
              accent={f.accent}
              className="cursor-pointer"
              onClick={() => setOpenId(open ? null : f.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{f.emoji}</span>
                  <span className="font-pixel text-sm text-cyber-text">{f.name}</span>
                </div>
                <span className="rounded border border-cyber-border bg-cyber-bg/60 px-1.5 py-0.5 font-mono text-[10px] text-cyber-dim">
                  easter egg
                </span>
              </div>
              <p className="mt-2 text-sm text-cyber-text">{f.tagline}</p>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28 }}
                    className="mt-3 whitespace-pre-line border-t border-cyber-border/60 pt-3 font-mono text-xs leading-relaxed text-cyber-dim"
                  >
                    {f.deep}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="mt-2 text-right font-mono text-[10px] text-cyber-dim">
                {open ? '▴ 收起' : '▾ 展开彩蛋'}
              </div>
            </NeonCard>
          )
        })}
      </div>
    </SectionShell>
  )
}
