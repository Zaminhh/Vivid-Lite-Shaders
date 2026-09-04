import { Check, Minus, X } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

type Cell = { ok: boolean | 'partial'; note?: string };

const ROWS: { feature: string; bsl: Cell; lite: Cell }[] = [
  { feature: 'Bóng đổ mềm', bsl: { ok: true, note: '2048px+' }, lite: { ok: true, note: '512–2048px, tắt được' } },
  { feature: 'Bloom', bsl: { ok: true, note: '7 tile' }, lite: { ok: true, note: '2 tile mipmap' } },
  { feature: 'Hoàng hôn cam, bầu trời, sương', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Nước phản chiếu', bsl: { ok: true, note: 'SSR' }, lite: { ok: 'partial', note: 'Sky + specular' } },
  { feature: 'Sương nước theo độ sâu', bsl: { ok: true }, lite: { ok: true, note: 'tùy chọn' } },
  { feature: 'Cỏ / lá đung đưa', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Đuốc ấm, emissive, đèn cầm tay', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Tonemap, saturation, vibrance, vignette', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Nether & End', bsl: { ok: true }, lite: { ok: true, note: 'no shadow pass' } },
  { feature: 'SSR', bsl: { ok: true }, lite: { ok: false, note: 'cố ý bỏ' } },
  { feature: 'Volumetric light', bsl: { ok: true }, lite: { ok: false, note: 'cố ý bỏ' } },
  { feature: 'SSAO / TAA / Motion blur', bsl: { ok: true }, lite: { ok: false, note: 'cố ý bỏ' } },
  { feature: 'Pass toàn màn hình', bsl: { ok: 'partial', note: '6–12' }, lite: { ok: true, note: '1–3' } },
];

function Mark({ cell }: { cell: Cell }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs',
        cell.ok === true && 'bg-emerald-400/10 text-emerald-300',
        cell.ok === 'partial' && 'bg-amber-400/10 text-amber-300',
        cell.ok === false && 'bg-rose-400/10 text-rose-300')}>
        {cell.ok === true ? <Check className="h-3 w-3" /> : cell.ok === 'partial' ? <Minus className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      {cell.note && <span className="text-[11px] text-slate-500">{cell.note}</span>}
    </div>
  );
}

export default function Compare() {
  return (
    <section id="compare" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">So sánh</p>
          <h2 className="section-title mt-2">Vivid Lite vs BSL v8</h2>
          <p className="mt-4 text-slate-400">Không phải bản sao — là bản thiết kế lại cùng gu thẩm mỹ. Những hiệu ứng bị bỏ đều tốn 10–40% FPS mỗi cái trên iGPU. <a href="#perf" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">Xem chi tiết cách thay thế →</a></p>
        </Reveal>
        <Reveal delay={100} className="glass mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Tính năng</th>
                  <th className="px-5 py-2.5 font-semibold">BSL v8</th>
                  <th className="px-5 py-2.5 font-semibold text-amber-300">Vivid Lite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ROWS.map((r) => (
                  <tr key={r.feature} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5 text-slate-200">{r.feature}</td>
                    <td className="px-5 py-2.5"><Mark cell={r.bsl} /></td>
                    <td className="px-5 py-2.5"><Mark cell={r.lite} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
