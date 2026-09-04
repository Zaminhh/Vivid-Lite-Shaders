import { ArrowRight, Cpu, Gauge, Lightbulb, Minus, Shield } from 'lucide-react';
import { cn } from '../utils/cn';
import { BSL_FEATURES } from '../shader/estimate';
import Reveal from './ui/Reveal';
import AnimatedNumber from './ui/AnimatedNumber';
import { useReveal } from '../hooks/useReveal';

const PASS_DIAGRAM = [
  { name: 'gbuffers_terrain', color: 'bg-sky-400' },
  { name: 'gbuffers_water', color: 'bg-cyan-400' },
  { name: 'composite', color: 'bg-amber-400', opt: 'WATER_FOG' },
  { name: 'composite1', color: 'bg-rose-400', opt: 'BLOOM' },
  { name: 'final', color: 'bg-violet-400' },
];

const BSL_PASSES = [
  'gbuffer1','gbuffer2','gbuffer3','deferred1 (SSAO)','deferred2',
  'composite1','composite2 (SSR)','composite3 (bloom)','composite4 (bloom)',
  'composite5 (god rays)','composite6 (TAA)','final',
];

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const { ref, inView } = useReveal<HTMLDivElement>({ delay });
  return (
    <div ref={ref} className="h-2 overflow-hidden rounded-full bg-white/5">
      <div className={cn('bar-fill h-full', color, inView && 'in')} style={{ width: `${pct}%`, transitionDelay: `${delay}ms` }} />
    </div>
  );
}

