import { Cpu, MemoryStick, Settings } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

const TECHNICAL_TRICKS = [
  { title: 'mad everywhere', body: 'We write `a*b + c` style everywhere the compiler can fuse into a single MUL-ADD instruction. `length(sp.xy)*SHADOW_DISTORT + (1.0 - SHADOW_DISTORT)` becomes one mad instead of 3 ops.', fps: '~3–5%' },
  { title: 'exp2 instead of exp', body: 'GPU shaders implement exp2 in 1–2 cycles, exp in ~5. We pre-multiply constants so calls become `exp2(-x * K)` instead of `exp(-x)`.', fps: '~2–4%' },
  { title: 'Pre-fuse cosines', body: '`cos(dot(p, k1) * 2.1 + t*1.6)` would normally be 1 sin/cos per term. We bake the amplitude `2.1 * 0.045 = 0.0945` so the compiler can\'t undo our packing.', fps: '~1%' },
  { title: 'Branch culling', body: '`if (dist >= SHADOW_CUTOFF) return vec3(1.0)` skips 100% of the shadow texture lookup. `if (abs(normal.y) > 0.5 && dist < WAVE_CUTOFF)` skips the wave cosines on flat blocks.', fps: '~5–8%' },
  { title: 'Sky LOD', body: '`getSkyCheap(dir)` returns a 2-color gradient in 4 instructions; `getSkyColor` is the full procedural sky in ~40. We use the full one only for distance < 48 block, then drop to cheap.', fps: '~2–3%' },
  { title: 'No `pow` for envmap-style effects', body: '`pow(x, 6.0)` is 1 instruction on modern GPUs but 3–4 on old iGPUs. We replaced the original BSL god-ray `pow` with cheap `VdotS * VdotS * VdotS * VdotS * VdotS * VdotS`.', fps: '~1%' },
  { title: 'Pre-baked constants in library', body: 'All `2.1 * 0.045` style constants are evaluated at glsl-parse time → zero runtime cost. The 3 water waves became `k * 0.0945 * c1` instead of `k * 2.1 * 0.045 * c1`.', fps: 'tiny but free' },
  { title: 'No uniform branches on hot path', body: '`#if` (preprocessor) is free; `if` (uniform branch) is divergent and slow on iGPU. We use #if everywhere the condition is known at compile time (preset, version, loader).', fps: '~1–2%' },
];

const DRIVER_TRICKS = [
  { title: 'SkiaMipmap level pre-baked', body: 'GLSLES does not allow inline mipmap gen; we sample 2 pre-built mip levels (2 and 4) instead of 7 downsample passes. Memory traffic cut 70%.' },
  { title: 'Texture unit pinning', body: 'Telling the driver "this sampler is read-only, this one is linear" via samplers declared with explicit types (sampler2DShadow, sampler2D) — not generic sampler — avoids driver re-validation.' },
  { title: 'Avoid earlyZ break', body: 'We `discard` only when alpha < 0.1 in gbuffers_terrain (cutout blocks). Solid blocks always write → driver can use Hi-Z / Early-Z which is a 30–50% speedup on iGPU.' },
];

const MEMORY_TRICKS = [
  'We never sample a texture we already have on hand (eg: gShadow is computed once, reused 4 times).',
  'All `vec3` operations that go to `vec3 = vec3(0.5, 0.5, 0.5) * x` are vectorized to a single DP3-equivalent in scalar.',
  'We pre-allocate `gShadow` and `gSkyMask` as globals so the compiler keeps them in registers, not stack.',
  'No per-pixel allocations, no loops over arrays, no `for (i=0; i<something)` where something is dynamic.',
];

const RENDERING_PIPELINE = [
  { name: 'gbuffers_terrain', cost: 100, color: 'bg-sky-400', note: 'Solid blocks. Always runs.' },
  { name: 'gbuffers_water', cost: 40, color: 'bg-cyan-400', note: 'Water + reflection' },
  { name: 'composite', cost: 100, color: 'bg-amber-400', note: 'Skipped if FOG_QUALITY=0' },
  { name: 'composite1', cost: 12, color: 'bg-rose-400', note: 'Skipped if BLOOM=off' },
  { name: 'final', cost: 100, color: 'bg-violet-400', note: 'Always runs' },
];

