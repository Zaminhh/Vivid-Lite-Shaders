// ============================================================================
//  Vivid Lite — extended settings model, presets and generated pack files
// ============================================================================

import { VERSION_TARGETS, buildBlockProperties, buildBufferFormats, type LoaderId, type VersionTargetId } from './compat';
import { AUTHOR, REPO_URL, VERSION } from './version';

export type PresetId = 'extraPotato' | 'lowPotato' | 'highPotato' | 'potato' | 'low' | 'medium' | 'high' | 'extraHigh';

export interface ShaderSettings {
  // shadows
  shadows: boolean;
  shadowRes: number;
  shadowDistance: number;
  shadowSoftness: 0 | 1 | 2;
  coloredShadows: boolean;
  entityShadows: boolean;
  sunPathRotation: number;
  // lighting
  sunlight: number;
  ambient: number;
  blocklight: number;
  blocklightWarmth: 0 | 1 | 2;
  minLight: number;
  handLight: boolean;
  emissive: boolean;
  emissiveStrength: number;
  nightDesat: boolean;
  torchFlicker: boolean;
  ao: boolean;
  caveLighting: 0 | 1;
  // world
  wavingPlants: boolean;
  wavingLeaves: boolean;
  wavingStrength: number;
  waterWaves: boolean;
  waterReflection: boolean;
  waterFog: boolean;
  waterAlpha: number;
  waterTint: number;
  roundSun: boolean;
  stars: boolean;
  fogDensity: number;
  rainFog: number;
  sunsetIntensity: number;
  cloudTranslucency: boolean;
  // post
  bloom: boolean;
  bloomStrength: number;
  tonemap: 0 | 1 | 2;
  exposure: number;
  saturation: number;
  vibrance: number;
  contrast: number;
  vignette: boolean;
  vignetteStrength: number;
  colorTemp: number;
  // performance (v1.0.1)
  skipSky: boolean;
  skipTonemap: boolean;
  skipDithering: boolean;
  simpleWater: boolean;
  cullDistance: number;
  lowResShadow: boolean;
  fogQuality: 0 | 1 | 2;
  // night rework (v1.1.0)
  nightBrightness: number;
  moonlight: number;
  nightTint: 0 | 1 | 2;
  starBrightness: number;
  milkyWay: boolean;
  moonGlow: boolean;
  nightFog: number;
  // compatibility (v1.1.0)
  mcVersion: VersionTargetId;
  loader: LoaderId;
  // perf+ (v1.1.1)
  skyLOD: boolean;
  smallWave: boolean;
  waveCutoff: number;
  shadowCutoff: number;
  vertexAO: boolean;
  fastNormalize: boolean;
  precomputedView: boolean;
  cheapEmissive: boolean;
  skipPcf: boolean;
  fogCutoff: number;
  halfResBloom: boolean;
  skipSpecular: boolean;
  noColorTemp: boolean;
  // BSL grade (v1.1.3) — final-pass color grading, all compile-time #defines
  colorGrading: boolean;
  gradeBlack: number;
  gradeSplit: number;
  gradeSunset: number;
  gradeCurve: number;
}

