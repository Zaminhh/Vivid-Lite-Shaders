import { CloudSun, Flame, Gauge, Leaf, Moon, Palette, Sparkles, Sun, Waves } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

const FEATURES = [
  { icon: Sun, title: 'Soft, crisp shadows', desc: 'Distorted shadow map concentrates resolution around the player + hardware PCF. 768px is already sharp; turning them off skips the entire shadow pass.', tag: 'Optional', cost: '4–20%' },
  { icon: Sparkles, title: 'Ultra-cheap bloom (2 mip tiles)', desc: 'Reads mip level 2 + 4 directly instead of BSL\'s 7 downsample passes. Soft halos around torches, sun and lava.', tag: '≈ 3% FPS', cost: '3%' },
  { icon: Waves, title: 'Sky-reflecting water', desc: 'Waves from 3 cosines (no texture), Fresnel reflection of the sky + sun glints. No expensive SSR.', tag: 'No SSR', cost: '< 1%' },
  { icon: CloudSun, title: 'BSL-style sky & sunset', desc: 'Procedural gradient by time of day: blue midday, pink/orange sunset, matching horizon haze, round sun, twinkling stars.', tag: 'Procedural', cost: '0%' },
  { icon: Palette, title: 'Vivid tonemap & color', desc: 'BSL-style curve + saturation + vibrance + contrast + color temp + vignette + dithering — all in the final pass.', tag: '1 pass', cost: '< 1%' },
  { icon: Flame, title: 'Warm torches & emissives', desc: 'Warm torch light, glowing blocks (torches, glowstone, lava, lanterns…) self-illuminate + bloom. Optional hand-held light and flicker.', tag: 'Emissive', cost: '0%' },
  { icon: Leaf, title: 'Waving grass, flowers & leaves', desc: 'Wind animation in the vertex shader — nearly free. Stronger wind in the rain. Shadows follow the motion.', tag: 'Vertex', cost: '< 1%' },
  { icon: Moon, title: 'Night, rain, Nether, End', desc: 'Cool blue night with desaturation, gray rain, biome-tinted Nether, purple End. Nether/End skip the shadow pass.', tag: 'Complete', cost: '0%' },
  { icon: Gauge, title: 'Forward 1–3 pass (BSL: 6–12)', desc: 'Lighting computed inline in the gbuffers like BSL, but no deferred/SSAO/volumetric/TAA/motion blur. At most 3 full-screen passes.', tag: 'FPS', cost: '-70%*' },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Features</p>
          <h2 className="section-title mt-2">Keep the beauty, drop the weight</h2>
          <p className="mt-4 text-slate-400">BSL is beautiful because of its color palette, lighting and sky — not because of heavy GPU effects. Vivid Lite recreates exactly that, with the cheapest techniques available.</p>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} as="article" delay={i * 60} variant="scale" className="glass-sm gradient-border hover-lift group relative overflow-hidden p-5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-white/6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full border border-white/8 px-2 py-0.5 font-pixel text-[7px] text-slate-400">{f.tag}</span>
                  <span className={cn('font-mono text-[10px]', f.cost.startsWith('-') || f.cost === '0%' || f.cost === '< 1%' ? 'text-emerald-300' : 'text-amber-200')}>{f.cost}</span>
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">* Compared to BSL v8 Medium on an iGPU. "0%" = negligible cost compared to the base pipeline.</p>
      </div>
    </section>
  );
}