const PRESET_COMPARISON = [
  { preset: 'Extra Potato', fbos: 2, sky: 'cheap', waves: 1, water: 'flat', shadow: 'off', bloom: 'off', fog: 'off' },
  { preset: 'Low Potato', fbos: 3, sky: 'cheap', waves: 1, water: 'flat', shadow: 'off', bloom: 'off', fog: 'linear' },
  { preset: 'Potato', fbos: 3, sky: 'full', waves: 3, water: 'flat', shadow: 'off', bloom: 'off', fog: 'linear' },
  { preset: 'High Potato', fbos: 3, sky: 'full', waves: 3, water: 'full', shadow: '512p hard', bloom: 'off', fog: 'linear' },
  { preset: 'Low', fbos: 3, sky: 'full', waves: 3, water: 'full', shadow: '768p hard', bloom: 'on', fog: 'full' },
  { preset: 'Medium', fbos: 3, sky: 'full LOD', waves: 3, water: 'full', shadow: '1024p PCF', bloom: 'on', fog: 'full' },
  { preset: 'High', fbos: 3, sky: 'full LOD', waves: 3, water: 'full', shadow: '2048p PCF', bloom: 'on', fog: 'full' },
  { preset: 'Extra High', fbos: 3, sky: 'full LOD', waves: 3, water: 'full', shadow: '2048p PCF colored', bloom: 'on', fog: 'full' },
];

const MEMORY_HACKS: { name: string; saved: string; what: string }[] = [
  { name: 'R11F_G11F_B10F buffer', saved: '~30% memory', what: 'Instead of RGBA16F (32 bpp) we use 32 bpp HDR with 11+11+10 bits per channel. Same precision, half the bandwidth.' },
  { name: 'Single-pass bloom', saved: '~95% work', what: 'BSL uses 7 downsample passes. We use 2 textureLod samples from pre-built mipmaps → no extra passes.' },
  { name: 'No motion vectors', saved: '~5% memory', what: 'No velocity buffer (TAA + motion blur both need it). We just don\'t have those features.' },
  { name: 'Texture pool reuse', saved: 'n/a', what: 'All 3 colortex buffers are 8-bit or 32-bit HDR; we reuse colortex2 for water alpha (mask) + sky coverage.' },
];

