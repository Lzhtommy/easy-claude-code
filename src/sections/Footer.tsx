export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-cyber-border/60 bg-cyber-panel/40 px-6 py-10 text-center font-mono text-xs text-cyber-dim"
    >
      <div>
        图解 Claude Code · 一本会动的源码百科 · 教学 / 研究用途，非 Anthropic 官方出品。
      </div>
      <div className="mt-2 text-[10px]">
        based on the 2026-03-31 public source-map snapshot · built with Vite + React + Tailwind
      </div>
    </footer>
  )
}
