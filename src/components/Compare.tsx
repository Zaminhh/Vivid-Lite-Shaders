import { Check, Minus, X } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

type Cell = { ok: boolean | 'partial'; note?: string };

const ROWS: { feature: string; bsl: Cell; lite: Cell }[] = [
  { feature: 'Soft shadows', bsl: { ok: true, note: '2048px+' }, lite: { ok: true, note: '512–2048px, toggleable' } },
  { feature: 'Bloom', bsl: { ok: true, note: '7 tiles' }, lite: { ok: true, note: '2 mip tiles' } },
  { feature: 'Orange sunset, blue sky, haze', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Water reflection', bsl: { ok: true, note: 'SSR' }, lite: { ok: 'partial', note: 'Sky + specular' } },
  { feature: 'Water depth fog', bsl: { ok: true }, lite: { ok: true, note: 'toggleable' } },
  { feature: 'Waving grass & leaves', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Warm torches, emissives, hand light', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Tonemap, saturation, vibrance, vignette', bsl: { ok: true }, lite: { ok: true } },
  { feature: 'Nether & End', bsl: { ok: true }, lite: { ok: true, note: 'no shadow pass' } },
  { feature: 'Night with moon phases, Milky Way', bsl: { ok: 'partial', note: 'basic' }, lite: { ok: true, note: 'full rework' } },
  { feature: 'SSR', bsl: { ok: true }, lite: { ok: false, note: 'intentionally cut' } },
  { feature: 'Volumetric light', bsl: { ok: true }, lite: { ok: false, note: 'intentionally cut' } },
  { feature: 'SSAO / TAA / Motion blur', bsl: { ok: true }, lite: { ok: false, note: 'intentionally cut' } },
  { feature: 'Full-screen passes', bsl: { ok: 'partial', note: '6–12' }, lite: { ok: true, note: '1–3' } },
  { feature: 'Minecraft version support', bsl: { ok: 'partial', note: '1.16+' }, lite: { ok: true, note: '1.8 – 26.3' } },
  { feature: 'OptiFine support', bsl: { ok: true }, lite: { ok: true, note: 'Iris + OptiFine' } },
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
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Compare</p>
          <h2 className="section-title mt-2">Vivid Lite vs BSL v8</h2>
          <p className="mt-4 text-slate-400">Not a clone — a redesign with the same visual taste. The things we cut each cost 10–40% FPS on iGPU. <a href="#perf" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">See how they're replaced →</a></p>
        </Reveal>
        <Reveal delay={100} className="glass mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Feature</th>
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
