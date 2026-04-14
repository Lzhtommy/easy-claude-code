import { SECTION_INTRO_HOOKS, SECTION_ONELINE, SECTIONS, SPAWN_MODES } from '../data/content'
import SectionShell from '../components/layout/SectionShell'
import { MultiAgentTopology } from '../components/viz/MultiAgentTopology'

const KIND_COLOR: Record<string, string> = {
  fork: '#00ffd1',
  remote: '#4bc7ff',
  'in-process': '#b14bff',
}

export default function MultiAgent() {
  const meta = SECTIONS.find((s) => s.id === 'multi-agent')!
  return (
    <SectionShell
      id="multi-agent"
      title={meta.title}
      subtitle={meta.subtitle}
      emoji={meta.emoji}
      accent={meta.accentColor}
      introHook={SECTION_INTRO_HOOKS['multi-agent']}
      summary={SECTION_ONELINE['multi-agent']}
    >
      {/* 拓扑图 */}
      <div className="rounded-md border border-cyber-border bg-cyber-panel/40 p-4">
        <MultiAgentTopology />
      </div>

      {/* 三模式对比卡 */}
      <div className="grid gap-3 md:grid-cols-3">
        {SPAWN_MODES.map((m) => {
          const color = KIND_COLOR[m.kind] ?? '#00ffd1'
          return (
            <div
              key={m.id}
              className="rounded-md border bg-cyber-panel/50 p-4"
              style={{ borderColor: `${color}55`, boxShadow: `0 0 10px ${color}22` }}
            >
              <div className="font-pixel text-sm" style={{ color }}>
                {m.name}
              </div>
              <div className="mt-1 font-mono text-xs text-cyber-dim">kind: {m.kind}</div>
              <p className="mt-2 text-sm text-cyber-text">{m.tagline}</p>
              <dl className="mt-2 space-y-0.5 font-mono text-xs text-cyber-dim">
                <div>
                  <span className="text-cyber-text">隔离：</span>
                  {m.isolation}
                </div>
                <div>
                  <span className="text-cyber-text">开销：</span>
                  {m.cost}
                </div>
                <div>
                  <span className="text-cyber-text">典型：</span>
                  {m.useCase}
                </div>
              </dl>
              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <div className="text-cyber-neon">+ pros</div>
                  <ul className="mt-1 space-y-0.5 text-cyber-text">
                    {m.pros.map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-cyber-pink">- cons</div>
                  <ul className="mt-1 space-y-0.5 text-cyber-text">
                    {m.cons.map((c) => (
                      <li key={c}>· {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