export default function PerformanceExplainer() {
  const totalSaved = BSL_FEATURES.reduce((a, f) => a + f.costPct, 0);

  return (
    <section id="perf" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 dot-bg" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Performance</p>
          <h2 className="section-title mt-2">
            How Vivid Lite <span className="text-gradient-green">boosts FPS</span>
          </h2>
          <p className="mt-4 max-w-3xl text-slate-400">
            We don't just "drop features and call it optimized" — every expensive BSL effect is replaced by a cheaper technique that <em>looks the same to your eyes</em>.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: Shield, title: 'Minimal passes', color: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-400/20',
              body: 'Forward lighting = light computed inline while drawing geometry. No G-buffer extraction, no SSAO pass, no TAA resolve. 1–3 passes instead of 6–12.' },
            { icon: Lightbulb, title: 'Mipmap bloom', color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/20',
              body: 'BSL downsample 7 tiles manually → 7×270K pixels. We just sample mip levels 2 and 4 (GPU builds them for free). Only 2 tiles, no extra pass.' },
            { icon: Cpu, title: 'Passes you can turn off entirely', color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/20',
              body: 'Iris supports program.shadow.enabled and program.composite.enabled. When SHADOWS is off, Iris skips the shadow pass — CPU saves ~1M vertices/frame.' },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 100} variant="scale" className={cn('hover-lift rounded-2xl border p-6', s.bg)}>
              <s.icon className={cn('h-6 w-6', s.color)} />
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-bold text-white">Full-screen pass count</h3>
            <p className="mt-2 text-sm text-slate-400">Each pass reads + writes ~2 MB at 1080p. Fewer passes = less bandwidth = less GPU stall.</p>
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Reveal className="glass p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-bold text-rose-300">BSL v8 · Medium</h4>
                <span className="font-pixel text-lg text-rose-300"><AnimatedNumber value={12} /> passes</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {BSL_PASSES.map((n, i) => (
                  <Reveal key={n} delay={i * 40} variant="scale" className="flex items-center gap-1 rounded-md bg-rose-400/10 px-2 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span className="font-mono text-[10px] text-rose-200">{n}</span>
                  </Reveal>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Each pass scans ~2M pixels. Total: ~24 MB read/write.</p>
            </Reveal>
            <Reveal delay={200} className="glass p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-bold text-emerald-300">Vivid Lite · Medium</h4>
                <span className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={3} /> passes</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {PASS_DIAGRAM.map((p, i) => (
                  <Reveal key={p.name} delay={200 + i * 60} variant="scale" className={cn('flex items-center gap-1 rounded-md px-2 py-1', p.color.replace('400', '400/15'))}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', p.color)} />
                    <span className="font-mono text-[10px] text-slate-200">{p.name}</span>
                    {p.opt && <span className="text-[9px] text-slate-500">({p.opt})</span>}
                  </Reveal>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">composite + composite1 only run when WATER_FOG / BLOOM is enabled.</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-bold text-white">Replacing every expensive BSL effect</h3>
            <p className="mt-2 text-sm text-slate-400">Each row: BSL effect → Vivid Lite replacement → why it's cheaper.</p>
          </Reveal>

          <div className="glass mt-6 overflow-hidden">
            <div className="hidden grid-cols-[1fr_100px_1fr_1.5fr] gap-4 border-b border-white/8 bg-white/5 px-5 py-3 text-xs uppercase tracking-wider text-slate-500 md:grid">
              <div>BSL effect</div>
              <div className="text-center">FPS cost</div>
              <div>Replaced with</div>
              <div>Why it's cheaper</div>
            </div>
            {BSL_FEATURES.map((f, i) => (
              <Reveal key={f.name} delay={i * 60} className="grid gap-2 border-b border-white/5 px-5 py-4 last:border-b-0 hover:bg-white/[0.02] md:grid-cols-[1fr_100px_1fr_1.5fr] md:items-center md:gap-4">
                <div className="font-medium text-rose-200">{f.name}</div>
                <div className="flex items-center gap-2 md:justify-center">
                  <div className="flex-1 md:max-w-[70px]">
                    <AnimatedBar pct={Math.min(100, f.costPct * 4)} color="bg-gradient-to-r from-rose-500 to-rose-400" delay={i * 60} />
                  </div>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-400/10 px-2 py-0.5 font-mono text-xs text-rose-300">
                    <Minus className="h-3 w-3" />{f.costPct}%
                  </span>
                </div>
                <div className="text-emerald-200">→ {f.replacement}</div>
                <div className="text-xs text-slate-400">{f.whyCheap}</div>
              </Reveal>
            ))}
            <Reveal className="grid gap-2 bg-emerald-400/[0.03] px-5 py-4 md:grid-cols-[1fr_100px_2.5fr] md:items-center md:gap-4">
              <div className="font-bold text-slate-200">Total FPS saved</div>
              <div className="flex items-center justify-center">
                <span className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={totalSaved} suffix="%" /></span>
              </div>
              <div className="text-xs text-slate-500">of frame time vs BSL Medium (iGPU estimate)</div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="glass hover-lift p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Gauge className="h-5 w-5 text-amber-300" /> Shadow pass — why is it the most expensive?
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>The shadow pass re-renders <strong className="text-white">all terrain + entities</strong> within shadow distance, from the sun's POV.</p>
              <p>E.g. distance 96, render distance 10 chunks → ~150K block faces → close to <strong className="text-white">1M vertices</strong> per frame just for shadows.</p>
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-100/90">
                <strong className="text-amber-200">How Vivid Lite cuts it:</strong>
                <ul className="mt-1.5 ml-3 list-disc space-y-1">
                  <li>Distorted shadow map → concentrates resolution around the player → 768px is as sharp as 1536px uniform</li>
                  <li>Separate <code className="text-amber-200">shadowDistance</code> (48–128 block) — only render nearby entities</li>
                  <li>Disable <code className="text-amber-200">entityShadows</code> → CPU doesn't iterate mob list for shadow pass</li>
                  <li>Turn it off entirely → Iris skips the pass, CPU saves a million vertices</li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="glass hover-lift p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Cpu className="h-5 w-5 text-sky-300" /> Forward vs Deferred
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p><strong className="text-rose-200">Deferred (BSL):</strong> G-buffer → SSAO → re-light → SSR → TAA → bloom. 6–8 full-screen passes.</p>
              <p><strong className="text-emerald-200">Forward (Vivid Lite):</strong> Lighting computed inline while drawing geometry → bloom (if enabled) → final. 1–3 passes.</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-center">
                  <div className="font-pixel text-lg text-rose-300"><AnimatedNumber value={6} />–<AnimatedNumber value={8} /></div>
                  <div className="text-[10px] text-rose-200/70">passes (BSL)</div>
                </div>
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-center">
                  <div className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={1} />–<AnimatedNumber value={3} /></div>
                  <div className="text-[10px] text-emerald-200/70">passes (Vivid Lite)</div>
                </div>
              </div>
              <p className="text-xs text-slate-500">Downside of forward: no real SSAO or SSR. On weak hardware, a worthy trade.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#lag" className="btn-primary group">
            See low-level GLSL tricks <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#builder" className="btn-ghost">
            Try the builder
          </a>
        </Reveal>
      </div>
    </section>
  );
}
