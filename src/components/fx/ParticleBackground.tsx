import { useEffect, useRef } from 'react'

// 粒子符号 —— 代码/终端/AI 语义的混合
const SYMBOLS = [
  '{}',
  '=>',
  '//',
  'tool_use',
  'async',
  'await',
  'const',
  'let',
  '0',
  '1',
  '█',
  '</>',
  '0xFF',
  '···',
  'if',
  'null',
]

const COLORS = [
  'rgba(0, 255, 209, 0.65)', // cyan / neon
  'rgba(255, 46, 136, 0.55)', // pink
  'rgba(177, 75, 255, 0.55)', // purple
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  color: string
  size: number
  alpha: number
  baseVx: number
  baseVy: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    function resize() {
      if (!canvas || !ctx) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()

    const isMobile = width < 640
    const densityDivisor = isMobile ? 48000 : 24000
    const maxCount = isMobile ? 36 : 90
    const count = Math.min(maxCount, Math.floor((width * height) / densityDivisor))

    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const baseVx = (Math.random() - 0.5) * 0.25
      const baseVy = -Math.random() * 0.35 - 0.05
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 10 + Math.random() * 8,
        alpha: 0.3 + Math.random() * 0.55,
      })
    }

    function onResize() {
      resize()
    }
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    function onMouseLeave() {
      mouseRef.current.active = false
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const INFLUENCE = 140
    const INFLUENCE_SQ = INFLUENCE * INFLUENCE

    function frame() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouseRef.current.active

      for (const p of particles) {
        // 鼠标吸附（近处轻微吸引）
        if (mouseActive) {
          const dx = mx - p.x
          const dy = my - p.y
          const d2 = dx * dx + dy * dy
          if (d2 < INFLUENCE_SQ && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (1 - d / INFLUENCE) * 0.05
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
        }

        // 缓慢回到基础速度（弹性）
        p.vx += (p.baseVx - p.vx) * 0.02
        p.vy += (p.baseVy - p.vy) * 0.02

        p.x += p.vx
        p.y += p.vy

        if (p.y < -20) {
          p.y = height + 20
          p.x = Math.random() * width
        }
        if (p.y > height + 40) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x < -40) p.x = width + 40
        if (p.x > width + 40) p.x = -40

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.font = `${p.size}px "JetBrains Mono", "Fira Code", monospace`
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fillText(p.text, p.x, p.y)
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden
    />
  )
}

export default ParticleBackground
