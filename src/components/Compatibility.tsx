import { Check, Cpu, Layers, Moon, Puzzle } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';
import { LOADER_META, VERSION_TARGETS, type LoaderId, type VersionTargetId } from '../shader/compat';

const NIGHT_FEATURES = [
  { title: 'Moonlight follows the phase', desc: 'Real directional moonlight that casts shadows. A full moon is ~3× brighter than a new moon (reads the moonPhase uniform).' },
  { title: '3 night tints', desc: 'Blue (BSL) · Teal · Purple — switch instantly in-game.' },
  { title: '2-layer stars + twinkle', desc: 'Sparse bright layer + dense faint layer, each star twinkles independently, with warm/cool color variation.' },
  { title: 'Milky Way band', desc: 'Faint band of stars across the sky with natural clumping — reuses existing hash, ~0 cost.' },
  { title: 'Moon glow halo', desc: 'Multi-layer halo around the moon, soft and photographic.' },
  { title: 'Night fog + Purkinje shift', desc: 'Cool blue haze at distance; dim scenes lose saturation and shift toward the night tint, just like human eyes in low light.' },
];

export default function Compatibility() {
  return (
    <section id="compat" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dot-bg" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">Compatibility</p>
          <h2 className="section-title mt-2">
            Minecraft <span className="text-gradient">1.8 → 26.3</span>, Iris <em className="not-italic text-slate-400">&</em> OptiFine
          </h2>
          <p className="mt-4 max-w-3xl text-slate-400">
            The web builder generates a pack tailored to your version: numeric block IDs for 1.8–1.12, manual shadow compare for old
            drivers, safe buffer formats, and a flat menu for legacy OptiFine.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(VERSION_TARGETS) as VersionTargetId[]).map((id, i) => {
            const vt = VERSION_TARGETS[id];
            return (
              <Reveal key={id} delay={i * 70} variant="scale" className="glass hover-lift gradient-border p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-400/10 text-sky-300 ring-1 ring-white/6">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="font-pixel text-[8px] uppercase text-slate-500">{id}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">{vt.label}</h3>
                <p className="mt-1 font-mono text-[10px] text-slate-500">{vt.range}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{vt.note}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {vt.numericBlockIds && <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] text-amber-200">numeric IDs</span>}
                  {vt.legacyShadow && <span className="rounded bg-rose-400/10 px-1.5 py-0.5 text-[9px] text-rose-200">manual shadow</span>}
                  {vt.legacyBuffers && <span className="rounded bg-violet-400/10 px-1.5 py-0.5 text-[9px] text-violet-200">RGB16</span>}
                  {!vt.legacyShadow && <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] text-emerald-200">hardware PCF</span>}
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {(Object.keys(LOADER_META) as LoaderId[]).map((id, i) => {
            const lm = LOADER_META[id];
            return (
              <Reveal key={id} delay={i * 90} className={cn('rounded-2xl border p-5 hover-lift',
                id === 'both' ? 'border-amber-400/25 bg-amber-400/[0.06]' : 'glass')}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lm.emoji}</span>
                  <h3 className="font-bold text-white">{lm.label}</h3>
                  {id === 'both' && <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-night-950">DEFAULT</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{lm.desc}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150} className="glass mt-6 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <Puzzle className="h-4 w-4 text-sky-300" /> What the compatibility layer does
          </h3>
          <div className="mt-3 grid gap-3 text-xs text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Block IDs', '1.8–1.12 has no namespaced IDs → generate block.properties with numeric IDs (31, 18, 8…).'],
              ['Shadow sampling', 'Old drivers don\'t trust sampler2DShadow → use sampler2D + step() manual compare.'],
              ['Buffer format', 'R11F_G11F_B10F isn\'t fully supported on old OptiFine → fall back to RGB16.'],
              ['Menu structure', 'OptiFine <1.13 has no screen.X with <empty> → flat single-level menu.'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
                <div className="font-semibold text-slate-200">{k}</div>
                <div className="mt-1 leading-snug">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300">
            <Check className="h-3.5 w-3.5" /> Every shader is written in <span className="font-mono">GLSL 120</span> — the common ground of OptiFine and Iris.
          </p>
        </Reveal>

        <div className="mt-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">Added in v1.1.0</p>
            <h2 className="section-title mt-2">
              Night, <span className="text-gradient">completely reworked</span> 🌙
            </h2>
            <p className="mt-4 max-w-3xl text-slate-400">
              Night is no longer "daytime but darker". Moonlight has a real direction and casts shadows, the sky has more depth, stars
              have multiple layers, and your eyes adapt to the dark like in real life.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NIGHT_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 60} variant="scale"
                className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5 hover-lift">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-400/15 text-indigo-200 ring-1 ring-white/6">
                  <Moon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-bold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <Cpu className="h-5 w-5 shrink-0 text-emerald-300" />
            <p className="flex-1 text-sm text-slate-300">
              <strong className="text-white">Almost all of it is free.</strong> The Milky Way and the second star layer reuse the existing
              <code className="mx-1 rounded bg-night-950/40 px-1 text-amber-200">hash13()</code> call — no texture, no extra pass. Total
              night cost is under <span className="font-mono text-emerald-300">1% FPS</span>.
            </p>
            <a href="#builder" className="btn-primary !px-4 !py-2 text-sm">Try it now 🌙</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
