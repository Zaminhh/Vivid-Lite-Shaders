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
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Hiệu năng</p>
          <h2 className="section-title mt-2">
            Vivid Lite <span className="text-gradient-green">boost FPS</span> thế nào?
          </h2>
          <p className="mt-4 max-w-3xl text-slate-400">
            Không phải "bớt hiệu ứng rồi gọi là tối ưu". Mỗi hiệu ứng đắt của BSL được thay bằng một kỹ thuật rẻ hơn nhưng vẫn cho kết quả <em>tương tự về cảm nhận</em>.
          </p>
        </Reveal>

        {/* 3 strategies */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: Shield, title: 'Pass tối thiểu', color: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-400/20',
              body: 'Forward lighting = ánh sáng tính ngay lúc vẽ geometry. Không G-buffer extraction, không SSAO pass, không TAA resolve. 1–3 pass thay vì 6–12.' },
            { icon: Lightbulb, title: 'Bloom mipmap', color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/20',
              body: 'BSL downsample thủ công 7 tile → 7×270K pixel. Ta đọc thẳng từ mip level 2 và 4 (GPU tạo tự động). Chỉ 2 tile, không cần downsample pass.' },
            { icon: Cpu, title: 'Shadow tắt hoàn toàn', color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/20',
              body: 'Iris hỗ trợ program.shadow.enabled. Khi tắt SHADOWS, Iris skip pass. CPU bớt cả triệu vertex. Tương tự với WATER_FOG/BLOOM.' },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 100} variant="scale" className={cn('hover-lift rounded-2xl border p-6', s.bg)}>
              <s.icon className={cn('h-6 w-6', s.color)} />
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
            </Reveal>
          ))}
        </div>

        {/* Pass count comparison */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-bold text-white">Số pass toàn màn hình</h3>
            <p className="mt-2 text-sm text-slate-400">Mỗi pass đọc + ghi ~2 MB (1080p). Ít pass = ít bandwidth = ít stall GPU.</p>
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Reveal className="glass p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-bold text-rose-300">BSL v8 · Medium</h4>
                <span className="font-pixel text-lg text-rose-300"><AnimatedNumber value={12} /> pass</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {BSL_PASSES.map((n, i) => (
                  <Reveal key={n} delay={i * 40} variant="scale" className="flex items-center gap-1 rounded-md bg-rose-400/10 px-2 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span className="font-mono text-[10px] text-rose-200">{n}</span>
                  </Reveal>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Mỗi pass = 1 lần duyệt ~2 triệu pixel. Tổng: ~24 MB đọc/ghi.</p>
            </Reveal>
            <Reveal delay={200} className="glass p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-bold text-emerald-300">Vivid Lite · Trung bình</h4>
                <span className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={3} /> pass</span>
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
              <p className="mt-3 text-xs text-slate-500">composite + composite1 chỉ chạy khi WATER_FOG / BLOOM bật.</p>
            </Reveal>
          </div>
        </div>

        {/* Feature-by-feature table with animated bars */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-bold text-white">Thay thế từng hiệu ứng đắt của BSL</h3>
            <p className="mt-2 text-sm text-slate-400">Mỗi hàng: cái BSL dùng → cái Vivid Lite thay → tại sao rẻ hơn.</p>
          </Reveal>

          <div className="glass mt-6 overflow-hidden">
            <div className="hidden grid-cols-[1fr_100px_1fr_1.5fr] gap-4 border-b border-white/8 bg-white/5 px-5 py-3 text-xs uppercase tracking-wider text-slate-500 md:grid">
              <div>Hiệu ứng BSL</div>
              <div className="text-center">FPS cost</div>
              <div>Thay bằng</div>
              <div>Tại sao rẻ hơn?</div>
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
              <div className="font-bold text-slate-200">Tổng FPS tiết kiệm</div>
              <div className="flex items-center justify-center">
                <span className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={totalSaved} suffix="%" /></span>
              </div>
              <div className="text-xs text-slate-500">frame time so với BSL Medium (ước tính iGPU)</div>
            </Reveal>
          </div>
        </div>

        {/* Shadow + forward vs deferred */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="glass hover-lift p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Gauge className="h-5 w-5 text-amber-300" /> Shadow pass — tại sao tốn nhất?
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Shadow pass render lại <strong className="text-white">toàn bộ terrain + entity</strong> trong tầm xa bóng đổ, từ góc nhìn mặt trời.</p>
              <p>VD: tầm xa 96 block, render distance 10 chunk → phải vẽ lại ~150K block face → <strong className="text-white">gần 1 triệu vertex</strong> chỉ riêng shadow pass.</p>
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-100/90">
                <strong className="text-amber-200">Cách Vivid Lite giảm:</strong>
                <ul className="mt-1.5 ml-3 list-disc space-y-1">
                  <li>Shadow map "méo" → dồn resolution quanh player → 768px vẫn sắc</li>
                  <li><code className="text-amber-200">shadowDistance</code> riêng (48–128 block)</li>
                  <li>Tắt <code className="text-amber-200">entityShadows</code> → CPU không phải iterate mob list</li>
                  <li>Tắt hoàn toàn → Iris skip pass, CPU bớt cả triệu vertex</li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="glass hover-lift p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Cpu className="h-5 w-5 text-sky-300" /> Forward vs Deferred
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p><strong className="text-rose-200">Deferred (BSL):</strong> G-buffer → SSAO → re-light → SSR → TAA → bloom. 6–8 pass toàn màn hình.</p>
              <p><strong className="text-emerald-200">Forward (Vivid Lite):</strong> Ánh sáng tính ngay lúc vẽ geometry → bloom (nếu bật) → final. 1–3 pass.</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-center">
                  <div className="font-pixel text-lg text-rose-300"><AnimatedNumber value={6} />–<AnimatedNumber value={8} /></div>
                  <div className="text-[10px] text-rose-200/70">pass (BSL)</div>
                </div>
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-center">
                  <div className="font-pixel text-lg text-emerald-300"><AnimatedNumber value={1} />–<AnimatedNumber value={3} /></div>
                  <div className="text-[10px] text-emerald-200/70">pass (Vivid Lite)</div>
                </div>
              </div>
              <p className="text-xs text-slate-500">Nhược điểm forward: không SSAO thật hay SSR thật. Trên máy yếu, đổi lấy xứng đáng.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-10 flex justify-center">
          <a href="#builder" className="btn-primary group">
            Tùy chỉnh shader cho máy của bạn <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