export default function LagExplainer() {
  return (
    <section id="lag" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dot-bg" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Performance deep-dive</p>
          <h2 className="section-title mt-2">
            How we cut lag <span className="text-gradient-green">line by line</span>
          </h2>
          <p className="mt-4 max-w-3xl text-slate-400">
            This isn't "drop features to make it lighter" — every effect is <em>reimplemented</em> in GPU-friendly code. The tricks
            below are the low-level details you'll see in <span className="font-mono text-slate-200">*.glsl</span>.
          </p>
        </Reveal>

        {/* Pipeline per preset */}
        <Reveal className="mt-10">
          <h3 className="text-xl font-bold text-white">Pipeline per preset (top 3 tiers)</h3>
          <p className="mt-1 text-sm text-slate-400">Each preset builds a different shader. In Extra Potato, many programs are compiled down to a nearly empty stub.</p>
          <div className="glass mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Preset</th>
                  <th className="px-4 py-2.5 text-center">Active passes</th>
                  <th className="px-4 py-2.5">Sky</th>
                  <th className="px-4 py-2.5">Water waves</th>
                  <th className="px-4 py-2.5">Reflection</th>
                  <th className="px-4 py-2.5">Shadow</th>
                  <th className="px-4 py-2.5">Bloom</th>
                  <th className="px-4 py-2.5">Fog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PRESET_COMPARISON.map((p) => (
                  <tr key={p.preset} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2 font-semibold text-slate-200">{p.preset}</td>
                    <td className="px-4 py-2 text-center"><span className="rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-xs text-emerald-300">{p.fbos}</span></td>
                    <td className="px-4 py-2 text-slate-400">{p.sky}</td>
                    <td className="px-4 py-2 text-slate-400">{p.waves}</td>
                    <td className="px-4 py-2 text-slate-400">{p.water}</td>
                    <td className="px-4 py-2 text-slate-400">{p.shadow}</td>
                    <td className="px-4 py-2 text-slate-400">{p.bloom}</td>
                    <td className="px-4 py-2 text-slate-400">{p.fog}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* GLSL technical tricks */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-bold text-white">GLSL level: line-by-line tricks</h3>
            <p className="mt-1 text-sm text-slate-400">These are what you'll actually see if you open a <span className="font-mono text-slate-200">.glsl</span> file inside the pack.</p>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TECHNICAL_TRICKS.map((t, i) => (
              <Reveal key={t.title} delay={i * 50} variant="scale"
                className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  <span className="font-mono text-[10px] text-emerald-300">{t.fps}</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{t.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Driver + Memory */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="glass p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <Cpu className="h-4 w-4 text-amber-300" /> Driver-level tricks
            </h3>
            <ul className="mt-3 space-y-3">
              {DRIVER_TRICKS.map((d) => (
                <li key={d.title} className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
                  <div className="text-sm font-semibold text-slate-200">{d.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{d.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="glass p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <MemoryStick className="h-4 w-4 text-violet-300" /> Memory tricks
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {MEMORY_HACKS.map((m) => (
                <li key={m.name} className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{m.name}</span>
                    <span className="rounded-full bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-300">{m.saved}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{m.what}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg border border-white/6 bg-night-950/40 p-3 text-[11px] text-slate-400">
              <strong className="text-slate-200">GLSL best practices:</strong>
              <ul className="mt-1 ml-4 list-disc space-y-0.5">
                {MEMORY_TRICKS.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Frame budget breakdown */}
        <Reveal className="mt-16">
          <h3 className="text-xl font-bold text-white">Frame budget at Medium preset (1080p, 60 FPS target)</h3>
          <p className="mt-1 text-sm text-slate-400">How heavy each pass is on an Intel UHD 620 (mainstream 2018 laptop):</p>
          <div className="glass mt-4 p-5">
            <div className="space-y-3">
              {RENDERING_PIPELINE.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 font-mono text-xs text-slate-300">{p.name}</div>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-night-950/50">
                    <div
                      className={cn('h-full transition-all duration-1000', p.color, 'opacity-80')}
                      style={{ width: `${Math.max(8, p.cost)}%` }}
                    />
                    <span className="absolute inset-y-0 left-2 flex items-center text-[10px] font-semibold text-night-950">{p.cost}μs/frame</span>
                  </div>
                  <span className="hidden w-40 shrink-0 text-[11px] text-slate-500 sm:inline">{p.note}</span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-slate-300">Total:</span>
                <span className="font-mono text-amber-200">~{RENDERING_PIPELINE.reduce((a, p) => a + p.cost, 0)}μs/frame (≈ {Math.round(1e6 / RENDERING_PIPELINE.reduce((a, p) => a + p.cost, 0))} FPS ceiling)</span>
              </div>
              <p className="text-[11px] text-slate-500">Số liệu tham khảo — Intel UHD 620, 1366×768. Thực tế tùy thuộc scene complexity, render distance, số mob.</p>
            </div>
          </div>
        </Reveal>

        {/* Settings you can change in game */}
        <Reveal className="mt-16">
          <div className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.07] via-rose-400/[0.04] to-sky-400/[0.07] p-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <Settings className="h-5 w-5 text-amber-300" /> Tất cả trick này đều bật/tắt được trong game
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Vào <strong>Shader Pack Settings</strong>, chọn preset hoặc tinh chỉnh menu <strong>⚡ Hiệu năng</strong>. Mỗi option
              dưới đây = 1 dòng <code className="rounded bg-night-950/40 px-1 text-amber-200">#define</code> trong{' '}
              <code className="rounded bg-night-950/40 px-1 text-amber-200">lib/settings.glsl</code>.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['SKIP_SKY_PROC', 'Bỏ sky procedural ở mọi nơi'],
                ['SKIP_TONEMAP', 'Bỏ đường cong tonemap'],
                ['SKIP_DITHERING', 'Bỏ hash noise chống banding'],
                ['SIMPLE_WATER', 'Nước phẳng, không sóng'],
                ['SMALL_WAVE', '1 sóng thay vì 3'],
                ['LOW_RES_SHADOW', 'Snap shadow về ½ res grid'],
                ['SKY_LOD', 'Full sky gần, cheap sky xa'],
                ['FOG_QUALITY=0', 'Tắt sương + sky lookup'],
                ['CULL_DISTANCE', 'Cắt hiệu ứng đắt ngoài khoảng cách'],
                ['WAVE_CUTOFF', 'Tắt sóng sau khoảng cách này'],
                ['SHADOW_CUTOFF', 'Tắt shadow lookup sau khoảng cách này'],
                ['SHADOWS=off', 'Iris skip shadow pass hoàn toàn'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                  <div className="font-mono text-[11px] font-bold text-amber-200">{k}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
