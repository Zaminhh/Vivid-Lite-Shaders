import { lazy, useMemo, useState } from 'react';
import { Check, ChevronRight, Download, FileArchive, Loader2, Moon, RotateCcw, Sun, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { OPTION_VALUES, PRESETS, PRESET_META, applyPresetKeepCompat, detectPreset, type PresetId, type ShaderSettings } from '../shader/settings';
import { buildPackFiles, downloadPack, packFileName, packSizeBytes } from '../shader/pack';
import { MACHINES, estimateCost } from '../shader/estimate';
import { LOADER_META, VERSION_TARGETS, type LoaderId, type VersionTargetId } from '../shader/compat';
import { IMAGES } from '../assets/images';
import Reveal from './ui/Reveal';
import AnimatedNumber from './ui/AnimatedNumber';

const CodeViewer = lazy(() => import('./CodeViewer'));

// ---- controls ----
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

type TabId = 'shadows' | 'lighting' | 'night' | 'world' | 'post' | 'perf';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'shadows', label: 'Shadows', icon: '🌗' },
  { id: 'lighting', label: 'Lighting', icon: '💡' },
  { id: 'night', label: 'Night', icon: '🌙' },
  { id: 'world', label: 'World', icon: '🌍' },
  { id: 'post', label: 'Color', icon: '🎨' },
  { id: 'perf', label: 'Performance', icon: '⚡' },
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
  const applyPreset = (id: PresetId) => { setDl(null); setS((prev) => applyPresetKeepCompat(PRESETS[id], prev)); };

  const onDownload = async () => {
    setBusy(true);
    try { const bytes = await downloadPack(s); setDl({ name: packFileName(s), bytes }); } finally { setBusy(false); }
  };

  const isNight = scene === 'night';
  const previewFilter = (() => {
    const ts = s.tonemap === 0 ? 0.9 : s.tonemap === 2 ? 0.97 : 1;
    let sat = (s.saturation + s.vibrance * 0.45) * ts;
    const con = s.contrast * (s.shadows ? 1.05 : 0.96) * (s.tonemap === 0 ? 0.94 : 1);
    let bright = s.exposure;
    let hue = 0;
    if (isNight) {
      bright *= 0.55 + s.nightBrightness * 0.3 + s.moonlight * 0.08;
      if (s.nightDesat) sat *= 0.7;
      hue = s.nightTint === 1 ? -22 : s.nightTint === 2 ? 28 : 0;
    }
    return `saturate(${sat.toFixed(2)}) contrast(${con.toFixed(2)}) brightness(${bright.toFixed(2)}) hue-rotate(${hue}deg)`;
  })();
  const imgSrc = isNight ? IMAGES.previewNight : IMAGES.previewDay;
  const nightTintRgb = s.nightTint === 1 ? '20,110,120' : s.nightTint === 2 ? '90,55,150' : '40,70,160';

  const tabContent: Record<TabId, React.ReactNode> = {
    shadows: (
      <div className="divide-y divide-white/5">
        <Toggle label="Enable shadows" hint="The single biggest FPS cost. Turning off makes Iris skip the shadow pass entirely." checked={s.shadows} onChange={(v) => set('shadows', v)} />
        <Choice label="Shadow resolution" value={s.shadowRes} options={OPTION_VALUES.shadowRes.map((v) => ({ value: v, label: `${v}px` }))} onChange={(v) => set('shadowRes', v)} disabled={!s.shadows} />
        <Slider label="Shadow distance" value={s.shadowDistance} values={OPTION_VALUES.shadowDistance} onChange={(v) => set('shadowDistance', v)} format={(v) => `${v} block`} disabled={!s.shadows} />
        <Choice label="Softness" value={s.shadowSoftness} options={[{ value: 0 as const, label: 'Hard (1 tap)' }, { value: 1 as const, label: 'Soft (4 tap)' }, { value: 2 as const, label: 'Very soft' }]} onChange={(v) => set('shadowSoftness', v)} disabled={!s.shadows} />
        <Toggle label="Colored shadows (stained glass / water)" hint="+2 texture reads per shaded pixel" checked={s.coloredShadows} onChange={(v) => set('coloredShadows', v)} disabled={!s.shadows} />
        <Toggle label="Mobs & player cast shadows" hint="Disabling this helps weak CPUs a lot when many mobs are around" checked={s.entityShadows} onChange={(v) => set('entityShadows', v)} disabled={!s.shadows} />
        <Slider label="Sun path angle" value={s.sunPathRotation} values={OPTION_VALUES.sunPathRotation} onChange={(v) => set('sunPathRotation', v)} format={(v) => `${v}°`} />
      </div>
    ),
    lighting: (
      <div className="divide-y divide-white/5">
        <Slider label="Sunlight" value={s.sunlight} values={OPTION_VALUES.intensity} onChange={(v) => set('sunlight', v)} format={f2} />
        <Slider label="Ambient light" value={s.ambient} values={OPTION_VALUES.intensity} onChange={(v) => set('ambient', v)} format={f2} />
        <Slider label="Torch light" value={s.blocklight} values={OPTION_VALUES.intensity} onChange={(v) => set('blocklight', v)} format={f2} />
        <Choice label="Torch color" value={s.blocklightWarmth} options={[{ value: 0 as const, label: 'Cool' }, { value: 1 as const, label: 'Warm (BSL)' }, { value: 2 as const, label: 'Very warm' }]} onChange={(v) => set('blocklightWarmth', v)} />
        <Slider label="Minimum light in caves" value={s.minLight} values={OPTION_VALUES.minLight} onChange={(v) => set('minLight', v)} format={f2} />
        <Toggle label="Hand-held light" hint="Holding a torch lights the area" checked={s.handLight} onChange={(v) => set('handLight', v)} />
        <Toggle label="Emissive blocks" hint="Torches, glowstone, lava, lanterns… self-illuminate with bloom" checked={s.emissive} onChange={(v) => set('emissive', v)} />
        <Slider label="Emissive strength" value={s.emissiveStrength} values={OPTION_VALUES.strength} onChange={(v) => set('emissiveStrength', v)} format={f2} disabled={!s.emissive} />
        <Toggle label="Night desaturation" hint="Dim scenes lose color and shift toward the night tint, like human eyes" checked={s.nightDesat} onChange={(v) => set('nightDesat', v)} />
        <Toggle label="Torch flicker" hint="Very cheap, just 1 sin() call" checked={s.torchFlicker} onChange={(v) => set('torchFlicker', v)} />
        <Toggle label="Fake AO (corner darkening)" hint="lightmap² — 0 cost" checked={s.ao} onChange={(v) => set('ao', v)} />
        <Choice label="Cave lighting" value={s.caveLighting} options={[{ value: 0 as const, label: 'Vanilla' }, { value: 1 as const, label: 'Boosted' }]} onChange={(v) => set('caveLighting', v)} />
      </div>
    ),
    night: (
      <div>
        <div className="mb-4 rounded-xl border border-indigo-400/25 bg-indigo-400/5 p-3 text-xs text-indigo-100/90">
          <strong className="text-indigo-200">🌙 Night is fully reworked (v1.1.0).</strong> Moonlight casts real shadows and varies with the moon phase — a full moon is ~3× brighter than a new moon.
        </div>
        <div className="divide-y divide-white/5">
          <Slider label="Night brightness" hint="Low = dark & mysterious · High = easy to see" value={s.nightBrightness} values={OPTION_VALUES.nightBrightness} onChange={(v) => set('nightBrightness', v)} format={f2} />
          <Slider label="Moonlight" hint="Directional light from the moon (casts shadows)" value={s.moonlight} values={OPTION_VALUES.moonlight} onChange={(v) => set('moonlight', v)} format={f2} />
          <Choice label="Night tint" value={s.nightTint} options={[{ value: 0 as const, label: '🔵 Blue (BSL)' }, { value: 1 as const, label: '🟢 Teal' }, { value: 2 as const, label: '🟣 Purple' }]} onChange={(v) => set('nightTint', v)} />
          <Toggle label="Night desaturation (Purkinje shift)" hint="Dim scenes lose saturation — like human eyes in low light" checked={s.nightDesat} onChange={(v) => set('nightDesat', v)} />
          <Toggle label="Stars" checked={s.stars} onChange={(v) => set('stars', v)} />
          <Slider label="Star brightness" hint="2-layer stars: sparse bright + dense faint" value={s.starBrightness} values={OPTION_VALUES.starBrightness} onChange={(v) => set('starBrightness', v)} format={f2} disabled={!s.stars} />
          <Toggle label="Milky Way band" hint="Faint band of stars across the sky — reuses existing hash, ~0 cost" checked={s.milkyWay} onChange={(v) => set('milkyWay', v)} disabled={!s.stars} />
          <Toggle label="Moon glow halo" hint="Multi-layer halo around the moon" checked={s.moonGlow} onChange={(v) => set('moonGlow', v)} />
          <Slider label="Night fog" hint="Blue-ish haze at distance during night, for depth" value={s.nightFog} values={OPTION_VALUES.nightFog} onChange={(v) => set('nightFog', v)} format={f2} />
        </div>
      </div>
    ),
    world: (
      <div className="divide-y divide-white/5">
        <Toggle label="Waving grass & flowers" checked={s.wavingPlants} onChange={(v) => set('wavingPlants', v)} />
        <Toggle label="Waving leaves" checked={s.wavingLeaves} onChange={(v) => set('wavingLeaves', v)} />
        <Slider label="Wind strength" value={s.wavingStrength} values={OPTION_VALUES.strength} onChange={(v) => set('wavingStrength', v)} format={f2} disabled={!s.wavingPlants && !s.wavingLeaves} />
        <Toggle label="Water waves" hint="3 directional cosines, no texture" checked={s.waterWaves} onChange={(v) => set('waterWaves', v)} />
        <Toggle label="Water sky reflection + sun glint" hint="1 texture lookup + pow() for Fresnel" checked={s.waterReflection} onChange={(v) => set('waterReflection', v)} />
        <Toggle label="Water depth fog" hint="Adds 1 full-screen pass, very cheap" checked={s.waterFog} onChange={(v) => set('waterFog', v)} />
        <Slider label="Water opacity" value={s.waterAlpha} values={OPTION_VALUES.waterAlpha} onChange={(v) => set('waterAlpha', v)} format={fPct} />
        <Choice label="Water tint" value={s.waterTint} options={[{ value: 0 as const, label: 'Default' }, { value: 1 as const, label: 'Tropical (teal)' }, { value: 2 as const, label: 'Swamp (mossy)' }]} onChange={(v) => set('waterTint', v)} />
        <Toggle label="Round sun" hint="Hides the vanilla square sun" checked={s.roundSun} onChange={(v) => set('roundSun', v)} />
        <Slider label="Sunset intensity" hint="Higher = more vivid orange/pink at sunset" value={s.sunsetIntensity} values={OPTION_VALUES.sunsetIntensity} onChange={(v) => set('sunsetIntensity', v)} format={f2} />
        <Slider label="Fog density" value={s.fogDensity} values={OPTION_VALUES.fogDensity} onChange={(v) => set('fogDensity', v)} format={f2} />
        <Slider label="Rain fog" hint="Extra fog during rain" value={s.rainFog} values={OPTION_VALUES.rainFog} onChange={(v) => set('rainFog', v)} format={f2} />
        <Toggle label="Cloud translucency" hint="Clouds pick up sunlight instead of just gray" checked={s.cloudTranslucency} onChange={(v) => set('cloudTranslucency', v)} />
      </div>
    ),
    post: (
      <div className="divide-y divide-white/5">
        <Toggle label="Bloom" hint="≈ 3% FPS. Off = pass skipped entirely." checked={s.bloom} onChange={(v) => set('bloom', v)} />
        <Slider label="Bloom strength" value={s.bloomStrength} values={OPTION_VALUES.bloomStrength} onChange={(v) => set('bloomStrength', v)} format={f2} disabled={!s.bloom} />
        <Choice label="Tonemap" value={s.tonemap} options={[{ value: 1 as const, label: 'Vivid (BSL)' }, { value: 2 as const, label: 'ACES' }, { value: 0 as const, label: 'None' }]} onChange={(v) => set('tonemap', v)} />
        <Slider label="Exposure" value={s.exposure} values={OPTION_VALUES.exposure} onChange={(v) => set('exposure', v)} format={f2} />
        <Slider label="Saturation" value={s.saturation} values={OPTION_VALUES.saturation} onChange={(v) => set('saturation', v)} format={f2} />
        <Slider label="Vibrance" hint="Boosts muted colors, leaves already-saturated ones" value={s.vibrance} values={OPTION_VALUES.vibrance} onChange={(v) => set('vibrance', v)} format={f2} />
        <Slider label="Contrast" value={s.contrast} values={OPTION_VALUES.contrast} onChange={(v) => set('contrast', v)} format={f2} />
        <Slider label="Color temperature" hint="Negative = cool, positive = warm" value={s.colorTemp} values={OPTION_VALUES.colorTemp} onChange={(v) => set('colorTemp', v)} format={(v) => v < 0 ? `${v} cool` : v > 0 ? `+${v} warm` : 'neutral'} />
        <Toggle label="Vignette" checked={s.vignette} onChange={(v) => set('vignette', v)} />
        <Slider label="Vignette strength" value={s.vignetteStrength} values={OPTION_VALUES.vignetteStrength} onChange={(v) => set('vignetteStrength', v)} format={f2} disabled={!s.vignette} />
      </div>
    ),
    perf: (
      <div>
        <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-100/90">
          <strong className="text-emerald-200">⚡ Performance menu (v1.1.1).</strong> 16 options here — the Extra Potato preset turns most of them on. The aggressive GPU-level tricks are always on (mad, exp2, branch culling, pre-fused constants).
        </div>
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-rose-300/80">Skip entirely</div>
        <div className="divide-y divide-white/5">
          <Toggle label="Skip procedural sky" hint="2-color gradient instead → save ~5–8% GPU. Sky looks flatter." checked={s.skipSky} onChange={(v) => set('skipSky', v)} />
          <Toggle label="Skip tonemap curve" hint="Just gamma. Cheaper but burns highlights more easily." checked={s.skipTonemap} onChange={(v) => set('skipTonemap', v)} />
          <Toggle label="Skip dithering" hint="Removes 1 hash/pixel. You may see banding in the sky." checked={s.skipDithering} onChange={(v) => set('skipDithering', v)} />
          <Toggle label="Skip color temperature shift" hint="Skip the warm/cool tint in the final pass" checked={s.noColorTemp} onChange={(v) => set('noColorTemp', v)} />
          <Toggle label="Skip water specular" hint="No sun glints on water. Saves 1 pow instruction" checked={s.skipSpecular} onChange={(v) => set('skipSpecular', v)} />
        </div>

        <div className="mt-4 mb-3 text-[10px] font-semibold uppercase tracking-widest text-amber-300/80">Cheap replacements</div>
        <div className="divide-y divide-white/5">
          <Toggle label="Simple water (flat)" hint="No waves, no reflection, no Fresnel. Save ~3–5% with lots of water." checked={s.simpleWater} onChange={(v) => set('simpleWater', v)} />
          <Toggle label="Half-resolution shadow" hint="Sample shadow at ½ res grid → 4× faster cache hits" checked={s.lowResShadow} onChange={(v) => set('lowResShadow', v)} disabled={!s.shadows} />
          <Toggle label="1-tap shadow (no PCF)" hint="Skip the 4-tap soft shadow filter. Shadow is sharper but pixely" checked={s.skipPcf} onChange={(v) => set('skipPcf', v)} disabled={!s.shadows || s.shadowSoftness === 0} />
          <Toggle label="Half-resolution bloom" hint="3×3 instead of 5×5 bloom blur. Less smooth, much faster" checked={s.halfResBloom} onChange={(v) => set('halfResBloom', v)} disabled={!s.bloom} />
          <Toggle label="Cheap sky at far distance" hint="Use the 2-color sky beyond 48 blocks — invisible difference in fog" checked={s.skyLOD} onChange={(v) => set('skyLOD', v)} />
          <Toggle label="1 wave instead of 3" hint="Single sine instead of 3 — barely visible" checked={s.smallWave} onChange={(v) => set('smallWave', v)} />
          <Toggle label="Fast normalize (inverse sqrt)" hint="Use a fast normalization for water normal — saves 1 sqrt+div" checked={s.fastNormalize} onChange={(v) => set('fastNormalize', v)} />
          <Toggle label="Pre-computed view direction" hint="Skip redundant normalize() in water reflection" checked={s.precomputedView} onChange={(v) => set('precomputedView', v)} />
          <Toggle label="Cheap emissive (no smoothstep)" hint="Skip the smoothstep() in emissive detection" checked={s.cheapEmissive} onChange={(v) => set('cheapEmissive', v)} disabled={!s.emissive} />
        </div>

        <div className="mt-4 mb-3 text-[10px] font-semibold uppercase tracking-widest text-violet-300/80">Distance culls</div>
        <div className="divide-y divide-white/5">
          <Slider label="Cull expensive effects beyond" hint="Disables water reflection / waves past this distance" value={s.cullDistance} values={OPTION_VALUES.cullDistance} onChange={(v) => set('cullDistance', v)} format={(v) => v >= 999 ? 'No cull' : `${v} block`} />
          <Slider label="Disable waves beyond" hint="Stop water wave computation past this distance" value={s.waveCutoff} values={OPTION_VALUES.waveCutoff} onChange={(v) => set('waveCutoff', v)} format={(v) => v >= 999 ? 'Never' : `${v} block`} />
          <Slider label="Disable shadow lookup beyond" hint="Hard cull on shadow texture reads past this distance" value={s.shadowCutoff} values={OPTION_VALUES.shadowCutoff} onChange={(v) => set('shadowCutoff', v)} format={(v) => v >= 999 ? 'Never' : `${v} block`} />
          <Slider label="Disable fog beyond" hint="Skip fog computation past this distance (fog is invisible anyway)" value={s.fogCutoff} values={OPTION_VALUES.fogCutoff} onChange={(v) => set('fogCutoff', v)} format={(v) => v >= 999 ? 'Never' : `${v} block`} />
          <Choice label="Fog quality" value={s.fogQuality} options={[{ value: 0 as const, label: 'Off (cheapest)' }, { value: 1 as const, label: 'Cheap (linear)' }, { value: 2 as const, label: 'Full' }]} onChange={(v) => set('fogQuality', v)} />
        </div>
      </div>
    ),
  };

  const colors = ['bg-sky-500', 'bg-amber-400', 'bg-rose-400', 'bg-violet-400', 'bg-emerald-400', 'bg-teal-400', 'bg-pink-400'];

  return (
    <section id="builder" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Customize & Download</p>
          <h2 className="section-title mt-2">Build your own shader pack</h2>
          <p className="mt-4 text-slate-400">Pick a preset, then tune. The <span className="font-mono text-slate-200">.zip</span> is generated right in your browser — and you can still change every option in-game.</p>
        </Reveal>

        {/* version + loader selector */}
        <Reveal className="glass mt-8 p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span>🎮</span> Minecraft version
                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300">1.8 → 26.3</span>
              </h3>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                {(Object.keys(VERSION_TARGETS) as VersionTargetId[]).map((id) => {
                  const vt = VERSION_TARGETS[id]; const active = s.mcVersion === id;
                  return (
                    <button key={id} type="button" onClick={() => set('mcVersion', id)}
                      className={cn('rounded-lg border px-3 py-2 text-left transition-colors',
                        active ? 'border-amber-400/50 bg-amber-400/15' : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.07]')}>
                      <span className={cn('block text-xs font-bold', active ? 'text-amber-200' : 'text-slate-200')}>{vt.label}</span>
                      <span className="mt-0.5 block font-mono text-[9px] text-slate-500">{id}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-slate-500">{VERSION_TARGETS[s.mcVersion].note}</p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span>🧩</span> Loader
              </h3>
              <div className="mt-2.5 space-y-1.5">
                {(Object.keys(LOADER_META) as LoaderId[]).map((id) => {
                  const lm = LOADER_META[id]; const active = s.loader === id;
                  return (
                    <button key={id} type="button" onClick={() => set('loader', id)}
                      className={cn('flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors',
                        active ? 'border-amber-400/50 bg-amber-400/15' : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.07]')}>
                      <span className="text-base leading-none mt-0.5">{lm.emoji}</span>
                      <span className="min-w-0">
                        <span className={cn('block text-xs font-bold', active ? 'text-amber-200' : 'text-slate-200')}>{lm.label}</span>
                        <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{lm.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Supported by: <span className="text-slate-400">{VERSION_TARGETS[s.mcVersion].loaders}</span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* preset grid */}
        <div className="mt-8 space-y-6">
          {(['potato', 'balanced', 'high'] as const).map((tier, tierIdx) => {
            const tierIds = (Object.keys(PRESETS) as PresetId[]).filter((id) => PRESET_META[id].tier === tier);
            const tierMeta = {
              potato: { label: '🥔 Ultra weak → weak hardware', accent: 'text-emerald-300', border: 'border-emerald-400/20' },
              balanced: { label: '⚖️ Mainstream hardware', accent: 'text-amber-300', border: 'border-amber-400/20' },
              high: { label: '✨ Strong hardware', accent: 'text-violet-300', border: 'border-violet-400/20' },
            }[tier];
            return (
              <div key={tier}>
                <div className={cn('mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest', tierMeta.accent)}>
                  <span>{tierMeta.label}</span>
                  <span className={cn('h-px flex-1 border-t', tierMeta.border)} />
                  <span className="font-mono text-[10px] normal-case tracking-normal text-slate-500">{tierIds.length} preset{tierIds.length > 1 ? 's' : ''}</span>
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
            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-semibold text-sky-200">Custom</span>
            <button type="button" onClick={() => applyPreset('medium')} className="inline-flex items-center gap-1 text-slate-300 underline-offset-2 hover:underline">
              <RotateCcw className="h-3 w-3" /> Reset to Medium
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
              {showCode ? 'Hide GLSL source' : 'View GLSL source'}
            </button>
            {showCode && <div className="mt-3"><CodeViewer files={files} /></div>}
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="glass overflow-hidden">
              <div className="relative aspect-video">
                <img src={imgSrc} alt="Preview" className="absolute inset-0 h-full w-full object-cover" style={{ filter: previewFilter }} />
                {s.bloom && <img src={imgSrc} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover mix-blend-screen" style={{ filter: 'blur(12px) brightness(0.8) saturate(1.3)', opacity: Math.min(0.8, s.bloomStrength * 3) }} />}
                {isNight && (
                  <div className="absolute inset-0 mix-blend-soft-light transition-opacity duration-300"
                    style={{ background: `linear-gradient(to bottom, rgba(${nightTintRgb},0.9), rgba(${nightTintRgb},0.35))`, opacity: 0.55 + s.nightFog * 0.12 }} />
                )}
                {isNight && s.stars && s.starBrightness > 0 && (
                  <div className="absolute inset-x-0 top-0 h-1/2 transition-opacity duration-300"
                    style={{
                      backgroundImage: 'radial-gradient(1px 1px at 12% 22%, #fff, transparent), radial-gradient(1px 1px at 34% 12%, #cfe3ff, transparent), radial-gradient(1px 1px at 58% 28%, #fff, transparent), radial-gradient(1px 1px at 76% 15%, #ffe8cf, transparent), radial-gradient(1px 1px at 88% 34%, #fff, transparent), radial-gradient(1px 1px at 22% 38%, #fff, transparent), radial-gradient(1px 1px at 66% 8%, #fff, transparent)',
                      opacity: Math.min(1, s.starBrightness * 0.55),
                    }} />
                )}
                {isNight && s.milkyWay && s.stars && (
                  <div className="absolute inset-0 mix-blend-screen transition-opacity duration-300"
                    style={{ background: 'linear-gradient(115deg, transparent 34%, rgba(150,180,255,0.16) 45%, rgba(190,205,255,0.22) 50%, rgba(150,180,255,0.16) 55%, transparent 66%)', opacity: Math.min(1, s.starBrightness * 0.8) }} />
                )}
                {isNight && s.moonGlow && s.moonlight > 0 && (
                  <div className="absolute right-[18%] top-[12%] h-16 w-16 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle, rgba(${nightTintRgb},0.55) 0%, rgba(${nightTintRgb},0.18) 40%, transparent 70%)`, opacity: Math.min(1, s.moonlight * 0.7) }} />
                )}
                {s.vignette && <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.8) 100%)', opacity: s.vignetteStrength * 0.7 }} />}
                {!s.shadows && <div className="absolute inset-0 bg-white/[0.05] mix-blend-screen" />}
                <div className="absolute left-3 top-3 flex gap-1 rounded-lg bg-night-950/70 p-1">
                  {(['day', 'night'] as const).map((sc) => (
                    <button key={sc} type="button" onClick={() => setScene(sc)}
                      className={cn('grid h-6 w-6 place-items-center rounded-md transition-colors',
                        scene === sc ? 'bg-amber-400 text-night-950' : 'text-slate-300 hover:bg-white/10')}
                      aria-label={sc === 'day' ? 'Day' : 'Night'}>
                      {sc === 'day' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-night-950/70 px-1.5 py-0.5 text-[9px] text-slate-400">CSS simulation</span>
              </div>
            </div>

            <div className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-white"><Zap className="h-4 w-4 text-amber-300" /> FPS estimate</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">vs vanilla + Sodium on iGPU.</p>
                </div>
                <div className="text-right">
                  <div key={Math.round(cost.retention)} className="font-pixel text-xl text-emerald-300 animate-fade-in">
                    {Math.round(cost.retention)}%
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">retained</div>
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
                  <span className="text-slate-200">Total</span>
                  <span className="font-mono text-amber-200">+{cost.total.toFixed(1)}%</span>
                </li>
              </ul>
              {cost.savings.length > 0 && (
                <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-2.5">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    <span>⚡ Saving</span>
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
                    <tr>
                      <th className="px-2 py-1.5 text-left">Machine</th>
                      <th className="px-2 py-1.5 text-right">Vanilla</th>
                      <th className="px-2 py-1.5 text-right text-amber-300">Vivid</th>
                      <th className="px-2 py-1.5 text-right">BSL</th>
                    </tr>
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
                  <div className="text-xs text-slate-400">{Object.keys(files).length} files · {(size / 1024).toFixed(0)} KB · preset <span className="text-amber-200">{preset === 'custom' ? 'Custom' : PRESET_META[preset].name}</span></div>
                </div>
              </div>
              <button type="button" onClick={onDownload} disabled={busy} className="btn-primary mt-3 w-full disabled:opacity-60">
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {busy ? 'Packing…' : 'Download shader pack (.zip)'}
              </button>
              {dl && (
                <p className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
                  <Check className="h-3.5 w-3.5" /> Downloaded {dl.name} ({(dl.bytes / 1024).toFixed(1)} KB). Drop the .zip into <span className="font-mono">.minecraft/shaderpacks</span>
                </p>
              )}
              <p className="mt-2 text-[11px] text-slate-500">Don't extract. Every option + 8 profiles still tunable in-game.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
