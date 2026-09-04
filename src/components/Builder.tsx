import { lazy, useMemo, useState } from 'react';
import { Check, ChevronRight, Download, FileArchive, Loader2, Moon, RotateCcw, Sun, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { OPTION_VALUES, PRESETS, PRESET_META, detectPreset, type PresetId, type ShaderSettings } from '../shader/settings';
import { buildPackFiles, downloadPack, packFileName, packSizeBytes } from '../shader/pack';
import { MACHINES, estimateCost } from '../shader/estimate';
import { IMAGES } from '../assets/images';
import Reveal from './ui/Reveal';
import AnimatedNumber from './ui/AnimatedNumber';

const CodeViewer = lazy(() => import('./CodeViewer'));

function Toggle({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-center justify-between gap-4 py-2', disabled && 'opacity-40 pointer-events-none')}>
      <span>
        <span className="block text-sm font-medium text-slate-100">{label}</span>
        {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
      </span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-white/10')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </button>
    </label>
  );
}

function Choice<T extends string | number>({ label, value, options, onChange, disabled }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; disabled?: boolean }) {
  return (
    <div className={cn('py-2', disabled && 'opacity-40 pointer-events-none')}>
      <span className="block text-sm font-medium text-slate-100">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
            className={cn('rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors',
              o.value === value ? 'border-amber-400/50 bg-amber-400/15 text-amber-200' : 'border-white/8 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]')}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Slider({ label, value, values, onChange, format, disabled, hint }: { label: string; value: number; values: readonly number[]; onChange: (v: number) => void; format?: (v: number) => string; disabled?: boolean; hint?: string }) {
  const idx = Math.max(0, values.findIndex((v) => Math.abs(v - value) < 1e-6));
  const fmt = format ?? String;
  return (
    <div className={cn('py-2', disabled && 'opacity-40 pointer-events-none')}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-100">{label}</span>
        <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-amber-200">{fmt(value)}</span>
      </div>
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      <input type="range" min={0} max={values.length - 1} step={1} value={idx} onChange={(e) => onChange(values[Number(e.target.value)])} className="mt-1.5" />
    </div>
  );
}

type TabId = 'shadows' | 'lighting' | 'world' | 'post' | 'perf';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'shadows', label: 'Bóng đổ', icon: '🌗' },
  { id: 'lighting', label: 'Ánh sáng', icon: '💡' },
  { id: 'world', label: 'Thế giới', icon: '🌍' },
  { id: 'post', label: 'Màu sắc', icon: '🎨' },
  { id: 'perf', label: 'Hiệu năng', icon: '⚡' },
];

const f2 = (v: number) => v.toFixed(2);
const fPct = (v: number) => `${Math.round(v * 100)}%`;

export default function Builder() {
  const [s, setS] = useState<ShaderSettings>(PRESETS.medium);
  const [scene, setScene] = useState<'day' | 'night'>('day');
  const [busy, setBusy] = useState(false);
  const [dl, setDl] = useState<{ name: string; bytes: number } | null>(null);
  const [tab, setTab] = useState<TabId>('shadows');
  const [showCode, setShowCode] = useState(false);

  const preset = detectPreset(s);
  const files = useMemo(() => buildPackFiles(s), [s]);
  const size = useMemo(() => packSizeBytes(files), [files]);
  const cost = useMemo(() => estimateCost(s), [s]);

  const set = <K extends keyof ShaderSettings>(key: K, val: ShaderSettings[K]) => { setDl(null); setS((prev) => ({ ...prev, [key]: val })); };
  const applyPreset = (id: PresetId) => { setDl(null); setS(PRESETS[id]); };

  const onDownload = async () => {
    setBusy(true);
    try { const bytes = await downloadPack(s); setDl({ name: packFileName(s), bytes }); } finally { setBusy(false); }
  };

  const previewFilter = (() => {
    const ts = s.tonemap === 0 ? 0.9 : s.tonemap === 2 ? 0.97 : 1;
    const sat = (s.saturation + s.vibrance * 0.45) * ts;
    const con = s.contrast * (s.shadows ? 1.05 : 0.96) * (s.tonemap === 0 ? 0.94 : 1);
    return `saturate(${sat.toFixed(2)}) contrast(${con.toFixed(2)}) brightness(${s.exposure.toFixed(2)})`;
  })();
  const imgSrc = scene === 'day' ? IMAGES.previewDay : IMAGES.previewNight;

  const tabContent: Record<TabId, React.ReactNode> = {
    shadows: (
      <div className="divide-y divide-white/5">
        <Toggle label="Bật bóng đổ" hint="Tốn FPS nhất. Tắt = Iris skip shadow pass hoàn toàn." checked={s.shadows} onChange={(v) => set('shadows', v)} />
        <Choice label="Độ phân giải" value={s.shadowRes} options={OPTION_VALUES.shadowRes.map((v) => ({ value: v, label: `${v}px` }))} onChange={(v) => set('shadowRes', v)} disabled={!s.shadows} />
        <Slider label="Tầm xa" value={s.shadowDistance} values={OPTION_VALUES.shadowDistance} onChange={(v) => set('shadowDistance', v)} format={(v) => `${v} block`} disabled={!s.shadows} />
        <Choice label="Độ mềm" value={s.shadowSoftness} options={[{ value: 0 as const, label: 'Cứng (1 tap)' }, { value: 1 as const, label: 'Mềm (4 tap)' }, { value: 2 as const, label: 'Rất mềm' }]} onChange={(v) => set('shadowSoftness', v)} disabled={!s.shadows} />
        <Toggle label="Bóng có màu qua kính / nước" hint="+2 lần đọc texture mỗi pixel có bóng" checked={s.coloredShadows} onChange={(v) => set('coloredShadows', v)} disabled={!s.shadows} />
        <Toggle label="Mob & người chơi đổ bóng" hint="Tắt giúp CPU yếu rất nhiều khi đông mob" checked={s.entityShadows} onChange={(v) => set('entityShadows', v)} disabled={!s.shadows} />
        <Slider label="Góc đường đi mặt trời" value={s.sunPathRotation} values={OPTION_VALUES.sunPathRotation} onChange={(v) => set('sunPathRotation', v)} format={(v) => `${v}°`} />
      </div>
    ),
    lighting: (
      <div className="divide-y divide-white/5">
        <Slider label="Ánh nắng" value={s.sunlight} values={OPTION_VALUES.intensity} onChange={(v) => set('sunlight', v)} format={f2} />
        <Slider label="Ánh môi trường" value={s.ambient} values={OPTION_VALUES.intensity} onChange={(v) => set('ambient', v)} format={f2} />
        <Slider label="Ánh đuốc" value={s.blocklight} values={OPTION_VALUES.intensity} onChange={(v) => set('blocklight', v)} format={f2} />
        <Choice label="Màu đuốc" value={s.blocklightWarmth} options={[{ value: 0 as const, label: 'Lạnh' }, { value: 1 as const, label: 'Ấm (BSL)' }, { value: 2 as const, label: 'Rất ấm' }]} onChange={(v) => set('blocklightWarmth', v)} />
        <Slider label="Sáng tối thiểu trong hang" value={s.minLight} values={OPTION_VALUES.minLight} onChange={(v) => set('minLight', v)} format={f2} />
        <Toggle label="Đèn cầm tay" hint="Cầm đuốc = sáng xung quanh" checked={s.handLight} onChange={(v) => set('handLight', v)} />
        <Toggle label="Block phát sáng" hint="Đuốc, glowstone, lava… tự sáng + bloom" checked={s.emissive} onChange={(v) => set('emissive', v)} />
        <Slider label="Độ mạnh phát sáng" value={s.emissiveStrength} values={OPTION_VALUES.strength} onChange={(v) => set('emissiveStrength', v)} format={f2} disabled={!s.emissive} />
        <Toggle label="Giảm màu ban đêm" hint="Đêm hơi xám xanh" checked={s.nightDesat} onChange={(v) => set('nightDesat', v)} />
        <Toggle label="Đuốc lung linh" hint="Nhấp nhô nhẹ theo thời gian — 1 sin(), miễn phí" checked={s.torchFlicker} onChange={(v) => set('torchFlicker', v)} />
        <Toggle label="AO giả (tối góc)" hint="lightmap² → tối góc block, 0 cost" checked={s.ao} onChange={(v) => set('ao', v)} />
        <Choice label="Chiếu sáng hang" value={s.caveLighting} options={[{ value: 0 as const, label: 'Vanilla' }, { value: 1 as const, label: 'Tăng sáng' }]} onChange={(v) => set('caveLighting', v)} />
      </div>
    ),
    world: (
      <div className="divide-y divide-white/5">
        <Toggle label="Cỏ, hoa đung đưa" checked={s.wavingPlants} onChange={(v) => set('wavingPlants', v)} />
        <Toggle label="Lá cây đung đưa" checked={s.wavingLeaves} onChange={(v) => set('wavingLeaves', v)} />
        <Slider label="Sức gió" value={s.wavingStrength} values={OPTION_VALUES.strength} onChange={(v) => set('wavingStrength', v)} format={f2} disabled={!s.wavingPlants && !s.wavingLeaves} />
        <Toggle label="Sóng nước" hint="3 sóng cos, không texture" checked={s.waterWaves} onChange={(v) => set('waterWaves', v)} />
        <Toggle label="Nước phản chiếu bầu trời + vệt nắng" hint="1 texture lookup + pow()" checked={s.waterReflection} onChange={(v) => set('waterReflection', v)} />
        <Toggle label="Sương nước theo độ sâu" hint="1 pass toàn màn hình nhẹ" checked={s.waterFog} onChange={(v) => set('waterFog', v)} />
        <Slider label="Độ đục của nước" value={s.waterAlpha} values={OPTION_VALUES.waterAlpha} onChange={(v) => set('waterAlpha', v)} format={fPct} />
        <Choice label="Màu nước" value={s.waterTint} options={[{ value: 0 as const, label: 'Mặc định' }, { value: 1 as const, label: 'Nhiệt đới (teal)' }, { value: 2 as const, label: 'Đầm lầy (rêu)' }]} onChange={(v) => set('waterTint', v)} />
        <Toggle label="Mặt trời tròn" hint="Ẩn mặt trời vuông vanilla" checked={s.roundSun} onChange={(v) => set('roundSun', v)} />
        <Toggle label="Sao đêm lấp lánh" checked={s.stars} onChange={(v) => set('stars', v)} />
        <Slider label="Hoàng hôn rực rỡ" hint="Cao = cam hồng đậm hơn" value={s.sunsetIntensity} values={OPTION_VALUES.sunsetIntensity} onChange={(v) => set('sunsetIntensity', v)} format={f2} />
        <Slider label="Độ dày sương" value={s.fogDensity} values={OPTION_VALUES.fogDensity} onChange={(v) => set('fogDensity', v)} format={f2} />
        <Slider label="Sương mưa" hint="Sương thêm khi mưa" value={s.rainFog} values={OPTION_VALUES.rainFog} onChange={(v) => set('rainFog', v)} format={f2} />
        <Toggle label="Mây trong sáng" hint="Mây nhận ánh nắng thay vì chỉ xám" checked={s.cloudTranslucency} onChange={(v) => set('cloudTranslucency', v)} />
      </div>
    ),
    post: (
      <div className="divide-y divide-white/5">
        <Toggle label="Bloom" hint="≈ 3% FPS. Tắt = pass bloom skip hoàn toàn." checked={s.bloom} onChange={(v) => set('bloom', v)} />
        <Slider label="Độ mạnh bloom" value={s.bloomStrength} values={OPTION_VALUES.bloomStrength} onChange={(v) => set('bloomStrength', v)} format={f2} disabled={!s.bloom} />
        <Choice label="Tonemap" value={s.tonemap} options={[{ value: 1 as const, label: 'Sống động (BSL)' }, { value: 2 as const, label: 'ACES' }, { value: 0 as const, label: 'Không' }]} onChange={(v) => set('tonemap', v)} />
        <Slider label="Phơi sáng" value={s.exposure} values={OPTION_VALUES.exposure} onChange={(v) => set('exposure', v)} format={f2} />
        <Slider label="Độ bão hòa" value={s.saturation} values={OPTION_VALUES.saturation} onChange={(v) => set('saturation', v)} format={f2} />
        <Slider label="Vibrance" hint="Tăng màu chỗ nhạt, giữ chỗ đậm" value={s.vibrance} values={OPTION_VALUES.vibrance} onChange={(v) => set('vibrance', v)} format={f2} />
        <Slider label="Tương phản" value={s.contrast} values={OPTION_VALUES.contrast} onChange={(v) => set('contrast', v)} format={f2} />
        <Slider label="Nhiệt độ màu" hint="Âm = lạnh, dương = ấm" value={s.colorTemp} values={OPTION_VALUES.colorTemp} onChange={(v) => set('colorTemp', v)} format={(v) => v < 0 ? `${v} lạnh` : v > 0 ? `+${v} ấm` : 'trung tính'} />
        <Toggle label="Tối góc (vignette)" checked={s.vignette} onChange={(v) => set('vignette', v)} />
        <Slider label="Độ tối góc" value={s.vignetteStrength} values={OPTION_VALUES.vignetteStrength} onChange={(v) => set('vignetteStrength', v)} format={f2} disabled={!s.vignette} />
      </div>
    ),
    perf: (
      <div>
        <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-100/90">
          <strong className="text-emerald-200">⚡ Menu tối ưu mới (v1.0.1).</strong> Các tùy chọn ở đây bỏ hoặc thay các bước xử lý bằng phiên bản rẻ hơn. Preset <em>Extra Potato</em> bật toàn bộ.
        </div>
        <div className="divide-y divide-white/5">
          <Toggle label="Bỏ sky procedural" hint="Dùng gradient 2 màu đơn giản → tiết kiệm ~5-8% GPU. Bầu trời phẳng hơn." checked={s.skipSky} onChange={(v) => set('skipSky', v)} />
          <Toggle label="Bỏ tonemap curve" hint="Chỉ dùng gamma. Rẻ hơn nhưng cháy sáng dễ." checked={s.skipTonemap} onChange={(v) => set('skipTonemap', v)} />
          <Toggle label="Bỏ dithering" hint="Bỏ 1 hash noise/pixel. Có thể thấy dải màu ở bầu trời." checked={s.skipDithering} onChange={(v) => set('skipDithering', v)} />
          <Toggle label="Nước đơn giản (phẳng)" hint="Bỏ sóng + phản chiếu + Fresnel. Tiết kiệm ~3-5% với cảnh nhiều nước." checked={s.simpleWater} onChange={(v) => set('simpleWater', v)} />
          <Toggle label="Bóng nửa độ phân giải" hint="Sample bóng ở ½ res grid → 4× nhanh hơn cache." checked={s.lowResShadow} onChange={(v) => set('lowResShadow', v)} disabled={!s.shadows} />
          <Slider label="Tầm cắt hiệu ứng đắt" hint="Nước phản chiếu/sóng bị tắt ngoài khoảng này." value={s.cullDistance} values={OPTION_VALUES.cullDistance} onChange={(v) => set('cullDistance', v)} format={(v) => v >= 999 ? 'Không cắt' : `${v} block`} />
          <Choice label="Chất lượng sương" value={s.fogQuality} options={[{ value: 0 as const, label: 'Tắt (rẻ nhất)' }, { value: 1 as const, label: 'Rẻ (linear)' }, { value: 2 as const, label: 'Đầy đủ' }]} onChange={(v) => set('fogQuality', v)} />
        </div>
      </div>
    ),
  };

  const colors = ['bg-sky-500', 'bg-amber-400', 'bg-rose-400', 'bg-violet-400', 'bg-emerald-400', 'bg-teal-400', 'bg-pink-400'];

  return (
    <section id="builder" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Tùy chỉnh & Tải</p>
          <h2 className="section-title mt-2">Tự ráp shader cho đúng máy bạn</h2>
          <p className="mt-4 text-slate-400">Chọn preset rồi tinh chỉnh. File .zip tạo ngay trên trình duyệt — mọi tùy chọn vẫn chỉnh trong game được.</p>
        </Reveal>

        {/* preset grid — 8 tùy chọn chia 3 nhóm */}
        <div className="mt-10 space-y-6">
          {(['potato', 'balanced', 'high'] as const).map((tier, tierIdx) => {
            const tierIds = (Object.keys(PRESETS) as PresetId[]).filter((id) => PRESET_META[id].tier === tier);
            const tierMeta = {
              potato: { label: '🥔 Máy siêu yếu → yếu', accent: 'text-emerald-300', border: 'border-emerald-400/20' },
              balanced: { label: '⚖️ Máy phổ thông', accent: 'text-amber-300', border: 'border-amber-400/20' },
              high: { label: '✨ Máy khỏe', accent: 'text-violet-300', border: 'border-violet-400/20' },
            }[tier];
            return (
              <div key={tier}>
                <div className={cn('mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest', tierMeta.accent)}>
                  <span>{tierMeta.label}</span>
                  <span className={cn('h-px flex-1 border-t', tierMeta.border)} />
                  <span className="font-mono text-[10px] normal-case tracking-normal text-slate-500">{tierIds.length} preset</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tierIds.map((id, i) => {
                    const m = PRESET_META[id]; const active = preset === id;
                    return (
                      <Reveal key={id} delay={tierIdx * 100 + i * 60} variant="scale">
                        <button type="button" onClick={() => applyPreset(id)}
                          className={cn('hover-lift relative w-full h-full rounded-2xl border p-4 text-left transition-all duration-300',
                            active ? 'border-amber-400/60 bg-amber-400/10 scale-[1.02]' : 'glass hover:bg-white/[0.05]')}>
                          {active && (
                            <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-night-950 animate-tick">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                          <span className={cn('inline-block text-2xl transition-transform duration-300', active && 'scale-110 rotate-6')}>{m.emoji}</span>
                          <span className="mt-1.5 block text-base font-bold text-white leading-tight">{m.name}</span>
                          <span className="mt-1 block text-[11px] leading-snug text-slate-400">{m.tagline}</span>
                          <span className="mt-2 block text-[10px] text-amber-200/80 leading-tight">{m.target}</span>
                          <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                            <span className="h-1 w-1 rounded-full bg-emerald-400" />{m.fpsNote}
                          </span>
                        </button>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {preset === 'custom' && (
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-semibold text-sky-200">Tùy chỉnh</span>
            <button type="button" onClick={() => applyPreset('medium')} className="inline-flex items-center gap-1 text-slate-300 underline-offset-2 hover:underline">
              <RotateCcw className="h-3 w-3" /> Về preset Medium
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left: tabs */}
          <div>
            <div className="glass overflow-hidden">
              <div className="flex border-b border-white/8">
                {TABS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setTab(t.id)}
                    className={cn('flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2',
                      tab === t.id ? 'border-amber-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-200',
                      t.id === 'perf' && tab !== t.id && 'text-emerald-300/70 hover:text-emerald-300')}>
                    <span>{t.icon}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>
              <div key={tab} className="animate-tab p-4 max-h-[480px] overflow-y-auto code-scroll">{tabContent[tab]}</div>
            </div>
            <button type="button" onClick={() => setShowCode((v) => !v)}
              className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
              <ChevronRight className={cn('h-4 w-4 transition-transform', showCode && 'rotate-90')} />
              {showCode ? 'Ẩn mã nguồn' : 'Xem mã nguồn GLSL'}
            </button>
            {showCode && <div className="mt-3"><CodeViewer files={files} /></div>}
          </div>

          {/* right: preview + cost + download */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="glass overflow-hidden">
              <div className="relative aspect-video">
                <img src={imgSrc} alt="Preview" className="absolute inset-0 h-full w-full object-cover" style={{ filter: previewFilter }} />
                {s.bloom && <img src={imgSrc} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover mix-blend-screen" style={{ filter: 'blur(12px) brightness(0.8) saturate(1.3)', opacity: Math.min(0.8, s.bloomStrength * 3) }} />}
                {s.vignette && <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.8) 100%)', opacity: s.vignetteStrength * 0.7 }} />}
                {!s.shadows && <div className="absolute inset-0 bg-white/[0.05] mix-blend-screen" />}
                <div className="absolute left-3 top-3 flex gap-1 rounded-lg bg-night-950/70 p-1">
                  {(['day', 'night'] as const).map((sc) => (
                    <button key={sc} type="button" onClick={() => setScene(sc)}
                      className={cn('grid h-6 w-6 place-items-center rounded-md transition-colors',
                        scene === sc ? 'bg-amber-400 text-night-950' : 'text-slate-300 hover:bg-white/10')}
                      aria-label={sc === 'day' ? 'Ngày' : 'Đêm'}>
                      {sc === 'day' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-night-950/70 px-1.5 py-0.5 text-[9px] text-slate-400">Mô phỏng CSS</span>
              </div>
            </div>

            <div className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-white"><Zap className="h-4 w-4 text-amber-300" /> Ước tính FPS</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">So với vanilla + Sodium trên iGPU.</p>
                </div>
                <div className="text-right">
                  <div key={Math.round(cost.retention)} className="font-pixel text-xl text-emerald-300 animate-fade-in">
                    {Math.round(cost.retention)}%
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">giữ lại</div>
                </div>
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/5">
                {cost.parts.map((p, i) => (
                  <div key={p.key} title={`${p.label}: +${p.cost.toFixed(1)}%`}
                    className={cn('h-full transition-all duration-500', colors[i % colors.length])}
                    style={{ width: `${(p.cost / Math.max(cost.total, 1)) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-2.5 space-y-1 text-xs">
                {cost.parts.map((p, i) => (
                  <li key={p.key} className="flex items-center justify-between gap-2" title={p.tip}>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={cn('h-1.5 w-1.5 rounded-full', colors[i % colors.length])} />{p.label}
                    </span>
                    <span className="font-mono text-slate-500">+{p.cost.toFixed(1)}%</span>
                  </li>
                ))}
                <li className="flex items-center justify-between border-t border-white/8 pt-2 font-semibold">
                  <span className="text-slate-200">Tổng thêm</span>
                  <span className="font-mono text-amber-200">+{cost.total.toFixed(1)}%</span>
                </li>
              </ul>
              {cost.savings.length > 0 && (
                <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-2.5">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    <span>⚡ Đang tiết kiệm</span>
                    <span className="font-mono">-{cost.savings.reduce((a, p) => a + p.cost, 0).toFixed(1)}%</span>
                  </div>
                  <ul className="space-y-0.5">
                    {cost.savings.map((sv) => (
                      <li key={sv.key} className="flex items-center justify-between text-[11px]" title={sv.tip}>
                        <span className="text-emerald-200/90">✓ {sv.label}</span>
                        <span className="font-mono text-emerald-400">-{sv.cost.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-3 overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-[11px]">
                  <thead className="bg-white/5 text-[9px] uppercase tracking-wider text-slate-500">
                    <tr><th className="px-2 py-1.5 text-left">Máy</th><th className="px-2 py-1.5 text-right">Vanilla</th><th className="px-2 py-1.5 text-right text-amber-300">Vivid</th><th className="px-2 py-1.5 text-right">BSL</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MACHINES.map((m) => {
                      const vividFps = Math.round((m.vanillaFps * cost.retention) / 100);
                      return (
                        <tr key={m.name}>
                          <td className="px-2 py-1.5 text-slate-300">{m.name}</td>
                          <td className="px-2 py-1.5 text-right font-mono text-slate-400"><AnimatedNumber value={m.vanillaFps} /></td>
                          <td className="px-2 py-1.5 text-right font-mono font-bold text-emerald-300"><span key={vividFps} className="inline-block animate-fade-in">{vividFps}</span></td>
                          <td className="px-2 py-1.5 text-right font-mono text-rose-300"><AnimatedNumber value={m.bslFps} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-night-950"><FileArchive className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm text-white">{packFileName(s)}</div>
                  <div className="text-xs text-slate-400">{Object.keys(files).length} file · {(size / 1024).toFixed(0)} KB · preset <span className="text-amber-200">{preset === 'custom' ? 'Tùy chỉnh' : PRESET_META[preset].name}</span></div>
                </div>
              </div>
              <button type="button" onClick={onDownload} disabled={busy} className="btn-primary mt-3 w-full disabled:opacity-60">
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {busy ? 'Đang đóng gói…' : 'Tải shader pack (.zip)'}
              </button>
              {dl && (
                <p className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
                  <Check className="h-3.5 w-3.5" /> Đã tải {dl.name} ({(dl.bytes / 1024).toFixed(1)} KB). Bỏ nguyên .zip vào <span className="font-mono">.minecraft/shaderpacks</span>
                </p>
              )}
              <p className="mt-2 text-[11px] text-slate-500">Không giải nén. Trong game vẫn đổi được mọi tùy chọn + 4 profile.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
