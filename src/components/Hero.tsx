import { useCallback, useRef, useState } from 'react';
import { ArrowRight, Cpu, Download, Gauge, Package, Sparkles, Zap } from 'lucide-react';
import { IMAGES } from '../assets/images';
import AnimatedNumber from './ui/AnimatedNumber';

function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(56);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-white/8 shadow-xl touch-none group"
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); update(e.clientX); }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={IMAGES.hero} alt="Vanilla" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" style={{ filter: 'saturate(0.6) contrast(0.85) brightness(1.05)' }} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={IMAGES.hero} alt="Vivid Lite" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" style={{ filter: 'saturate(1.3) contrast(1.1)' }} draggable={false} />
        <img src={IMAGES.hero} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light opacity-60" draggable={false} />
      </div>
      {/* divider with pulsing handle */}
      <div className="absolute inset-y-0 w-0.5 bg-white/80 transition-all" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="pointer-events-none absolute -inset-3 rounded-full border border-white/40 animate-[pulse-ring_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <div className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-night-900/80 text-white text-xs font-bold shadow-lg">⇔</div>
        </div>
      </div>
      <span className="absolute left-3 top-3 rounded-md bg-night-950/70 px-2 py-1 font-pixel text-[9px] text-amber-300">VIVID LITE</span>
      <span className="absolute right-3 top-3 rounded-md bg-night-950/70 px-2 py-1 font-pixel text-[9px] text-slate-300">VANILLA</span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-night-950/70 px-2.5 py-1 text-[10px] text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Kéo để so sánh ←→
      </span>
    </div>
  );
}

interface Stat { icon: typeof Gauge; value: number; label: string; suffix?: string; prefix?: string; decimals?: number; textValue?: string; }
const STATS: Stat[] = [
  { icon: Gauge, value: 2, prefix: '', suffix: '–25%', label: 'chi phí FPS thay vì 60–75% BSL' },
  { icon: Cpu, value: 0, textValue: 'Intel HD', label: 'chạy được đồ họa tích hợp cũ' },
  { icon: Package, value: 8, suffix: ' preset', label: 'từ Extra Potato đến Extra High' },
  { icon: Sparkles, value: 26.2, decimals: 1, label: 'Minecraft + Iris 1.11 (Fabric)' },
];

const TAGS = ['Bóng đổ mềm', 'Bloom nhẹ', 'Nước phản chiếu', 'Hoàng hôn BSL', 'Cỏ lá đung đưa', 'Tonemap sống động', 'Đêm xanh dịu', 'Đuốc ấm lung linh', 'Sương khí quyển', 'Sao đêm lấp lánh'];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
      {/* soft animated gradient blob (single, subtle, doesn't lag) */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-40 animate-float-slow"
        style={{ background: 'radial-gradient(closest-side, rgba(251,191,36,0.25), transparent 70%)' }} />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Minecraft 26.2 · Iris + Sodium
            </span>
            <span className="inline-flex animate-fade-up items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 [animation-delay:100ms]">
              <span>🎉</span> v1.0.1 · 7 preset · Extra Potato
            </span>
          </div>
          <h1 className="animate-fade-up mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            Đẹp như <span className="text-gradient">BSL</span>,
            <br />nhẹ như <span className="relative inline-block">Vanilla<span className="absolute -bottom-1 left-0 h-1 w-full origin-left animate-[bar_1.2s_cubic-bezier(0.16,1,0.3,1)_0.9s_both] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" /></span>.
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-lg text-slate-300 [animation-delay:180ms]">
            <strong className="text-white">Vivid Lite</strong> mang hoàng hôn cam rực, bóng đổ mềm, nước phản chiếu và bloom dịu của BSL — nhưng viết lại từ đầu để <strong className="text-white">chạy mượt trên máy yếu, kể cả siêu yếu</strong>. Không SSR, không volumetric, không TAA: chỉ giữ những gì tạo nên vẻ đẹp.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:280ms]">
            <a href="#builder" className="btn-primary"><Download className="h-5 w-5" /> Tùy chỉnh & tải .zip</a>
            <a href="#perf" className="btn-ghost group">Xem cách boost FPS <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {STATS.map((st, i) => (
              <div key={i} className="glass-sm animate-fade-up hover-lift p-3.5" style={{ animationDelay: `${380 + i * 80}ms` }}>
                <st.icon className="h-4 w-4 text-amber-300" />
                <dt className="mt-2 text-xl font-extrabold text-white">
                  {st.textValue ? st.textValue : <AnimatedNumber value={st.value} suffix={st.suffix ?? ''} prefix={st.prefix ?? ''} decimals={st.decimals ?? 0} />}
                </dt>
                <dd className="text-xs leading-snug text-slate-400">{st.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-scale-in [animation-delay:200ms]">
          <BeforeAfter />
          {/* Floating sparkle icons */}
          <span className="pointer-events-none absolute -top-3 -right-2 hidden text-amber-300 animate-float md:block">
            <Sparkles className="h-6 w-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </span>
          <span className="pointer-events-none absolute -bottom-2 -left-2 hidden text-sky-300 animate-float [animation-delay:1.5s] md:block">
            <Zap className="h-5 w-5 drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]" />
          </span>

          {/* Marquee of feature tags */}
          <div className="mt-4 marquee-fade overflow-hidden">
            <div className="marquee flex w-max gap-2 text-xs text-slate-400">
              {[...TAGS, ...TAGS].map((t, i) => (
                <span key={i} className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
