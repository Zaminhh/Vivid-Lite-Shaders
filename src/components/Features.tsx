import { CloudSun, Flame, Gauge, Leaf, Moon, Palette, Sparkles, Sun, Waves } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

const FEATURES = [
  { icon: Sun, title: 'Bóng đổ mềm, không răng cưa', desc: 'Shadow map méo dồn resolution quanh người chơi + PCF phần cứng. 768px đã đẹp, tắt hẳn = shadow pass skip hoàn toàn.', tag: 'Tùy chọn', cost: '4–20%' },
  { icon: Sparkles, title: 'Bloom siêu rẻ (2 tile mipmap)', desc: 'Đọc thẳng từ mip level 2+4 thay vì downsample thủ công 7 tile như BSL. Quầng sáng mềm quanh đuốc, mặt trời, lava.', tag: '≈ 3% FPS', cost: '3%' },
  { icon: Waves, title: 'Nước phản chiếu bầu trời', desc: 'Sóng tính bằng 3 cos (không texture), Fresnel, phản chiếu sky + vệt nắng lấp lánh. Không SSR đắt đỏ.', tag: 'Không SSR', cost: '< 1%' },
  { icon: CloudSun, title: 'Bầu trời & hoàng hôn kiểu BSL', desc: 'Gradient thủ tục theo giờ: xanh trưa, cam hồng hoàng hôn, sương cùng màu chân trời. Mặt trời tròn, sao đêm lấp lánh.', tag: 'Thủ tục', cost: '0%' },
  { icon: Palette, title: 'Tonemap & màu sống động', desc: 'Đường cong kiểu BSL, saturation + vibrance + contrast + color temp + vignette + dithering — tất cả trong 1 pass final.', tag: '1 pass', cost: '< 1%' },
  { icon: Flame, title: 'Đuốc ấm, block phát sáng', desc: 'Ánh đuốc cam ấm, block phát sáng (đuốc, glowstone, lava, đèn lồng…) tự sáng + bloom. Đèn cầm tay. Lung linh nếu bật.', tag: 'Emissive', cost: '0%' },
  { icon: Leaf, title: 'Cỏ, hoa, lá đung đưa', desc: 'Hoạt ảnh gió trong vertex shader — gần như miễn phí. Gió mạnh hơn khi mưa. Bóng đổ cũng đung đưa theo.', tag: 'Vertex', cost: '< 1%' },
  { icon: Moon, title: 'Đêm, mưa, Nether, End', desc: 'Đêm xanh lam + giảm màu, mưa xám, Nether đỏ theo biome, End tím. Không shadow pass ở Nether/End = thêm FPS.', tag: 'Đầy đủ', cost: '0%' },
  { icon: Gauge, title: 'Forward 1–3 pass (BSL: 6–12)', desc: 'Ánh sáng tính ngay trong gbuffers như BSL, nhưng bỏ deferred/SSAO/volumetric/TAA/motion blur. Tối đa 3 pass toàn màn hình.', tag: 'FPS', cost: '-70%*' },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Tính năng</p>
          <h2 className="section-title mt-2">Giữ cái đẹp, bỏ cái nặng</h2>
          <p className="mt-4 max-w-2xl text-slate-400">BSL đẹp vì màu sắc, ánh sáng và bầu trời — không phải vì những hiệu ứng ngốn GPU. Vivid Lite tái tạo đúng những phần đó bằng kỹ thuật rẻ nhất.</p>
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
        <p className="mt-4 text-xs text-slate-500">* So với BSL v8 Medium trên iGPU. "0%" = chi phí không đáng kể so với base pipeline.</p>
      </div>
    </section>
  );
}
