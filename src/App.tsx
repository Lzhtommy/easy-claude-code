import { lazy, Suspense } from 'react'
import { Nav } from './components/layout/Nav'
import { Hero } from './sections/Hero'
import { ParticleBackground } from './components/fx/ParticleBackground'

const LeakTimeline = lazy(() => import('./sections/LeakTimeline'))
const Architecture = lazy(() => import('./sections/Architecture'))
const AgentLoop = lazy(() => import('./sections/AgentLoop'))
const ToolExplorer = lazy(() => import('./sections/ToolExplorer'))
const PermissionGame = lazy(() => import('./sections/PermissionGame'))
const MemorySystem = lazy(() => import('./sections/MemorySystem'))
const MultiAgent = lazy(() => import('./sections/MultiAgent'))
const BuddyGacha = lazy(() => import('./sections/BuddyGacha'))
const Hidden = lazy(() => import('./sections/Hidden'))
const Footer = lazy(() => import('./sections/Footer'))

const Fallback = () => (
  <div className="py-20 text-center text-cyber-dim font-mono text-sm">
    <span className="caret">loading</span>
  </div>
)

export default function App() {
  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text">
      <ParticleBackground />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Suspense fallback={<Fallback />}>
          <LeakTimeline />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <Architecture />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <AgentLoop />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <ToolExplorer />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <PermissionGame />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <MemorySystem />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <MultiAgent />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <BuddyGacha />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <Hidden />
        </Suspense>
        <Suspense fallback={<Fallback />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}
