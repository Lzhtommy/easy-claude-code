import { useEffect, useState, type ReactNode } from 'react'

export interface TerminalBlockProps {
  title?: string
  lines: string[]
  animate?: boolean
  /** 每行出现间隔（ms） */
  stepMs?: number
  language?: 'ts' | 'bash' | 'plain'
  className?: string
  footer?: ReactNode
}

// 关键字集合（支持 TS / JS 常见关键字）
const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'import',
  'export',
  'from',
  'await',
  'async',
  'return',
  'if',
  'else',
  'true',
  'false',
  'null',
  'undefined',
  'new',
  'class',
  'this',
  'for',
  'while',
  'type',
  'interface',
])

/**
 * 简易 syntax highlighter
 * 识别：字符串（' " `）、注释（//...EOL）、数字、关键字、=>
 * 不追求完备，只为视觉效果。
 */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = []
  let i = 0
  let key = 0

  const push = (cls: string | null, text: string) => {
    if (!text) return
    if (cls) {
      out.push(
        <span key={key++} className={cls}>
          {text}
        </span>,
      )
    } else {
      out.push(<span key={key++}>{text}</span>)
    }
  }

  while (i < line.length) {
    const ch = line[i]

    // 注释 //
    if (ch === '/' && line[i + 1] === '/') {
      push('text-cyber-dim italic', line.slice(i))
      break
    }

    // 字符串
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let j = i + 1
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\' && j + 1 < line.length) j += 2
        else j++
      }
      const end = Math.min(j + 1, line.length)
      push('text-cyber-yellow', line.slice(i, end))
      i = end
      continue
    }

    // =>
    if (ch === '=' && line[i + 1] === '>') {
      push('text-cyber-pink font-semibold', '=>')
      i += 2
      continue
    }

    // 数字
    if (/[0-9]/.test(ch)) {
      let j = i
      while (j < line.length && /[0-9xXa-fA-F_.]/.test(line[j])) j++
      push('text-cyber-purple', line.slice(i, j))
      i = j
      continue
    }

    // 标识符 / 关键字
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i
      while (j < line.length && /[A-Za-z0-9_$]/.test(line[j])) j++
      const word = line.slice(i, j)
      if (KEYWORDS.has(word)) {
        push('text-cyber-pink font-semibold', word)
      } else if (word === 'tool_use' || word === 'Claude') {
        push('text-cyber-neon font-semibold', word)
      } else {
        push(null, word)
      }
      i = j
      continue
    }

    // 其他单字符
    push(null, ch)
    i++
  }

  return out
}

export function TerminalBlock({
  title = 'claude@code ~',
  lines,
  animate = true,
  stepMs = 120,
  language = 'ts',
  className = '',
  footer,
}: TerminalBlockProps) {
  const [revealed, setRevealed] = useState(animate ? 0 : lines.length)

  useEffect(() => {
    if (!animate) {
      setRevealed(lines.length)
      return
    }
    setRevealed(0)
    let cancelled = false
    let timer: number | undefined
    const step = (i: number) => {
      if (cancelled) return
      setRevealed(i)
      if (i < lines.length) {
        timer = window.setTimeout(() => step(i + 1), stepMs)
      }
    }
    timer = window.setTimeout(() => step(1), 120)
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [lines, animate, stepMs])

  const visible = lines.slice(0, revealed)

  return (
    <div
      className={
        'terminal-frame font-mono text-xs sm:text-sm overflow-hidden ' +
        className
      }
    >
      {/* 顶部红黄绿灯 + 标题 */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyber-border bg-black/30">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_4px_#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_4px_#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-[0_0_4px_#27c93f]" />
        <span className="ml-2 text-[10px] sm:text-xs text-cyber-dim tracking-wide">
          {title}
        </span>
      </div>

      {/* 内容 */}
      <div className="px-4 py-3 text-cyber-text leading-relaxed">
        {visible.map((line, idx) => {
          const isBash = language === 'bash'
          const content =
            language === 'plain' ? (
              <span>{line}</span>
            ) : (
              <>{highlight(line)}</>
            )
          return (
            <div
              key={idx}
              className="whitespace-pre-wrap break-words flex"
              style={{
                animation: animate
                  ? `fadeInLine 220ms ease-out both`
                  : undefined,
              }}
            >
              {isBash && (
                <span className="select-none text-cyber-neon mr-2">$</span>
              )}
              <span className="flex-1">{content || '\u00a0'}</span>
            </div>
          )
        })}
        {animate && revealed < lines.length && (
          <span className="inline-block text-cyber-neon animate-blink">▊</span>
        )}
        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </div>
  )
}

export default TerminalBlock