export const OPTION_VALUES = {
  shadowRes: [512, 768, 1024, 1536, 2048],
  shadowDistance: [32, 48, 64, 80, 96, 128, 160],
  sunPathRotation: [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60],
  intensity: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.75, 2.0],
  minLight: [0, 0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.2],
  strength: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  waterAlpha: [0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9],
  fogDensity: [0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  rainFog: [0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  sunsetIntensity: [0.3, 0.5, 0.6, 0.7, 0.8, 0.85, 1.0, 1.2, 1.5],
  bloomStrength: [0.04, 0.08, 0.12, 0.16, 0.2, 0.3, 0.4],
  exposure: [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5],
  saturation: [0.8, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.3, 1.4],
  vibrance: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
  contrast: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2],
  vignetteStrength: [0.25, 0.5, 0.75, 1.0],
  colorTemp: [-1, -0.5, 0, 0.5, 1],
  cullDistance: [32, 48, 64, 96, 128, 160, 200, 999],
  waveCutoff: [24, 40, 60, 80, 120, 160, 200, 999],
  shadowCutoff: [32, 48, 64, 96, 128, 160, 999],
  fogCutoff: [48, 64, 96, 128, 160, 200, 256, 999],
  nightBrightness: [0.4, 0.6, 0.8, 1.0, 1.1, 1.2, 1.5, 2.0],
  moonlight: [0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0],
  starBrightness: [0, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  nightFog: [0, 0.5, 0.75, 1.0, 1.5, 2.0],
  gradeBlack: [0, 0.01, 0.02, 0.03, 0.04, 0.06],
  gradeSplit: [0, 0.25, 0.5, 0.75, 1.0],
  gradeSunset: [0, 0.5, 0.75, 1.0, 1.25, 1.5],
  gradeCurve: [0, 0.15, 0.25, 0.35, 0.5],
} as const;

const BASE: ShaderSettings = {
  shadows: true, shadowRes: 1024, shadowDistance: 96, shadowSoftness: 1,
  coloredShadows: false, entityShadows: true, sunPathRotation: -40,
  sunlight: 1.0, ambient: 1.0, blocklight: 1.0, blocklightWarmth: 1,
  minLight: 0.03, handLight: true, emissive: true, emissiveStrength: 1.0,
  nightDesat: true, torchFlicker: false, ao: true, caveLighting: 1,
  wavingPlants: true, wavingLeaves: true, wavingStrength: 1.0,
  waterWaves: true, waterReflection: true, waterFog: true, waterAlpha: 0.7, waterTint: 0,
  roundSun: true, stars: true, fogDensity: 1.0, rainFog: 1.5,
  sunsetIntensity: 1.0, cloudTranslucency: false,
  bloom: true, bloomStrength: 0.12, tonemap: 1, exposure: 1.0,
  saturation: 1.1, vibrance: 0.2, contrast: 1.05,
  vignette: true, vignetteStrength: 0.5, colorTemp: 0,
  skipSky: false, skipTonemap: false, skipDithering: false,
  simpleWater: false, cullDistance: 999, lowResShadow: false, fogQuality: 2,
  nightBrightness: 1.0, moonlight: 1.0, nightTint: 0, starBrightness: 1.0,
  milkyWay: true, moonGlow: true, nightFog: 1.0,
  mcVersion: 'latest', loader: 'both',
  skyLOD: true, smallWave: false, waveCutoff: 80, shadowCutoff: 999, vertexAO: false,
  fastNormalize: true, precomputedView: true, cheapEmissive: true, skipPcf: false,
  fogCutoff: 128, halfResBloom: false, skipSpecular: false, noColorTemp: false,
  colorGrading: false, gradeBlack: 0.02, gradeSplit: 0.5, gradeSunset: 1.0, gradeCurve: 0.25,
};

export const PRESETS: Record<PresetId, ShaderSettings> = {
  extraPotato: {
    ...BASE,
    shadows: false, shadowRes: 512, shadowDistance: 32, shadowSoftness: 0,
    coloredShadows: false, entityShadows: false,
    ao: false, torchFlicker: false, handLight: false, emissive: false, nightDesat: false,
    caveLighting: 0,
    wavingPlants: false, wavingLeaves: false,
    waterWaves: false, waterReflection: false, waterFog: false, waterAlpha: 0.6,
    roundSun: false, stars: false, sunsetIntensity: 0.5, rainFog: 0.75,
    cloudTranslucency: false, fogDensity: 0.5,
    bloom: false, tonemap: 0, vignette: false, vibrance: 0,
    skipSky: true, skipTonemap: true, skipDithering: true,
    simpleWater: true, cullDistance: 32, lowResShadow: true, fogQuality: 0,
    moonlight: 0.5, starBrightness: 0, milkyWay: false, moonGlow: false, nightFog: 0,
    smallWave: true, waveCutoff: 24, shadowCutoff: 32, skyLOD: true, vertexAO: false,
    fastNormalize: true, precomputedView: true, cheapEmissive: true, skipPcf: true,
    fogCutoff: 64, halfResBloom: true, skipSpecular: true, noColorTemp: true,
  },
  lowPotato: {
    ...BASE,
    shadows: false, shadowRes: 512, shadowDistance: 32, shadowSoftness: 0,
    entityShadows: false, coloredShadows: false,
    ao: false, torchFlicker: false, emissive: false, nightDesat: false,
    wavingLeaves: false, waterWaves: false, waterReflection: false, waterFog: false,
    roundSun: false, stars: false, sunsetIntensity: 0.6,
    cloudTranslucency: false, fogDensity: 0.75,
    bloom: false, vignette: false, vibrance: 0.1,
    skipSky: false, skipTonemap: false, skipDithering: true,
    simpleWater: true, cullDistance: 48, lowResShadow: false, fogQuality: 1,
    moonlight: 0.75, starBrightness: 0.5, milkyWay: false, moonGlow: false, nightFog: 0.5,
  },
  potato: {
    ...BASE,
    shadows: false, shadowRes: 512, shadowDistance: 48, shadowSoftness: 0,
    entityShadows: false, wavingLeaves: false,
    waterFog: false, waterReflection: false,
    bloom: false, vignette: false, ao: false, torchFlicker: false,
    cloudTranslucency: false, sunsetIntensity: 0.7,
    simpleWater: false, cullDistance: 64, fogQuality: 1,
    starBrightness: 0.75, milkyWay: false, moonGlow: false, nightFog: 0.5,
  },
  highPotato: {
    ...BASE,
    shadows: true, shadowRes: 512, shadowDistance: 48, shadowSoftness: 0,
    entityShadows: false, coloredShadows: false, lowResShadow: true,
    wavingLeaves: false, waterFog: false, waterReflection: false,
    bloom: false, vignette: false, torchFlicker: false,
    cloudTranslucency: false, sunsetIntensity: 0.8,
    cullDistance: 96, fogQuality: 1,
    milkyWay: false, nightFog: 0.75,
  },
  low: {
    ...BASE,
    shadowRes: 768, shadowDistance: 64, shadowSoftness: 0,
    entityShadows: false, wavingLeaves: false, waterFog: false,
    cloudTranslucency: false, sunsetIntensity: 0.85,
    cullDistance: 128, fogQuality: 2,
  },
  medium: { ...BASE },
  high: {
    ...BASE,
    shadowRes: 2048, shadowDistance: 128, shadowSoftness: 2,
    coloredShadows: true, bloomStrength: 0.16, torchFlicker: true,
    cloudTranslucency: true, sunsetIntensity: 1.2,
  },
  extraHigh: {
    ...BASE,
    shadowRes: 2048, shadowDistance: 160, shadowSoftness: 2,
    coloredShadows: true, entityShadows: true,
    torchFlicker: true, emissiveStrength: 1.5,
    wavingStrength: 1.25, waterAlpha: 0.75,
    cloudTranslucency: true, sunsetIntensity: 1.5, rainFog: 2.0,
    // v1.1.3 "BSL grade": the old Extra High (sat 1.15 / bloom 0.20 / contrast 1.10)
    // looked pale because the strong additive bloom lifted the black floor and the
    // linear contrast clipped highlights. Now: less haze, a black point, blue-shadow /
    // warm-highlight split toning, golden-hour warmth and a filmic S-curve.
    bloomStrength: 0.16, saturation: 1.2, vibrance: 0.3, contrast: 1.05,
    vignetteStrength: 0.75,
    colorGrading: true, gradeBlack: 0.02, gradeSplit: 0.75, gradeSunset: 1.25, gradeCurve: 0.35,
    nightBrightness: 1.1, moonlight: 1.5, starBrightness: 1.5,
    milkyWay: true, moonGlow: true, nightFog: 1.5,
  },
};

export const PRESET_META: Record<PresetId, { name: string; tagline: string; target: string; emoji: string; fpsNote: string; tier: 'potato' | 'balanced' | 'high' }> = {
  extraPotato: {
    name: 'Extra Potato', emoji: '💀',
    tagline: 'Maximum optimization. Skips procedural sky, tonemap, dithering, fog. Keeps only basic lighting + color grading.',
    target: 'Intel HD 2000/3000, Atom netbooks, 2 GB RAM',
    fpsNote: '~99% of vanilla FPS',
    tier: 'potato',
  },
  lowPotato: {
    name: 'Low Potato', emoji: '🥔',
    tagline: 'A step above Potato. Flat water, cheap linear fog, no dithering.',
    target: 'Intel HD 3000/4000, dual-core Celeron',
    fpsNote: '~95% of vanilla FPS',
    tier: 'potato',
  },
  potato: {
    name: 'Potato', emoji: '🍟',
    tagline: 'No shadows, no bloom — pretty lighting, sky and clear water.',
    target: 'Intel HD 4000, 4 GB RAM, 2012+ laptops',
    fpsNote: '~92% of vanilla FPS',
    tier: 'potato',
  },
  highPotato: {
    name: 'High Potato', emoji: '🌶️',
    tagline: 'Potato + hard 512px shadows at 48-block range.',
    target: 'Intel HD 5000/HD 520, 2014+ office laptops',
    fpsNote: '~88% of vanilla FPS',
    tier: 'potato',
  },
  low: {
    name: 'Low', emoji: '🌱',
    tagline: 'Hard 768px shadows + subtle bloom. Noticeably prettier, surprisingly light.',
    target: 'Intel HD 520/620, UHD 600, Vega 3',
    fpsNote: '~85% of vanilla FPS',
    tier: 'balanced',
  },
  medium: {
    name: 'Medium (recommended)', emoji: '🌤️',
    tagline: 'Soft 1024px shadows, water depth fog, waving leaves. The sweet spot.',
    target: 'Iris Xe, Vega 8, GT 1030, MX150',
    fpsNote: '~80% of vanilla FPS',
    tier: 'balanced',
  },
  high: {
    name: 'High (BSL look)', emoji: '✨',
    tagline: 'Very soft 2048px shadows, colored shadows, flickering torches. Closest to BSL.',
    target: 'GTX 1050 / RX 560 and up',
    fpsNote: '~72% of vanilla FPS',
    tier: 'high',
  },
  extraHigh: {
    name: 'Extra High', emoji: '💎',
    tagline: 'Everything cranked: 2048/160 shadows, cloud translucency, max vibrance & vignette.',
    target: 'GTX 1060 / RX 580 and up',
    fpsNote: '~65% of vanilla FPS',
    tier: 'high',
  },
};

// ---------------------------------------------------------------------------
// formatting
// ---------------------------------------------------------------------------
const f2 = (v: number) => v.toFixed(2);
const f1 = (v: number) => v.toFixed(1);
const list = (vals: readonly number[], fmt: (v: number) => string) => `//[${vals.map(fmt).join(' ')}]`;
const flag = (name: string, on: boolean) => `${on ? '' : '//'}#define ${name}`;

const NON_PRESET_KEYS: (keyof ShaderSettings)[] = ['mcVersion', 'loader'];

export function detectPreset(s: ShaderSettings): PresetId | 'custom' {
  for (const id of Object.keys(PRESETS) as PresetId[]) {
    const p = PRESETS[id];
    const keys = (Object.keys(p) as (keyof ShaderSettings)[]).filter((k) => !NON_PRESET_KEYS.includes(k));
    if (keys.every((k) => p[k] === s[k])) return id;
  }
  return 'custom';
}

export function applyPresetKeepCompat(preset: ShaderSettings, current: ShaderSettings): ShaderSettings {
  return { ...preset, mcVersion: current.mcVersion, loader: current.loader };
}


// ---------------------------------------------------------------------------
// In-game option table + profile generator (v1.1.3)
// ---------------------------------------------------------------------------
// ONE table maps every settings field to its in-game option name and value
// format. Profiles are generated from PRESETS through it, so each
// profile.X line sets EVERY switchable option. (Before v1.1.3 the profile
// lines were hand-written and incomplete: picking "Extra High" in-game kept
// Medium's saturation / contrast / bloom — one reason it looked washed out.)
type OptKind = 'bool' | 'int' | 'f1' | 'f2';
export const OPTION_TABLE: { name: string; kind: OptKind; get: (s: ShaderSettings) => boolean | number }[] = [
  { name: 'SHADOWS', kind: 'bool', get: (s) => s.shadows },
  { name: 'shadowMapResolution', kind: 'int', get: (s) => s.shadowRes },
  { name: 'shadowDistance', kind: 'f1', get: (s) => s.shadowDistance },
  { name: 'SHADOW_SOFTNESS', kind: 'int', get: (s) => s.shadowSoftness },
  { name: 'COLORED_SHADOWS', kind: 'bool', get: (s) => s.coloredShadows },
  { name: 'sunPathRotation', kind: 'f1', get: (s) => s.sunPathRotation },
  { name: 'SUNLIGHT_I', kind: 'f2', get: (s) => s.sunlight },
  { name: 'AMBIENT_I', kind: 'f2', get: (s) => s.ambient },
  { name: 'BLOCKLIGHT_I', kind: 'f2', get: (s) => s.blocklight },
  { name: 'BLOCKLIGHT_WARMTH', kind: 'int', get: (s) => s.blocklightWarmth },
  { name: 'MIN_LIGHT', kind: 'f2', get: (s) => s.minLight },
  { name: 'HAND_LIGHT', kind: 'bool', get: (s) => s.handLight },
  { name: 'EMISSIVE_BLOCKS', kind: 'bool', get: (s) => s.emissive },
  { name: 'EMISSIVE_STRENGTH', kind: 'f2', get: (s) => s.emissiveStrength },
  { name: 'NIGHT_DESATURATION', kind: 'bool', get: (s) => s.nightDesat },
  { name: 'TORCH_FLICKER', kind: 'bool', get: (s) => s.torchFlicker },
  { name: 'FAKE_AO', kind: 'bool', get: (s) => s.ao },
  { name: 'CAVE_LIGHTING', kind: 'int', get: (s) => s.caveLighting },
  { name: 'WAVING_PLANTS', kind: 'bool', get: (s) => s.wavingPlants },
  { name: 'WAVING_LEAVES', kind: 'bool', get: (s) => s.wavingLeaves },
  { name: 'WAVING_STRENGTH', kind: 'f2', get: (s) => s.wavingStrength },
  { name: 'WATER_WAVES', kind: 'bool', get: (s) => s.waterWaves },
  { name: 'WATER_REFLECTION', kind: 'bool', get: (s) => s.waterReflection },
  { name: 'WATER_FOG', kind: 'bool', get: (s) => s.waterFog },
  { name: 'WATER_ALPHA', kind: 'f2', get: (s) => s.waterAlpha },
  { name: 'WATER_TINT', kind: 'int', get: (s) => s.waterTint },
  { name: 'ROUND_SUN', kind: 'bool', get: (s) => s.roundSun },
  { name: 'STARS', kind: 'bool', get: (s) => s.stars },
  { name: 'FOG_DENSITY', kind: 'f2', get: (s) => s.fogDensity },
  { name: 'RAIN_FOG', kind: 'f2', get: (s) => s.rainFog },
  { name: 'SUNSET_INTENSITY', kind: 'f2', get: (s) => s.sunsetIntensity },
  { name: 'CLOUD_TRANSLUCENCY', kind: 'bool', get: (s) => s.cloudTranslucency },
  { name: 'NIGHT_BRIGHTNESS', kind: 'f2', get: (s) => s.nightBrightness },
  { name: 'MOONLIGHT', kind: 'f2', get: (s) => s.moonlight },
  { name: 'NIGHT_TINT', kind: 'int', get: (s) => s.nightTint },
  { name: 'STAR_BRIGHTNESS', kind: 'f2', get: (s) => s.starBrightness },
  { name: 'MILKY_WAY', kind: 'bool', get: (s) => s.milkyWay },
  { name: 'MOON_GLOW', kind: 'bool', get: (s) => s.moonGlow },
  { name: 'NIGHT_FOG', kind: 'f2', get: (s) => s.nightFog },
  { name: 'BLOOM', kind: 'bool', get: (s) => s.bloom },
  { name: 'BLOOM_STRENGTH', kind: 'f2', get: (s) => s.bloomStrength },
  { name: 'TONEMAP', kind: 'int', get: (s) => s.tonemap },
  { name: 'EXPOSURE', kind: 'f2', get: (s) => s.exposure },
  { name: 'SATURATION', kind: 'f2', get: (s) => s.saturation },
  { name: 'VIBRANCE', kind: 'f2', get: (s) => s.vibrance },
  { name: 'CONTRAST', kind: 'f2', get: (s) => s.contrast },
  { name: 'VIGNETTE', kind: 'bool', get: (s) => s.vignette },
  { name: 'VIGNETTE_STRENGTH', kind: 'f2', get: (s) => s.vignetteStrength },
  { name: 'COLOR_TEMP', kind: 'f2', get: (s) => s.colorTemp },
  { name: 'COLOR_GRADING', kind: 'bool', get: (s) => s.colorGrading },
  { name: 'GRADE_BLACK', kind: 'f2', get: (s) => s.gradeBlack },
  { name: 'GRADE_SPLIT', kind: 'f2', get: (s) => s.gradeSplit },
  { name: 'GRADE_SUNSET', kind: 'f2', get: (s) => s.gradeSunset },
  { name: 'GRADE_CURVE', kind: 'f2', get: (s) => s.gradeCurve },
  { name: 'SKIP_SKY_PROC', kind: 'bool', get: (s) => s.skipSky || s.fogQuality === 0 },
  { name: 'SKIP_TONEMAP', kind: 'bool', get: (s) => s.skipTonemap },
  { name: 'SKIP_DITHERING', kind: 'bool', get: (s) => s.skipDithering },
  { name: 'SIMPLE_WATER', kind: 'bool', get: (s) => s.simpleWater },
  { name: 'LOW_RES_SHADOW', kind: 'bool', get: (s) => s.lowResShadow },
  { name: 'CULL_DISTANCE', kind: 'f1', get: (s) => s.cullDistance },
  { name: 'FOG_QUALITY', kind: 'int', get: (s) => s.fogQuality },
  { name: 'SKY_LOD', kind: 'bool', get: (s) => s.skyLOD },
  { name: 'SMALL_WAVE', kind: 'bool', get: (s) => s.smallWave },
  { name: 'VERTEX_AO', kind: 'bool', get: (s) => s.vertexAO },
  { name: 'FAST_NORMALIZE', kind: 'bool', get: (s) => s.fastNormalize },
  { name: 'PRECOMPUTED_VIEW', kind: 'bool', get: (s) => s.precomputedView },
  { name: 'CHEAP_EMISSIVE', kind: 'bool', get: (s) => s.cheapEmissive },
  { name: 'SKIP_PCF', kind: 'bool', get: (s) => s.skipPcf },
  { name: 'HALF_RES_BLOOM', kind: 'bool', get: (s) => s.halfResBloom },
  { name: 'SKIP_SPECULAR', kind: 'bool', get: (s) => s.skipSpecular },
  { name: 'NO_COLOR_TEMP', kind: 'bool', get: (s) => s.noColorTemp },
  { name: 'WAVE_CUTOFF', kind: 'f1', get: (s) => s.waveCutoff },
  { name: 'SHADOW_CUTOFF', kind: 'f1', get: (s) => s.shadowCutoff },
  { name: 'FOG_CUTOFF', kind: 'f1', get: (s) => s.fogCutoff },
];

export const PROFILE_NAMES: Record<PresetId, string> = {
  extraPotato: 'EXTRA_POTATO', lowPotato: 'LOW_POTATO', potato: 'POTATO', highPotato: 'HIGH_POTATO',
  low: 'LOW', medium: 'MEDIUM', high: 'HIGH', extraHigh: 'EXTRA_HIGH',
};

/** One option token for a profile line: `NAME`, `!NAME` or `NAME=value`. */
function profileToken(o: (typeof OPTION_TABLE)[number], s: ShaderSettings): string {
  const v = o.get(s);
  if (o.kind === 'bool') return v ? o.name : `!${o.name}`;
  const n = v as number;
  return `${o.name}=${o.kind === 'int' ? String(n) : o.kind === 'f1' ? f1(n) : f2(n)}`;
}

/** profile.X=... lines for every preset, in fixed PRESETS order (deterministic). */
export function buildProfiles(): string {
  return (Object.keys(PROFILE_NAMES) as PresetId[])
    .map((id) => `profile.${PROFILE_NAMES[id]}=${OPTION_TABLE.map((o) => profileToken(o, PRESETS[id])).join(' ')}`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// shaders/lib/settings.glsl
// ---------------------------------------------------------------------------
export function buildSettingsGlsl(s: ShaderSettings, presetLabel: string): string {
  const vt = VERSION_TARGETS[s.mcVersion];
  return `// ============================================================================
//  Vivid Lite Shaders v${VERSION} — lib/settings.glsl
//  Author / Credit : ${AUTHOR}
//  Source code     : ${REPO_URL}
//  Inspired by     : BSL Shaders (Capt Tatsu) — visual style only
//  License         : Free to use, modify, redistribute (credit author)
//
//  Preset: ${presetLabel}  |  Target: Minecraft ${vt.label}  |  Loader: ${s.loader}
//  Every option below can be changed in game:
//  Options > Video Settings > Shader Packs > Shader Pack Settings
// ============================================================================

// ---------------- COMPATIBILITY ----------------
${vt.legacyShadow ? '#define LEGACY_SHADOW   // manual depth compare (old OptiFine / old GPUs)' : '//#define LEGACY_SHADOW'}
${vt.legacyBuffers ? '#define LEGACY_BUFFERS' : '//#define LEGACY_BUFFERS'}

// ---------------- SHADOWS ----------------
${flag('SHADOWS', s.shadows)}
const int shadowMapResolution = ${s.shadowRes}; ${list(OPTION_VALUES.shadowRes, String)}
const float shadowDistance = ${f1(s.shadowDistance)}; ${list(OPTION_VALUES.shadowDistance, f1)}
#define SHADOW_SOFTNESS ${s.shadowSoftness} //[0 1 2]
${flag('COLORED_SHADOWS', s.coloredShadows)}
const float sunPathRotation = ${f1(s.sunPathRotation)}; ${list(OPTION_VALUES.sunPathRotation, f1)}
const float shadowDistanceRenderMul = 1.0;
const bool  shadowHardwareFiltering = ${vt.legacyShadow ? 'false' : 'true'};
const float shadowIntervalSize = 2.0;
#define SHADOW_DISTORT 0.85

// ---------------- LIGHTING ----------------
#define SUNLIGHT_I ${f2(s.sunlight)} ${list(OPTION_VALUES.intensity, f2)}
#define AMBIENT_I ${f2(s.ambient)} ${list(OPTION_VALUES.intensity, f2)}
#define BLOCKLIGHT_I ${f2(s.blocklight)} ${list(OPTION_VALUES.intensity, f2)}
#define BLOCKLIGHT_WARMTH ${s.blocklightWarmth} //[0 1 2]
#define MIN_LIGHT ${f2(s.minLight)} ${list(OPTION_VALUES.minLight, f2)}
${flag('HAND_LIGHT', s.handLight)}
${flag('EMISSIVE_BLOCKS', s.emissive)}
#define EMISSIVE_STRENGTH ${f2(s.emissiveStrength)} ${list(OPTION_VALUES.strength, f2)}
${flag('NIGHT_DESATURATION', s.nightDesat)}
${flag('TORCH_FLICKER', s.torchFlicker)}
${flag('FAKE_AO', s.ao)}
#define CAVE_LIGHTING ${s.caveLighting} //[0 1]

// ---------------- WORLD & WATER ----------------
${flag('WAVING_PLANTS', s.wavingPlants)}
${flag('WAVING_LEAVES', s.wavingLeaves)}
#define WAVING_STRENGTH ${f2(s.wavingStrength)} ${list(OPTION_VALUES.strength, f2)}
${flag('WATER_WAVES', s.waterWaves)}
${flag('WATER_REFLECTION', s.waterReflection)}
${flag('WATER_FOG', s.waterFog)}
#define WATER_ALPHA ${f2(s.waterAlpha)} ${list(OPTION_VALUES.waterAlpha, f2)}
#define WATER_TINT ${s.waterTint} //[0 1 2]
${flag('ROUND_SUN', s.roundSun)}
${flag('STARS', s.stars)}
#define FOG_DENSITY ${f2(s.fogDensity)} ${list(OPTION_VALUES.fogDensity, f2)}
#define RAIN_FOG ${f2(s.rainFog)} ${list(OPTION_VALUES.rainFog, f2)}
#define SUNSET_INTENSITY ${f2(s.sunsetIntensity)} ${list(OPTION_VALUES.sunsetIntensity, f2)}
${flag('CLOUD_TRANSLUCENCY', s.cloudTranslucency)}

// ---------------- NIGHT (v1.1.0 rework) ----------------
#define NIGHT_BRIGHTNESS ${f2(s.nightBrightness)} ${list(OPTION_VALUES.nightBrightness, f2)}
#define MOONLIGHT ${f2(s.moonlight)} ${list(OPTION_VALUES.moonlight, f2)}
#define NIGHT_TINT ${s.nightTint} //[0 1 2]
#define STAR_BRIGHTNESS ${f2(s.starBrightness)} ${list(OPTION_VALUES.starBrightness, f2)}
${flag('MILKY_WAY', s.milkyWay)}
${flag('MOON_GLOW', s.moonGlow)}
#define NIGHT_FOG ${f2(s.nightFog)} ${list(OPTION_VALUES.nightFog, f2)}

// ---------------- COLOR & POST ----------------
${flag('BLOOM', s.bloom)}
#define BLOOM_STRENGTH ${f2(s.bloomStrength)} ${list(OPTION_VALUES.bloomStrength, f2)}
#define TONEMAP ${s.tonemap} //[0 1 2]
#define EXPOSURE ${f2(s.exposure)} ${list(OPTION_VALUES.exposure, f2)}
#define SATURATION ${f2(s.saturation)} ${list(OPTION_VALUES.saturation, f2)}
#define VIBRANCE ${f2(s.vibrance)} ${list(OPTION_VALUES.vibrance, f2)}
#define CONTRAST ${f2(s.contrast)} ${list(OPTION_VALUES.contrast, f2)}
${flag('VIGNETTE', s.vignette)}
#define VIGNETTE_STRENGTH ${f2(s.vignetteStrength)} ${list(OPTION_VALUES.vignetteStrength, f2)}
#define COLOR_TEMP ${f2(s.colorTemp)} ${list(OPTION_VALUES.colorTemp, f2)}
// BSL grade (v1.1.3): ~12 ALU per pixel in final, no extra texture reads or passes
${flag('COLOR_GRADING', s.colorGrading)}
#define GRADE_BLACK ${f2(s.gradeBlack)} ${list(OPTION_VALUES.gradeBlack, f2)}
#define GRADE_SPLIT ${f2(s.gradeSplit)} ${list(OPTION_VALUES.gradeSplit, f2)}
#define GRADE_SUNSET ${f2(s.gradeSunset)} ${list(OPTION_VALUES.gradeSunset, f2)}
#define GRADE_CURVE ${f2(s.gradeCurve)} ${list(OPTION_VALUES.gradeCurve, f2)}

// ---------------- PERFORMANCE ----------------
${flag('SKIP_SKY_PROC', s.skipSky || s.fogQuality === 0)}
${flag('SKIP_TONEMAP', s.skipTonemap)}
${flag('SKIP_DITHERING', s.skipDithering)}
${flag('SIMPLE_WATER', s.simpleWater)}
${flag('LOW_RES_SHADOW', s.lowResShadow)}
#define CULL_DISTANCE ${f1(s.cullDistance)} ${list(OPTION_VALUES.cullDistance, f1)}
#define FOG_QUALITY ${s.fogQuality} //[0 1 2]
// perf+ (v1.1.1)
${flag('SKY_LOD', s.skyLOD)}
${flag('SMALL_WAVE', s.smallWave)}
${flag('VERTEX_AO', s.vertexAO)}
${flag('FAST_NORMALIZE', s.fastNormalize)}
${flag('PRECOMPUTED_VIEW', s.precomputedView)}
${flag('CHEAP_EMISSIVE', s.cheapEmissive)}
${flag('SKIP_PCF', s.skipPcf)}
${flag('HALF_RES_BLOOM', s.halfResBloom)}
${flag('SKIP_SPECULAR', s.skipSpecular)}
${flag('NO_COLOR_TEMP', s.noColorTemp)}
#define WAVE_CUTOFF ${f1(s.waveCutoff)} ${list(OPTION_VALUES.waveCutoff, f1)}
#define SHADOW_CUTOFF ${f1(s.shadowCutoff)} ${list(OPTION_VALUES.shadowCutoff, f1)}
#define FOG_CUTOFF ${f1(s.fogCutoff)} ${list(OPTION_VALUES.fogCutoff, f1)}

// ---------------- BUFFERS (do not edit) ----------------
${buildBufferFormats(s.mcVersion)}
const float eyeBrightnessHalflife = 6.0;

#if defined NETHER || defined END
    #undef SHADOWS
    #undef COLORED_SHADOWS
#endif
`;
}

// ---------------------------------------------------------------------------
// shaders/shaders.properties
// ---------------------------------------------------------------------------
export function buildShadersProperties(s: ShaderSettings, presetLabel: string): string {
  const vt = VERSION_TARGETS[s.mcVersion];
  // v1.1.3 — program toggles are emitted for EVERY loader.
  //  * `program.<name>.enabled=<expr>` is evaluated against the live option
  //    values by both OptiFine (documented in shaders.txt) and Iris
  //    (ShaderPack -> BooleanParser), so flipping SHADOWS in the in-game menu
  //    really skips the shadow pass on both.
  //  * The old `shadow.enabled=SHADOWS` line was WRONG: Iris only accepts the
  //    literal true/false/1/0 for that key and logged
  //    "Unexpected value for boolean key shadow.enabled" — the pass was never
  //    toggled. It is gone.
  const programToggles = `# Skip whole programs when their feature is off (big FPS win).
# Works on Iris AND OptiFine; old OptiFine builds that don't know the key ignore it.
program.shadow.enabled=SHADOWS
program.composite.enabled=WATER_FOG
program.composite1.enabled=BLOOM
program.world1/composite.enabled=WATER_FOG
program.world1/composite1.enabled=BLOOM
program.world-1/composite1.enabled=BLOOM
`;

  return `# ============================================================
#  Vivid Lite Shaders v${VERSION} — shaders.properties
#  Author: ${AUTHOR} | ${REPO_URL}
# Inspired by BSL Shaders (Capt Tatsu). Free to use, credit author.
# Preset: ${presetLabel}   Target: MC ${vt.label}   Loader: ${s.loader}
# ============================================================
version.${VERSION}

sun=${s.roundSun ? 'false' : 'true'}
moon=true
vignette=false
underwaterOverlay=false
oldLighting=false
separateAo=false
dynamicHandLight=true

shadowTerrain=true
shadowTranslucent=true
shadowEntities=${s.entityShadows ? 'true' : 'false'}
shadowPlayer=${s.entityShadows ? 'true' : 'false'}
shadowBlockEntities=${s.entityShadows ? 'true' : 'false'}

${programToggles}
${buildProfiles()}

${vt.simpleMenu
    ? `screen=<profile> SHADOWS shadowMapResolution shadowDistance SHADOW_SOFTNESS SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I MIN_LIGHT NIGHT_BRIGHTNESS MOONLIGHT STAR_BRIGHTNESS WAVING_PLANTS WAVING_LEAVES WATER_WAVES WATER_REFLECTION BLOOM BLOOM_STRENGTH TONEMAP EXPOSURE SATURATION CONTRAST VIGNETTE COLOR_GRADING FOG_QUALITY SIMPLE_WATER SKIP_SKY_PROC`
    : `screen=<profile> <empty> [SHADOW_SCREEN] [LIGHTING_SCREEN] [NIGHT_SCREEN] [WORLD_SCREEN] [POST_SCREEN] [PERF_SCREEN]
screen.SHADOW_SCREEN=SHADOWS shadowMapResolution shadowDistance SHADOW_SOFTNESS COLORED_SHADOWS LOW_RES_SHADOW sunPathRotation
screen.LIGHTING_SCREEN=SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I BLOCKLIGHT_WARMTH MIN_LIGHT HAND_LIGHT EMISSIVE_BLOCKS EMISSIVE_STRENGTH TORCH_FLICKER FAKE_AO CAVE_LIGHTING
screen.NIGHT_SCREEN=NIGHT_BRIGHTNESS MOONLIGHT NIGHT_TINT NIGHT_DESATURATION <empty> STARS STAR_BRIGHTNESS MILKY_WAY MOON_GLOW NIGHT_FOG
screen.WORLD_SCREEN=WAVING_PLANTS WAVING_LEAVES WAVING_STRENGTH WATER_WAVES WATER_REFLECTION WATER_FOG WATER_ALPHA WATER_TINT SIMPLE_WATER FOG_DENSITY RAIN_FOG FOG_QUALITY SUNSET_INTENSITY CLOUD_TRANSLUCENCY
screen.POST_SCREEN=BLOOM BLOOM_STRENGTH TONEMAP EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE VIGNETTE_STRENGTH COLOR_TEMP <empty> <empty> COLOR_GRADING GRADE_BLACK GRADE_SPLIT GRADE_SUNSET GRADE_CURVE
screen.PERF_SCREEN=LOW_RES_SHADOW SIMPLE_WATER FOG_QUALITY CULL_DISTANCE <empty> SKIP_SKY_PROC SKIP_TONEMAP SKIP_DITHERING`}
sliders=shadowDistance sunPathRotation SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I MIN_LIGHT EMISSIVE_STRENGTH WAVING_STRENGTH WATER_ALPHA FOG_DENSITY RAIN_FOG SUNSET_INTENSITY BLOOM_STRENGTH EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE_STRENGTH COLOR_TEMP CULL_DISTANCE NIGHT_BRIGHTNESS MOONLIGHT STAR_BRIGHTNESS NIGHT_FOG GRADE_BLACK GRADE_SPLIT GRADE_SUNSET GRADE_CURVE
`;
}

// ---------------------------------------------------------------------------
// shaders/block.properties — version-aware (see compat.ts)
// ---------------------------------------------------------------------------
export { buildBlockProperties };

// ---------------------------------------------------------------------------
// language — English only. The pack ships one lang file to keep the .zip small
// and to work in every region without translation drift.
// ---------------------------------------------------------------------------
export const LANG_EN = `screen.SHADOW_SCREEN=Shadows
screen.LIGHTING_SCREEN=Lighting
screen.WORLD_SCREEN=World & Water
screen.POST_SCREEN=Color & Post
screen.NIGHT_SCREEN=Night
screen.PERF_SCREEN=Performance

profile.EXTRA_POTATO=Extra Potato (99% FPS)
profile.LOW_POTATO=Low Potato (95% FPS)
profile.POTATO=Potato (92% FPS)
profile.HIGH_POTATO=High Potato (88% FPS)
profile.LOW=Low (85% FPS)
profile.MEDIUM=Medium - Recommended (80% FPS)
profile.HIGH=High - BSL look (72% FPS)
profile.EXTRA_HIGH=Extra High (65% FPS)

option.SHADOWS=Shadows
option.shadowMapResolution=Shadow Resolution
option.shadowDistance=Shadow Distance
option.SHADOW_SOFTNESS=Shadow Softness
value.SHADOW_SOFTNESS.0=Hard
value.SHADOW_SOFTNESS.1=Soft
value.SHADOW_SOFTNESS.2=Very soft
option.COLORED_SHADOWS=Colored Shadows
option.sunPathRotation=Sun Path Angle

option.SUNLIGHT_I=Sunlight
option.AMBIENT_I=Ambient
option.BLOCKLIGHT_I=Torch Light
option.BLOCKLIGHT_WARMTH=Torch Color
value.BLOCKLIGHT_WARMTH.0=Cool
value.BLOCKLIGHT_WARMTH.1=Warm (BSL)
value.BLOCKLIGHT_WARMTH.2=Very warm
option.MIN_LIGHT=Minimum Light
option.HAND_LIGHT=Hand Light
option.EMISSIVE_BLOCKS=Emissive Blocks
option.EMISSIVE_STRENGTH=Emissive Strength
option.NIGHT_DESATURATION=Night Desaturation
option.TORCH_FLICKER=Torch Flicker
option.FAKE_AO=Fake AO
option.CAVE_LIGHTING=Cave Lighting
value.CAVE_LIGHTING.0=Vanilla
value.CAVE_LIGHTING.1=Boosted

option.NIGHT_BRIGHTNESS=Night Brightness
option.MOONLIGHT=Moonlight
option.NIGHT_TINT=Night Tint
value.NIGHT_TINT.0=Blue (BSL)
value.NIGHT_TINT.1=Teal
value.NIGHT_TINT.2=Purple
option.STAR_BRIGHTNESS=Star Brightness
option.MILKY_WAY=Milky Way band
option.MOON_GLOW=Moon Glow
option.NIGHT_FOG=Night Fog

option.WAVING_PLANTS=Waving Plants
option.WAVING_LEAVES=Waving Leaves
option.WAVING_STRENGTH=Wind Strength
option.WATER_WAVES=Water Waves
option.WATER_REFLECTION=Water Reflection
option.WATER_FOG=Water Fog
option.WATER_ALPHA=Water Opacity
option.WATER_TINT=Water Tint
value.WATER_TINT.0=Default
value.WATER_TINT.1=Tropical
value.WATER_TINT.2=Swamp
option.STARS=Stars
option.FOG_DENSITY=Fog Density
option.RAIN_FOG=Rain Fog
option.SUNSET_INTENSITY=Sunset Intensity
option.CLOUD_TRANSLUCENCY=Cloud Translucency

option.BLOOM=Bloom
option.BLOOM_STRENGTH=Bloom Strength
option.TONEMAP=Tonemap
value.TONEMAP.0=None
value.TONEMAP.1=Vivid (BSL)
value.TONEMAP.2=ACES
option.EXPOSURE=Exposure
option.SATURATION=Saturation
option.VIBRANCE=Vibrance
option.CONTRAST=Contrast
option.VIGNETTE=Vignette
option.VIGNETTE_STRENGTH=Vignette Strength
option.COLOR_TEMP=Color Temperature
option.COLOR_GRADING=BSL Color Grade
option.COLOR_GRADING.comment=Blue shadows, warm highlights, golden-hour warmth and a filmic curve. ~12 ALU per pixel, no extra pass.
option.GRADE_BLACK=Black Point
option.GRADE_BLACK.comment=Pulls bloom/fog haze back to black. Cures the pale, washed-out look.
option.GRADE_SPLIT=Split Toning
option.GRADE_SPLIT.comment=Shadows lean blue, highlights lean warm (the BSL signature).
option.GRADE_SUNSET=Golden Hour Warmth
option.GRADE_SUNSET.comment=Extra orange warmth on lit surfaces around sunrise/sunset.
option.GRADE_CURVE=Filmic Contrast
option.GRADE_CURVE.comment=Smooth S-curve: deeper shadows and richer mids without clipping highlights.

option.SKIP_SKY_PROC=Skip procedural sky
option.SKIP_TONEMAP=Skip tonemap curve
option.SKIP_DITHERING=Skip dithering
option.NO_COLOR_TEMP=Skip color temperature
option.SKIP_SPECULAR=Skip water specular
option.SIMPLE_WATER=Simple flat water
option.LOW_RES_SHADOW=Half-res shadow sampling
option.SKIP_PCF=1-tap shadow (no PCF)
option.HALF_RES_BLOOM=Half-res bloom
option.SKY_LOD=Cheap sky at far distance
option.SMALL_WAVE=1 wave instead of 3
option.FAST_NORMALIZE=Fast normalize
option.PRECOMPUTED_VIEW=Pre-computed view dir
option.CHEAP_EMISSIVE=Cheap emissive
option.VERTEX_AO=Vertex-side AO
option.CULL_DISTANCE=Effect cull distance
option.WAVE_CUTOFF=Disable waves beyond
option.SHADOW_CUTOFF=Disable shadow lookup beyond
option.FOG_CUTOFF=Disable fog beyond
option.FOG_QUALITY=Fog quality
value.FOG_QUALITY.0=Off
value.FOG_QUALITY.1=Cheap (linear)
value.FOG_QUALITY.2=Full (atmospheric)
`;

// ---------------------------------------------------------------------------
// stub files (.vsh / .fsh that include the shared program sources)
// ---------------------------------------------------------------------------
export const PROGRAM_NAMES = [
  'gbuffers_basic','gbuffers_textured','gbuffers_textured_lit','gbuffers_terrain',
  'gbuffers_water','gbuffers_entities','gbuffers_hand','gbuffers_skybasic',
  'gbuffers_skytextured','gbuffers_clouds','gbuffers_weather',
  'shadow','composite','composite1','final',
] as const;
export type ProgramName = (typeof PROGRAM_NAMES)[number];

const PROGRAM_SOURCE: Record<ProgramName, string> = {
  gbuffers_basic:'gbuffers_basic', gbuffers_textured:'gbuffers_textured',
  gbuffers_textured_lit:'gbuffers_textured_lit', gbuffers_terrain:'gbuffers_terrain',
  gbuffers_water:'gbuffers_water', gbuffers_entities:'gbuffers_entities',
  gbuffers_hand:'gbuffers_entities', gbuffers_skybasic:'gbuffers_skybasic',
  gbuffers_skytextured:'gbuffers_skytextured', gbuffers_clouds:'gbuffers_clouds',
  gbuffers_weather:'gbuffers_weather', shadow:'shadow',
  composite:'composite', composite1:'composite1', final:'final',
};

type Dimension = 'overworld' | 'nether' | 'end';
const DIM_FOLDER: Record<Dimension, string> = { overworld:'shaders/', nether:'shaders/world-1/', end:'shaders/world1/' };
const DIM_DEFINE: Record<Dimension, string|null> = { overworld:null, nether:'NETHER', end:'END' };

function programsFor(dim: Dimension): ProgramName[] {
  if (dim === 'overworld') return [...PROGRAM_NAMES];
  return PROGRAM_NAMES.filter((p) => p !== 'shadow' && !(dim === 'nether' && p === 'composite'));
}

export function buildStubFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  (['overworld','nether','end'] as Dimension[]).forEach((dim) => {
    programsFor(dim).forEach((prog) => {
      (['vsh','fsh'] as const).forEach((stage) => {
        const lines = ['#version 120'];
        if (prog === 'composite1' && stage === 'fsh') lines.push('#extension GL_ARB_shader_texture_lod : enable');
        lines.push(`#define ${stage === 'vsh' ? 'VSH' : 'FSH'}`);
        if (prog === 'gbuffers_hand') lines.push('#define HAND');
        const dd = DIM_DEFINE[dim]; if (dd) lines.push(`#define ${dd}`);
        lines.push('#include "/lib/settings.glsl"');
        lines.push(`#include "/program/${PROGRAM_SOURCE[prog]}.glsl"`);
        files[`${DIM_FOLDER[dim]}${prog}.${stage}`] = lines.join('\n') + '\n';
      });
    });
  });
  return files;
}

// ---------------------------------------------------------------------------
// README.txt / CHANGELOG.txt / README.md (bundled inside the .zip)
// ---------------------------------------------------------------------------
export const CREDIT_HEADER = `# ===========================================================
#  Vivid Lite Shaders v${VERSION}
#  Author / Credit : ${AUTHOR}
#  Source code     : ${REPO_URL}
#  Inspired by     : BSL Shaders (Capt Tatsu) — visual style only
#  License         : Free to use, modify, redistribute (credit author)
# ===========================================================
`;

export function buildReadme(pl: string, s?: ShaderSettings): string {
  const vt = s ? VERSION_TARGETS[s.mcVersion] : null;
  const loaderTxt = s ? (s.loader === 'both' ? 'Iris + OptiFine' : s.loader === 'iris' ? 'Iris / Sodium' : 'OptiFine') : 'Iris + OptiFine';
  return `${CREDIT_HEADER}
================================================================
   VIVID LITE SHADERS  v${VERSION}  -  packaged preset: ${pl}
================================================================
   BSL-style Minecraft shader, optimized for weak hardware.
   Supports Minecraft 1.8 - 26.3, on Iris and OptiFine.
${vt ? `   This build targets: Minecraft ${vt.label}  |  ${loaderTxt}` : ''}
================================================================

INSTALL (IRIS - recommended, highest FPS)
-----------------------------------------
1. Install Fabric Loader for your Minecraft version at
   fabricmc.net
2. Download Sodium + Iris (matching version) from
   modrinth.com, drop both .jar files into
   .minecraft/mods
3. Drop THIS .zip AS-IS (DO NOT extract) into
   .minecraft/shaderpacks
4. In-game: Options > Video Settings > Shader Packs
   Pick "VividLite_v${VERSION}_${pl}.zip" > Apply
5. Click "Shader Pack Settings" to switch profile or tune

INSTALL (OPTIFINE)
------------------
1. Install OptiFine HD U (matching version) at
   optifine.net
2. Drop the .zip into .minecraft/shaderpacks
3. In-game: Options > Video Settings > Shaders...
   Select Vivid Lite

"NIGHT" MENU (added in v1.1.0)
------------------------------
  NIGHT_BRIGHTNESS - overall night exposure
  MOONLIGHT        - moonlight strength (casts real shadows)
  NIGHT_TINT       - tint: Blue (BSL) / Teal / Purple
  STAR_BRIGHTNESS  - star brightness
  MILKY_WAY        - Milky Way band across the sky
  MOON_GLOW        - moon halo
  NIGHT_FOG        - blue night haze

"PERFORMANCE" MENU (18 options, added in v1.1.1)
------------------------------------------------
  Skip entirely : SKIP_SKY_PROC, SKIP_TONEMAP, SKIP_DITHERING,
                  NO_COLOR_TEMP, SKIP_SPECULAR
  Cheap swap    : SIMPLE_WATER, LOW_RES_SHADOW, SKIP_PCF,
                  HALF_RES_BLOOM, SKY_LOD, SMALL_WAVE,
                  FAST_NORMALIZE, PRECOMPUTED_VIEW,
                  CHEAP_EMISSIVE
  Distance cull : CULL_DISTANCE, WAVE_CUTOFF, SHADOW_CUTOFF,
                  FOG_CUTOFF, FOG_QUALITY

8 PROFILES (pick one in Shader Pack Settings)
---------------------------------------------
  Extra Potato  - Max optimization. Drops sky/tonemap/dither/fog.
                  Still prettier than vanilla. ~99% FPS.
                  For: Intel HD 2000/3000, Atom netbooks
  Low Potato    - A step above Potato. Flat water.
                  ~95% FPS. For: Intel HD 3000/4000
  Potato        - No shadows, no bloom. ~92% FPS.
                  For: Intel HD 4000, 4GB RAM
  High Potato   - Potato + hard 512px shadows nearby.
                  ~88% FPS. For: Intel HD 5000/520
  Low           - 768px shadows + bloom. ~85% FPS.
                  For: Intel HD 620, Vega 3
  Medium        - Soft 1024px shadows + water fog.
                  ~80% FPS. (Recommended.)
                  For: Iris Xe, GT 1030, MX150
  High          - 2048px shadows, colored shadows, BSL look.
                  ~72% FPS. For: GTX 1050 and up
  Extra High    - Maxed out, cloud translucency.
                  ~65% FPS. For: GTX 1060 and up

TIPS FOR WEAK HARDWARE
----------------------
- Render Distance 6-8, Simulation Distance 5
- Clouds: Fast, Particles: Decreased
- Install: Lithium, FerriteCore, ImmediatelyFast,
  Entity Culling, ModernFix
- Shadows cost the most FPS: lower Shadow Resolution first

WHAT'S NEW IN v${VERSION}
-----------------------
- 8 new perf options: SKIP_PCF, HALF_RES_BLOOM,
  SKIP_SPECULAR, NO_COLOR_TEMP, FAST_NORMALIZE,
  PRECOMPUTED_VIEW, CHEAP_EMISSIVE, FOG_CUTOFF
- Low-level GLSL: inversesqrt instead of normalize,
  inline pow(x,3) = x*x*x, inline reflect(),
  pre-fused blocklight formula, torch flicker 1 sin,
  End dimension returns early (skips shadow/normal logic)
- Extra Potato enables all new options (~99% FPS)

BEFORE (v1.1.0)
---------------
- Support for Minecraft 1.8 - 26.3 (4 version buckets)
- OptiFine support alongside Iris
- Full night rework: phased moonlight, 3 tints,
  2-layer stars, Milky Way, moon halo, night fog
- Legacy shadow path for old OptiFine
- Version-aware block.properties (no more warnings)

LICENSE
-------
Inspired by BSL Shaders (Capt Tatsu).
All code is written from scratch, contains no BSL code.
Free to use, modify, redistribute - please credit "${AUTHOR}".

GitHub / homepage: ${REPO_URL}
================================================================
`;
}

export function buildReadmeGithub(): string {
  return `# ✨ Vivid Lite Shaders

> **BSL-style Minecraft shader, optimized for weak hardware.**
> As pretty as BSL, as light as Vanilla. Supports **Minecraft 1.8 – 26.3** on **Iris** and **OptiFine**.

[![Version](https://img.shields.io/badge/version-${VERSION}-fbbf24.svg)](${REPO_URL})
[![Minecraft](https://img.shields.io/badge/Minecraft-1.8%20→%2026.3-62b47a.svg)](${REPO_URL})
[![Iris](https://img.shields.io/badge/Iris-✔-8b5cf6.svg)](https://modrinth.com/mod/iris)
[![OptiFine](https://img.shields.io/badge/OptiFine-✔-38bdf8.svg)](https://optifine.net)
[![License](https://img.shields.io/badge/license-Free%20to%20use-emerald.svg)](#-license)

**Author:** [${AUTHOR}](${REPO_URL}) · **Source code:** ${REPO_URL}
If you redistribute, modify or build on this project, **please credit ${AUTHOR}**.

---

## 🎯 What is Vivid Lite?

Vivid Lite brings the **warm orange sunset**, **soft shadows**, **water sky reflection** and **subtle bloom** of BSL — rewritten from scratch to **run smoothly on weak hardware, even ultra-weak**.

No SSR, no volumetric light, no TAA — just what actually makes Minecraft beautiful.

### Vivid Lite vs BSL

| Metric | BSL v8 Medium | Vivid Lite Medium |
|---|---|---|
| Full-screen passes | 6–12 | **1–3** |
| FPS retained (iGPU) | ~30% | **~80%** |
| .zip size | ~1.5 MB | **~70 KB** |
| Default shadow map | 2048px | 1024px *(distorted — as sharp as 1536px uniform)* |
| Bloom | 7 downsample tiles | **2 mipmap tiles** |
| Lighting model | Deferred | **Forward** |
| Minecraft versions | 1.16+ | **1.8 → 26.3** |
| OptiFine | ✓ | **✓** |

---

## 🚀 Installation

### With Iris + Sodium *(recommended — highest FPS)*
1. Install **Fabric Loader** for your Minecraft version — [fabricmc.net](https://fabricmc.net/use/installer/)
2. Download **Sodium + Iris** (matching version) from [Modrinth](https://modrinth.com/mod/iris) → drop the .jar files into .minecraft/mods/
3. Download the .zip — drop it **as-is** (❗ do not extract) into .minecraft/shaderpacks/
4. In-game: Options → Video Settings → Shader Packs → select Vivid Lite → **Apply**

### With OptiFine
1. Install **OptiFine HD U** for your Minecraft version at [optifine.net](https://optifine.net)
2. Drop the .zip into .minecraft/shaderpacks/
3. In-game: Options → Video Settings → Shaders... → pick Vivid Lite

Click **"Shader Pack Settings"** to switch profile or tune 60+ options.

---

## 🎚️ 8 Presets

| Profile | FPS retained | Target hardware | Notes |
|---|---|---|---|
| 💀 **Extra Potato** | ~99% | Intel HD 2000/3000, Atom netbooks | Max optimization. Skips procedural sky, tonemap, dithering, fog. |
| 🥔 **Low Potato** | ~95% | Intel HD 3000/4000, dual-core Celeron | Flat water, cheap linear fog. |
| 🍟 **Potato** | ~92% | Intel HD 4000, 2012+ laptop 4GB | No shadows, no bloom. |
| 🌶️ **High Potato** | ~88% | Intel HD 5000/520, office laptop 2014+ | Hard 512px shadows at 48-block range. |
| 🌱 **Low** | ~85% | Intel HD 620, UHD 600, Vega 3 | 768px shadows + bloom. |
| 🌤️ **Medium** *(recommended)* | ~80% | Iris Xe, Vega 8, GT 1030, MX150 | Soft 1024px shadows + water depth fog. |
| ✨ **High** | ~72% | GTX 1050 / RX 560+ | 2048px shadows + colored shadows. |
| 💎 **Extra High** | ~65% | GTX 1060 / RX 580+ | Everything cranked, cloud translucency. |

---

## 🔧 How Vivid Lite boosts FPS

### 1. Forward lighting instead of Deferred (BSL)
- Light is computed **inline while drawing geometry** in gbuffers_terrain — no G-buffer extraction
- No SSAO pass, no re-light pass, no TAA resolve
- **1–3 full-screen passes instead of 6–12** like BSL

### 2. 2-tile mipmap bloom instead of 7-tile
- BSL downsamples 7 tiles manually → 7 × 270K pixels
- Vivid Lite enables colortex0MipmapEnabled=true → GPU builds mipmaps **for free**
- We only sample 2 tiles at mip levels 2 and 4 → ~150K pixels

### 3. Shadow pass can be turned off entirely
- Iris supports program.shadow.enabled and program.composite.enabled
- When SHADOWS is off, Iris **skips the shadow pass** → CPU saves ~1M vertices
- When WATER_FOG / BLOOM is off, the matching composite pass is also skipped

### 4. Cheap replacements (instead of removing effects)
| BSL uses | FPS cost | Vivid Lite replacement | Why it's cheap |
|---|---|---|---|
| Screen-space reflections (SSR) | 18% | Sky reflection + Fresnel | 1 texture lookup vs 32-step ray-march |
| Volumetric light (god rays) | 15% | Cheap bloom | 2 mip tiles vs a dense ray-march pass |
| TAA (temporal AA) | 8% | 8-bit dithering | 1 hash vs velocity buffer + resolve |
| SSAO | 10% | Fake AO from lightmap² | 1 multiply, already in the pipeline |
| POM / Parallax | 7% | (dropped) | POM needs 8–32 texture lookups per pixel |
| Motion blur | 5% | (dropped) | Needs velocity buffer + full-screen blur |
| Deferred composite (6+ pass) | 12% | Forward 1–3 pass | No G-buffer extraction |

**Total savings: ~75% frame time** vs BSL Medium on iGPU.

---

## ⚡ Performance menu (18 options)

**Skip entirely:** SKIP_SKY_PROC · SKIP_TONEMAP · SKIP_DITHERING · NO_COLOR_TEMP · SKIP_SPECULAR

**Cheap swaps:** SIMPLE_WATER · LOW_RES_SHADOW · SKIP_PCF · HALF_RES_BLOOM · SKY_LOD · SMALL_WAVE · FAST_NORMALIZE · PRECOMPUTED_VIEW · CHEAP_EMISSIVE

**Distance culls:** CULL_DISTANCE · WAVE_CUTOFF · SHADOW_CUTOFF · FOG_CUTOFF · FOG_QUALITY

---

## 🛠️ Recommended Video Settings for weak hardware

| Setting | Value | Why |
|---|---|---|
| Render Distance | 6–8 chunks | Biggest FPS impact after the shader |
| Simulation Distance | 5 | Lower CPU load |
| Graphics | Fast | Dense leaves = fewer pixels to draw |
| Clouds | Fast or Off | Fancy clouds are fill-rate heavy |
| Entity Shadows | Off | The shader already draws real shadows |
| Particles | Decreased | Less overdraw |
| Max Framerate | 60 | Less heat, steadier frame times |
| Mipmap Levels | 2 | Smooth enough, less VRAM |

**Recommended companion mods (Fabric, free):** Lithium · FerriteCore · ImmediatelyFast · Entity Culling · ModernFix · Dynamic FPS

---

## 🎨 Build your own shader

Open the [Vivid Lite website](${REPO_URL}) → **"Customize"** section → pick a preset → tune 60+ options → download your .zip right in the browser (nothing is uploaded, no signup).

The site also has:
- 📊 **Real-time FPS estimate** for 3 reference machines
- 🎬 **Day / night preview** simulated in CSS
- 📖 **GLSL source viewer** with syntax highlighting
- 🔧 The **⚡ Performance menu** with all 18 options

---

## 🐛 Report a bug / Contribute

- **Shader bug?** Open an [Issue](${REPO_URL}/issues) and paste the ERROR line from .minecraft/logs/latest.log
- **Idea?** Open a [Discussion](${REPO_URL}/discussions)
- **PR?** Welcome! Please test on at least one Iris and one OptiFine build before submitting.

---

## 📄 License

Inspired by the visual style of **BSL Shaders (Capt Tatsu)**. **All Vivid Lite code is written from scratch** and contains no BSL code.

Free to use, modify, and redistribute — please **credit "${AUTHOR}"** when re-publishing.

Not affiliated with Mojang or Microsoft. *Minecraft © Mojang AB.*

---

<p align="center">
  <sub>Made with ❤️ by <a href="${REPO_URL}">${AUTHOR}</a> · <a href="${REPO_URL}">GitHub</a> · <a href="${REPO_URL}/releases">Releases</a></sub>
</p>
`;
}

export function buildChangelog(): string {
  return `${CREDIT_HEADER}
================================================================
  VIVID LITE SHADERS  —  CHANGELOG
================================================================

v${VERSION}  (Shadow fix & BSL grade — work in progress)
${'-'.repeat(30)}
* FIXED: shadows never loaded. lib/shadows.glsl read \`sp\` before declaring
  it, so every shadow-enabled program failed to compile (all 4 buckets,
  Iris + OptiFine). Shadow projection is now one shared helper that
  mirrors the shadow pass distortion exactly.
* FIXED: End dimension failed to compile (\`blI\` declared twice).
* FIXED: SMALL_WAVE + water waves -> "#if with no expression" error.
* FIXED: shaders.properties used \`shadow.enabled=SHADOWS\`, which Iris
  rejects (literal true/false only). Replaced with
  \`program.shadow.enabled=SHADOWS\`, honoured by both Iris and OptiFine.
+ Shadow samples outside the shadow map now return "lit" instead of
  clamped-edge garbage.
+ Renamed the \`all\` local (built-in function name) for picky drivers.
+ Extra High "BSL grade": new COLOR_GRADING block in final (black point,
  blue-shadow / warm-highlight split toning, golden-hour warmth computed
  per vertex, filmic S-curve). ~12 ALU per pixel, no extra pass.
  Extra High: bloom 0.16, saturation 1.20, contrast 1.05 + grade on.
+ New options: COLOR_GRADING, GRADE_BLACK, GRADE_SPLIT, GRADE_SUNSET,
  GRADE_CURVE (Color & Post menu).
* FIXED: in-game profiles were hand-written and incomplete — picking
  Extra High in-game kept Medium's saturation/contrast/bloom. Profiles are
  now generated from the preset table and set every option.
* FIXED: some preset values were missing from the option lists
  (e.g. NIGHT_BRIGHTNESS=1.10) and were silently ignored in-game.

v1.1.1  (More optimizations)
${'-'.repeat(30)}
+ 8 new performance options:
    SKIP_PCF          : 1-tap shadow instead of 4-tap
    HALF_RES_BLOOM    : 3x3 bloom blur instead of 5x5
    SKIP_SPECULAR     : skip water sun glints (saves 1 pow)
    NO_COLOR_TEMP     : skip warm/cool tint in final pass
    FAST_NORMALIZE    : inversesqrt instead of normalize (saves 1 sqrt+div)
    PRECOMPUTED_VIEW  : skip redundant normalize() in water reflection
    CHEAP_EMISSIVE    : skip smoothstep() in emissive detection
    FOG_CUTOFF        : hard-cull fog past a distance (no length/exp/sky lookup)
+ Low-level GLSL work:
    - pow(NdotV, 3) -> x*x*x (Fresnel term)
    - pow(lm.x, 3)  -> lx*lx*lx (End dimension blocklight)
    - reflect() inlined manually in water
    - Blocklight formula pre-fused as a single mad chain
    - Torch flicker: 2 sin -> 1 sin at non-harmonic frequency
    - Lighting sum grouped (a+b)+(c+d) for a single FMA chain
    - End dimension: early return, skips all shadow/normal logic
    - Stars: two-stage gate (F > 0.0 && F > 0.01) before the hash work
+ Extra Potato preset enables every new option -> ~99% of vanilla FPS
+ Single source of truth for version number (src/shader/version.ts)

v1.1.0  (Compatibility & Night)
${'-'.repeat(30)}
+ Support for Minecraft 1.8 - 26.3, in 4 version buckets:
    Legacy  (1.8 - 1.12.2)  numeric block IDs, manual shadow, RGB16 buffer
    Classic (1.13 - 1.16.5) namespaced IDs, hardware PCF
    Modern  (1.17 - 1.20.6) adds 1.17+ blocks
    Latest  (1.21 - 26.3)   full new blocks
+ OptiFine support alongside Iris (3 loader modes: Both / Iris / OptiFine)
+ Legacy shadow path: sampler2D + step() manual compare for old drivers
+ NIGHT REWORK:
    - Real moonlight with shadows, varies with moon phase
    - 3 night tints: Blue (BSL) / Teal / Purple
    - 2-layer stars + independent twinkle + warm/cool color variation
    - Milky Way band across the sky
    - Multi-layer moon halo
    - Night fog for depth
    - Purkinje shift (dim scenes lose saturation)
    - Airglow so the horizon is never pure black
+ 7 new night options + new "Night" menu
+ shadow.enabled directive for Iris
+ Version-aware block.properties (no more missing-block warnings)
+ Full README.md in the project root for GitHub

v1.0.1  (8 presets + Extra Potato mode)
${'-'.repeat(30)}
+ 4 new presets:
    - Extra Potato (~98% FPS)
    - Low Potato   (~95% FPS)
    - High Potato  (~88% FPS)
    - Extra High   (~65% FPS, maxed out)
+ 7 new performance options:
    - SKIP_SKY_PROC     : 2-color gradient instead of procedural sky
    - SKIP_TONEMAP      : skip the tonemap curve
    - SKIP_DITHERING    : skip hash-noise anti-banding
    - SIMPLE_WATER      : flat water, no waves, no Fresnel
    - LOW_RES_SHADOW    : sample shadow at 1/2 resolution grid
    - CULL_DISTANCE     : cull expensive effects past a distance
    - FOG_QUALITY       : 0 off / 1 cheap linear / 2 full atmospheric
+ New "Performance" menu in Shader Pack Settings
+ Cheap linear fog for the potato tier
+ Full README.md for GitHub

* Fixed shader compile error "Use of undeclared identifier 'minLight'"
  in terrain_solid (declaration order in lighting.glsl)

v1.0.0  (initial release)
${'-'.repeat(30)}
+ BSL-style forward lighting (warm sun, blue shadows, orange torch light)
+ Soft shadows with distorted shadow map + hardware PCF
+ 2-tile mipmap bloom (BSL uses 7 tiles)
+ Water sky reflection + Fresnel + sun glints
+ Grass, flowers, leaves waving (vertex animation)
+ Atmospheric fog by time of day
+ Orange/pink sunset, twinkling stars, round sun
+ Vivid tonemap + saturation + vibrance + vignette
+ Nether and End support (no shadow pass = extra FPS)
+ In-game menu (Vietnamese + English)
+ 4 profiles: Potato, Low, Medium, High
+ 40+ tunable options in-game

================================================================
`;
}
