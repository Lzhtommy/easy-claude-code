import { useEffect, useState } from 'react'
import { SECTIONS } from '../../data/content'
import { useAppStore } from '../../store/useAppStore'
import type { SectionId } from '../../data/types'

export function Nav() {
  const activeSection = useAppStore((s) => s.activeSection)
  const setSection = useAppStore((s) => s.setSection)
  const [scrolled, setScrolled] = useState(false)

  // 简单监听滚动，根据离顶距离判断 active
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)

      let current: SectionId = 'hero'
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.3) {
          current = s.id
        }
      }
      if (current !== activeSection) setSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [activeSection, setSection])

  return (
    <header
      className={[
        'fixed left-0 right-0 top-0 z-50 border-b backdrop-blur transition-colors',
        scrolled
          ? 'border-cyber-neon/30 bg-cyber-bg/80 shadow-neon-green'
          : 'border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
        <a
          href="#hero"
          className="flex items-center gap-2 font-pixel text-xs text-cyber-neon"
        >
          <span className="h-2 w-2 rounded-full bg-cyber-neon shadow-neon-green" />
          CC.LEAK
        </a>
        <nav className="ml-2 hidden flex-wrap items-center gap-1 md:flex">
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={[
                  'rounded px-2.5 py-1 font-mono text-xs transition',
                  isActive
                    ? 'bg-cyber-neon/10 text-cyber-neon shadow-neon-green'
                    : 'text-cyber-dim hover:text-cyber-neon',
                ].join(' ')}
              >
                <span className="mr-1">{s.emoji}</span>
                {s.title}
              </a>
            )
          })}
        </nav>
        <div className="ml-auto hidden font-mono text-[10px] text-cyber-dim sm:block">
          snapshot @ 2026-03-31
        </div>
      </div>
    </header>
  )
}

export default Nav
