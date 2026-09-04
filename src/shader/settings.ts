// ============================================================================
//  Vivid Lite — extended settings model, presets and generated pack files
// ============================================================================

import { VERSION_TARGETS, buildBlockProperties, buildBufferFormats, type LoaderId, type VersionTargetId } from './compat';

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
  ao: boolean;              // cheap ambient occlusion from lightmap
  caveLighting: 0 | 1;     // 0 = vanilla, 1 = boosted
  // world
  wavingPlants: boolean;
  wavingLeaves: boolean;
  wavingStrength: number;
  waterWaves: boolean;
  waterReflection: boolean;
  waterFog: boolean;
  waterAlpha: number;
  waterTint: number;       // 0 = default, 1 = tropical, 2 = swamp
  roundSun: boolean;
  stars: boolean;
  fogDensity: number;
  rainFog: number;          // extra fog during rain
  sunsetIntensity: number;  // how vivid the sunset colors are
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
  colorTemp: number;       // -1 = cool, 0 = neutral, 1 = warm
  // performance-only toggles (v1.0.1 — Extra Potato optimizations)
  skipSky: boolean;         // draw super-simple 2-color gradient sky (fastest)
  skipTonemap: boolean;     // skip tonemap curve, direct gamma only
  skipDithering: boolean;   // remove +hash/255 in final (saves 1 hash call/pixel)
  simpleWater: boolean;     // flat water, no waves, no fresnel
  cullDistance: number;     // hard cutoff distance for expensive per-pixel effects (block-based)
  lowResShadow: boolean;    // render shadow at 1/2 map res sampling (blockier but 4× faster reads)
  fogQuality: 0 | 1 | 2;   // 0 = off, 1 = cheap linear, 2 = full atmospheric
  // ── night rework (v1.1.0) ──
  nightBrightness: number;   // overall night exposure
  moonlight: number;         // moon directional light strength
  nightTint: 0 | 1 | 2;     // 0 = blue (BSL), 1 = teal, 2 = purple
  starBrightness: number;
  milkyWay: boolean;         // faint galactic band
  moonGlow: boolean;         // soft halo around the moon
  nightFog: number;          // bluish distance haze at night
  // ── compatibility (v1.1.0) ──
  mcVersion: VersionTargetId;
  loader: LoaderId;
}

export const OPTION_VALUES = {
  shadowRes: [512, 768, 1024, 1536, 2048],
  shadowDistance: [48, 64, 80, 96, 128, 160],
  sunPathRotation: [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60],
  intensity: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.75, 2.0],
  minLight: [0, 0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.2],
  strength: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  waterAlpha: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  fogDensity: [0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  rainFog: [0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  sunsetIntensity: [0.3, 0.5, 0.7, 0.85, 1.0, 1.2, 1.5],
  bloomStrength: [0.04, 0.08, 0.12, 0.16, 0.2, 0.3, 0.4],
  exposure: [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.5],
  saturation: [0.8, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.3, 1.4],
  vibrance: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
  contrast: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2],
  vignetteStrength: [0.25, 0.5, 0.75, 1.0],
  colorTemp: [-1, -0.5, 0, 0.5, 1],
  cullDistance: [32, 48, 64, 96, 128, 160, 200, 999],
  nightBrightness: [0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0],
  moonlight: [0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0],
  starBrightness: [0, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0],
  nightFog: [0, 0.5, 1.0, 1.5, 2.0],
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
};

export const PRESETS: Record<PresetId, ShaderSettings> = {
  // ── EXTRA POTATO ─ nightmare-tier optimization, still looks better than vanilla ──
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
    // v1.0.1 hard-off toggles
    skipSky: true, skipTonemap: true, skipDithering: true,
    simpleWater: true, cullDistance: 32, lowResShadow: true, fogQuality: 0,
    moonlight: 0.5, starBrightness: 0, milkyWay: false, moonGlow: false, nightFog: 0,
  },
  // ── LOW POTATO ─ tiny step up: keep tonemap + waving plants ──
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
  // ── POTATO ─ original potato preset, slightly better than lowPotato ──
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
  // ── HIGH POTATO ─ potato + very cheap shadows (768/48, hard, no entity) ──
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
  // ── LOW ─ shadows + bloom, still light ──
  low: {
    ...BASE,
    shadowRes: 768, shadowDistance: 64, shadowSoftness: 0,
    entityShadows: false, wavingLeaves: false, waterFog: false,
    cloudTranslucency: false, sunsetIntensity: 0.85,
    cullDistance: 128, fogQuality: 2,
  },
  // ── MEDIUM ─ balanced (default recommendation) ──
  medium: { ...BASE },
  // ── HIGH ─ closest to BSL ──
  high: {
    ...BASE,
    shadowRes: 2048, shadowDistance: 128, shadowSoftness: 2,
    coloredShadows: true, bloomStrength: 0.16, torchFlicker: true,
    cloudTranslucency: true, sunsetIntensity: 1.2,
  },
  // ── EXTRA HIGH ─ everything cranked, for GTX 1060+ ──
  extraHigh: {
    ...BASE,
    shadowRes: 2048, shadowDistance: 160, shadowSoftness: 2,
    coloredShadows: true, entityShadows: true,
    torchFlicker: true, emissiveStrength: 1.5,
    wavingStrength: 1.25, waterAlpha: 0.75,
    cloudTranslucency: true, sunsetIntensity: 1.5, rainFog: 2.0,
    bloomStrength: 0.2, saturation: 1.15, vibrance: 0.3, contrast: 1.1,
    vignetteStrength: 0.75,
    nightBrightness: 1.1, moonlight: 1.5, starBrightness: 1.5,
    milkyWay: true, moonGlow: true, nightFog: 1.5,
  },
};

export const PRESET_META: Record<PresetId, { name: string; tagline: string; target: string; emoji: string; fpsNote: string; tier: 'potato' | 'balanced' | 'high' }> = {
  extraPotato: {
    name: 'Extra Potato', emoji: '💀',
    tagline: 'Tối ưu hết mức. Bỏ sky procedural, tonemap, dithering, sương. Chỉ giữ ánh sáng cơ bản + màu.',
    target: 'Intel HD 2000/3000, netbook Atom, 2 GB RAM',
    fpsNote: '~98% FPS vanilla',
    tier: 'potato',
  },
  lowPotato: {
    name: 'Low Potato', emoji: '🥔',
    tagline: 'Potato tối ưu hơn tí. Nước phẳng, sương tuyến tính rẻ, bỏ dithering.',
    target: 'Intel HD 3000/4000, Celeron 2 nhân',
    fpsNote: '~95% FPS vanilla',
    tier: 'potato',
  },
  potato: {
    name: 'Potato', emoji: '🍟',
    tagline: 'Không bóng, không bloom — ánh sáng đẹp, bầu trời, nước trong.',
    target: 'Intel HD 4000, 4 GB RAM, laptop cũ 2012+',
    fpsNote: '~92% FPS vanilla',
    tier: 'potato',
  },
  highPotato: {
    name: 'High Potato', emoji: '🌶️',
    tagline: 'Potato tối ưu cao hơn: thêm bóng cứng 512px tầm gần 48 block.',
    target: 'Intel HD 5000/HD 520, laptop văn phòng 2014+',
    fpsNote: '~88% FPS vanilla',
    tier: 'potato',
  },
  low: {
    name: 'Low', emoji: '🌱',
    tagline: 'Bóng cứng 768px + bloom nhẹ. Đẹp rõ rệt, nhẹ bất ngờ.',
    target: 'Intel HD 520/620, UHD 600, Vega 3',
    fpsNote: '~85% FPS vanilla',
    tier: 'balanced',
  },
  medium: {
    name: 'Medium (đề xuất)', emoji: '🌤️',
    tagline: 'Bóng mềm 1024px, sương nước, lá đung đưa. Cân bằng hoàn hảo.',
    target: 'Iris Xe, Vega 8, GT 1030, MX150',
    fpsNote: '~80% FPS vanilla',
    tier: 'balanced',
  },
  high: {
    name: 'High (BSL look)', emoji: '✨',
    tagline: 'Bóng 2048px rất mềm, bóng màu, đuốc lung linh. Gần nhất BSL.',
    target: 'GTX 1050 / RX 560 trở lên',
    fpsNote: '~72% FPS vanilla',
    tier: 'high',
  },
  extraHigh: {
    name: 'Extra High', emoji: '💎',
    tagline: 'Kịch cấu hình: bóng 2048/160, cloud translucency, vibrance & vignette tối đa.',
    target: 'GTX 1060 / RX 580 trở lên',
    fpsNote: '~65% FPS vanilla',
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

/** Keys that are orthogonal to the visual preset (compat targets). */
const NON_PRESET_KEYS: (keyof ShaderSettings)[] = ['mcVersion', 'loader'];

export function detectPreset(s: ShaderSettings): PresetId | 'custom' {
  for (const id of Object.keys(PRESETS) as PresetId[]) {
    const p = PRESETS[id];
    const keys = (Object.keys(p) as (keyof ShaderSettings)[]).filter((k) => !NON_PRESET_KEYS.includes(k));
    if (keys.every((k) => p[k] === s[k])) return id;
  }
  return 'custom';
}

/** Apply a preset but keep the user's version/loader choice. */
export function applyPresetKeepCompat(preset: ShaderSettings, current: ShaderSettings): ShaderSettings {
  return { ...preset, mcVersion: current.mcVersion, loader: current.loader };
}

// ---------------------------------------------------------------------------
// shaders/lib/settings.glsl
// ---------------------------------------------------------------------------
export function buildSettingsGlsl(s: ShaderSettings, presetLabel: string): string {
  const vt = VERSION_TARGETS[s.mcVersion];
  return `// ============================================================================
//  Vivid Lite Shaders v1.1.0 — lib/settings.glsl
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

// ---------------- PERFORMANCE (v1.0.1) ----------------
// These override or skip work entirely. Turning them on = fewer instructions = more FPS.
${flag('SKIP_SKY_PROC', s.skipSky)}
${flag('SKIP_TONEMAP', s.skipTonemap)}
${flag('SKIP_DITHERING', s.skipDithering)}
${flag('SIMPLE_WATER', s.simpleWater)}
${flag('LOW_RES_SHADOW', s.lowResShadow)}
#define CULL_DISTANCE ${f1(s.cullDistance)} ${list(OPTION_VALUES.cullDistance, f1)}
#define FOG_QUALITY ${s.fogQuality} //[0 1 2]

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
  const irisOK = s.loader !== 'optifine';
  // Iris-only directives — OptiFine ignores unknown keys, but pure-OptiFine builds omit them.
  const irisBlock = irisOK
    ? `# ── Iris-only: skip whole programs when their feature is off (big FPS win) ──
program.composite.enabled=WATER_FOG
program.composite1.enabled=BLOOM
program.world1/composite.enabled=WATER_FOG
program.world1/composite1.enabled=BLOOM
program.world-1/composite1.enabled=BLOOM
shadow.enabled=SHADOWS
`
    : `# (Iris-only program toggles omitted for OptiFine build — unused passes still
#  cost almost nothing because their bodies are #ifdef'd out.)
`;

  return `# ============================================================
#  Vivid Lite Shaders v1.1.0 — shaders.properties
#  Preset: ${presetLabel}
#  Target: Minecraft ${vt.label}   Loader: ${s.loader}
# ============================================================
version.1.1.0

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

${irisBlock}
profile.EXTRA_POTATO=!SHADOWS shadowMapResolution=512 shadowDistance=32.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS !BLOOM !WATER_FOG !WAVING_PLANTS !WAVING_LEAVES !VIGNETTE !FAKE_AO !TORCH_FLICKER !WATER_REFLECTION !WATER_WAVES !HAND_LIGHT !EMISSIVE_BLOCKS !NIGHT_DESATURATION !ROUND_SUN !STARS !MILKY_WAY !MOON_GLOW SKIP_SKY_PROC SKIP_TONEMAP SKIP_DITHERING SIMPLE_WATER LOW_RES_SHADOW CULL_DISTANCE=32.0 FOG_QUALITY=0 TONEMAP=0 MOONLIGHT=0.50 STAR_BRIGHTNESS=0.00 NIGHT_FOG=0.00
profile.LOW_POTATO=!SHADOWS shadowMapResolution=512 shadowDistance=32.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS !BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES !VIGNETTE !FAKE_AO !TORCH_FLICKER !WATER_REFLECTION !WATER_WAVES !EMISSIVE_BLOCKS !NIGHT_DESATURATION !ROUND_SUN !STARS !MILKY_WAY !MOON_GLOW SKIP_DITHERING SIMPLE_WATER CULL_DISTANCE=48.0 FOG_QUALITY=1 MOONLIGHT=0.75 STAR_BRIGHTNESS=0.50 NIGHT_FOG=0.50
profile.POTATO=!SHADOWS shadowMapResolution=512 shadowDistance=48.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS !BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES !VIGNETTE !FAKE_AO !TORCH_FLICKER !WATER_REFLECTION CULL_DISTANCE=64.0 FOG_QUALITY=1
profile.HIGH_POTATO=SHADOWS shadowMapResolution=512 shadowDistance=48.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS !BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES !VIGNETTE !TORCH_FLICKER !WATER_REFLECTION LOW_RES_SHADOW CULL_DISTANCE=96.0 FOG_QUALITY=1
profile.LOW=SHADOWS shadowMapResolution=768 shadowDistance=64.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES VIGNETTE CULL_DISTANCE=128.0 FOG_QUALITY=2
profile.MEDIUM=SHADOWS shadowMapResolution=1024 shadowDistance=96.0 SHADOW_SOFTNESS=1 !COLORED_SHADOWS BLOOM WATER_FOG WAVING_PLANTS WAVING_LEAVES VIGNETTE FOG_QUALITY=2
profile.HIGH=SHADOWS shadowMapResolution=2048 shadowDistance=128.0 SHADOW_SOFTNESS=2 COLORED_SHADOWS BLOOM WATER_FOG WAVING_PLANTS WAVING_LEAVES VIGNETTE TORCH_FLICKER CLOUD_TRANSLUCENCY FOG_QUALITY=2
profile.EXTRA_HIGH=SHADOWS shadowMapResolution=2048 shadowDistance=160.0 SHADOW_SOFTNESS=2 COLORED_SHADOWS BLOOM WATER_FOG WAVING_PLANTS WAVING_LEAVES VIGNETTE TORCH_FLICKER CLOUD_TRANSLUCENCY FOG_QUALITY=2 MILKY_WAY MOON_GLOW MOONLIGHT=1.50 STAR_BRIGHTNESS=1.50 NIGHT_BRIGHTNESS=1.10 NIGHT_FOG=1.50

${vt.simpleMenu
    ? `screen=<profile> SHADOWS shadowMapResolution shadowDistance SHADOW_SOFTNESS SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I MIN_LIGHT NIGHT_BRIGHTNESS MOONLIGHT STAR_BRIGHTNESS WAVING_PLANTS WAVING_LEAVES WATER_WAVES WATER_REFLECTION BLOOM BLOOM_STRENGTH TONEMAP EXPOSURE SATURATION CONTRAST VIGNETTE FOG_QUALITY SIMPLE_WATER SKIP_SKY_PROC`
    : `screen=<profile> <empty> [SHADOW_SCREEN] [LIGHTING_SCREEN] [NIGHT_SCREEN] [WORLD_SCREEN] [POST_SCREEN] [PERF_SCREEN]
screen.SHADOW_SCREEN=SHADOWS shadowMapResolution shadowDistance SHADOW_SOFTNESS COLORED_SHADOWS LOW_RES_SHADOW sunPathRotation
screen.LIGHTING_SCREEN=SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I BLOCKLIGHT_WARMTH MIN_LIGHT HAND_LIGHT EMISSIVE_BLOCKS EMISSIVE_STRENGTH TORCH_FLICKER FAKE_AO CAVE_LIGHTING
screen.NIGHT_SCREEN=NIGHT_BRIGHTNESS MOONLIGHT NIGHT_TINT NIGHT_DESATURATION <empty> STARS STAR_BRIGHTNESS MILKY_WAY MOON_GLOW NIGHT_FOG
screen.WORLD_SCREEN=WAVING_PLANTS WAVING_LEAVES WAVING_STRENGTH WATER_WAVES WATER_REFLECTION WATER_FOG WATER_ALPHA WATER_TINT SIMPLE_WATER FOG_DENSITY RAIN_FOG FOG_QUALITY SUNSET_INTENSITY CLOUD_TRANSLUCENCY
screen.POST_SCREEN=BLOOM BLOOM_STRENGTH TONEMAP EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE VIGNETTE_STRENGTH COLOR_TEMP
screen.PERF_SCREEN=LOW_RES_SHADOW SIMPLE_WATER FOG_QUALITY CULL_DISTANCE <empty> SKIP_SKY_PROC SKIP_TONEMAP SKIP_DITHERING`}
sliders=shadowDistance sunPathRotation SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I MIN_LIGHT EMISSIVE_STRENGTH WAVING_STRENGTH WATER_ALPHA FOG_DENSITY RAIN_FOG SUNSET_INTENSITY BLOOM_STRENGTH EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE_STRENGTH COLOR_TEMP CULL_DISTANCE NIGHT_BRIGHTNESS MOONLIGHT STAR_BRIGHTNESS NIGHT_FOG
`;
}

// ---------------------------------------------------------------------------
// shaders/block.properties — now version-aware (see compat.ts)
// ---------------------------------------------------------------------------
export { buildBlockProperties };

// ---------------------------------------------------------------------------
// language
// ---------------------------------------------------------------------------
export const LANG_VI = `screen.SHADOW_SCREEN=Bóng đổ
screen.LIGHTING_SCREEN=Ánh sáng
screen.WORLD_SCREEN=Thế giới & Nước
screen.POST_SCREEN=Màu sắc & Hậu kỳ
profile.POTATO=Khoai tây (FPS tối đa)
profile.LOW=Thấp
profile.MEDIUM=Trung bình
profile.HIGH=Cao (giống BSL)
option.SHADOWS=Bóng đổ
option.shadowMapResolution=Độ phân giải bóng
option.shadowDistance=Tầm xa bóng đổ
option.SHADOW_SOFTNESS=Độ mềm bóng
value.SHADOW_SOFTNESS.0=Cứng
value.SHADOW_SOFTNESS.1=Mềm
value.SHADOW_SOFTNESS.2=Rất mềm
option.COLORED_SHADOWS=Bóng có màu
option.sunPathRotation=Góc mặt trời
option.SUNLIGHT_I=Ánh nắng
option.AMBIENT_I=Ánh môi trường
option.BLOCKLIGHT_I=Ánh đuốc
option.BLOCKLIGHT_WARMTH=Màu đuốc
value.BLOCKLIGHT_WARMTH.0=Lạnh
value.BLOCKLIGHT_WARMTH.1=Ấm (BSL)
value.BLOCKLIGHT_WARMTH.2=Rất ấm
option.MIN_LIGHT=Sáng tối thiểu
option.HAND_LIGHT=Đèn cầm tay
option.EMISSIVE_BLOCKS=Block phát sáng
option.EMISSIVE_STRENGTH=Độ phát sáng
option.NIGHT_DESATURATION=Giảm màu đêm
option.TORCH_FLICKER=Đuốc lung linh
option.FAKE_AO=Ao giả (tối góc)
option.CAVE_LIGHTING=Chiếu sáng hang
value.CAVE_LIGHTING.0=Vanilla
value.CAVE_LIGHTING.1=Tăng sáng
option.WAVING_PLANTS=Cỏ hoa đung đưa
option.WAVING_LEAVES=Lá đung đưa
option.WAVING_STRENGTH=Sức gió
option.WATER_WAVES=Sóng nước
option.WATER_REFLECTION=Nước phản chiếu
option.WATER_FOG=Sương nước
option.WATER_ALPHA=Độ đục nước
option.WATER_TINT=Màu nước
value.WATER_TINT.0=Mặc định
value.WATER_TINT.1=Nhiệt đới
value.WATER_TINT.2=Đầm lầy
option.STARS=Sao đêm
option.FOG_DENSITY=Độ dày sương
option.RAIN_FOG=Sương mưa
option.SUNSET_INTENSITY=Hoàng hôn rực
option.CLOUD_TRANSLUCENCY=Mây trong sáng
option.BLOOM=Bloom
option.BLOOM_STRENGTH=Độ mạnh bloom
option.TONEMAP=Tonemap
value.TONEMAP.0=Không
value.TONEMAP.1=Sống động (BSL)
value.TONEMAP.2=ACES
option.EXPOSURE=Phơi sáng
option.SATURATION=Độ bão hòa
option.VIBRANCE=Độ rực
option.CONTRAST=Tương phản
option.VIGNETTE=Tối góc
option.VIGNETTE_STRENGTH=Độ tối góc
option.COLOR_TEMP=Nhiệt độ màu
screen.PERF_SCREEN=⚡ Tối ưu hiệu năng
option.SKIP_SKY_PROC=Bỏ sky procedural
option.SKIP_SKY_PROC.comment=Dùng gradient 2 màu đơn giản. Tiết kiệm ~5-8% GPU nhưng bầu trời phẳng hơn.
option.SKIP_TONEMAP=Bỏ tonemap
option.SKIP_TONEMAP.comment=Bỏ đường cong tonemap, chỉ dùng gamma. Rẻ hơn nhưng cháy sáng dễ hơn.
option.SKIP_DITHERING=Bỏ dithering
option.SKIP_DITHERING.comment=Bỏ hash noise chống banding. Tiết kiệm 1 hash/pixel. Có thể thấy dải màu ở bầu trời.
option.SIMPLE_WATER=Nước đơn giản
option.SIMPLE_WATER.comment=Nước phẳng, không sóng, không fresnel. Tiết kiệm ~10% với cảnh nhiều nước.
option.LOW_RES_SHADOW=Bóng nửa độ phân giải
option.LOW_RES_SHADOW.comment=Sample shadow ở 1/2 res rồi upsample. Bóng hơi vỡ nhưng nhanh 4×.
option.CULL_DISTANCE=Tầm cắt hiệu ứng đắt
option.CULL_DISTANCE.comment=Ngoài khoảng cách này, các hiệu ứng như phản chiếu nước bị tắt để tiết kiệm.
option.FOG_QUALITY=Chất lượng sương
value.FOG_QUALITY.0=Tắt
value.FOG_QUALITY.1=Rẻ (tuyến tính)
value.FOG_QUALITY.2=Đầy đủ (khí quyển)
screen.NIGHT_SCREEN=🌙 Ban đêm
option.NIGHT_BRIGHTNESS=Độ sáng ban đêm
option.NIGHT_BRIGHTNESS.comment=Chỉnh tổng thể độ sáng về đêm. Thấp = tối bí ẩn, cao = dễ nhìn.
option.MOONLIGHT=Ánh trăng
option.MOONLIGHT.comment=Cường độ ánh sáng định hướng từ mặt trăng. Có đổ bóng thật.
option.NIGHT_TINT=Tông màu đêm
value.NIGHT_TINT.0=Xanh dương (BSL)
value.NIGHT_TINT.1=Xanh ngọc
value.NIGHT_TINT.2=Tím
option.STAR_BRIGHTNESS=Độ sáng sao
option.MILKY_WAY=Dải Ngân Hà
option.MILKY_WAY.comment=Dải sao mờ vắt ngang bầu trời đêm. Rất rẻ (tái dùng hash sẵn có).
option.MOON_GLOW=Quầng sáng mặt trăng
option.NIGHT_FOG=Sương đêm
option.NIGHT_FOG.comment=Sương xanh lam ở xa vào ban đêm, tạo chiều sâu.
`;

export const LANG_EN = `screen.SHADOW_SCREEN=Shadows
screen.LIGHTING_SCREEN=Lighting
screen.WORLD_SCREEN=World & Water
screen.POST_SCREEN=Color & Post
profile.POTATO=Potato (max FPS)
profile.LOW=Low
profile.MEDIUM=Medium
profile.HIGH=High (BSL look)
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
screen.PERF_SCREEN=⚡ Performance
option.SKIP_SKY_PROC=Skip procedural sky
option.SKIP_TONEMAP=Skip tonemap curve
option.SKIP_DITHERING=Skip dithering
option.SIMPLE_WATER=Simple flat water
option.LOW_RES_SHADOW=Half-res shadow sampling
option.CULL_DISTANCE=Effect cull distance
option.FOG_QUALITY=Fog quality
value.FOG_QUALITY.0=Off
value.FOG_QUALITY.1=Cheap (linear)
value.FOG_QUALITY.2=Full (atmospheric)
screen.NIGHT_SCREEN=🌙 Night
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
`;

// ---------------------------------------------------------------------------
// stub files
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

export function buildReadme(pl: string, s?: ShaderSettings): string {
  const vt = s ? VERSION_TARGETS[s.mcVersion] : null;
  const loaderTxt = s ? (s.loader === 'both' ? 'Iris + OptiFine' : s.loader === 'iris' ? 'Iris / Sodium' : 'OptiFine') : 'Iris + OptiFine';
  return `================================================================
   VIVID LITE SHADERS  v1.1.0  —  preset dong goi: ${pl}
================================================================
   Shader Minecraft phong cach BSL, toi uu cho may yeu.
   Ho tro Minecraft 1.8 - 26.3, Iris va OptiFine.
${vt ? `   Ban nay build cho: Minecraft ${vt.label}  |  ${loaderTxt}` : ''}
================================================================

CAI DAT (IRIS - khuyen dung, FPS cao nhat)
------------------------------------------
1. Cai Fabric Loader cho version Minecraft cua ban
   tai fabricmc.net
2. Tai Sodium + Iris (dung version) tu modrinth.com
   Bo 2 file .jar vao thu muc .minecraft/mods
3. Bo NGUYEN file .zip nay (KHONG giai nen) vao
   .minecraft/shaderpacks
4. Trong game: Options > Video Settings > Shader Packs
   Chon "VividLite_v1.1.0_${pl}.zip" > Apply
5. Bam "Shader Pack Settings" de doi profile hoac tinh chinh

CAI DAT (OPTIFINE)
------------------
1. Cai OptiFine HD U (dung version) tai optifine.net
2. Bo file .zip vao .minecraft/shaderpacks
3. Trong game: Options > Video Settings > Shaders...
   Chon Vivid Lite

MOI TRONG v1.1.0 - BAN DEM
--------------------------
Menu moi "Ban dem" trong Shader Pack Settings:
  NIGHT_BRIGHTNESS - do sang tong the ban dem
  MOONLIGHT        - cuong do anh trang (co do bong that)
  NIGHT_TINT       - tong mau: Xanh duong / Xanh ngoc / Tim
  STAR_BRIGHTNESS  - do sang sao
  MILKY_WAY        - dai Ngan Ha vat ngang bau troi
  MOON_GLOW        - quang sang mat trang
  NIGHT_FOG        - suong dem xanh lam

7 PROFILE CO SAN (chon trong Shader Pack Settings)
--------------------------------------------------
  Extra Potato  - Toi uu het muc. Bo sky/tonemap/dither/fog.
                  Van dep hon vanilla. ~98% FPS.
                  Cho: Intel HD 2000/3000, netbook Atom
  Low Potato    - Potato toi uu hon ti. Nuoc phang.
                  ~95% FPS. Cho: Intel HD 3000/4000
  Potato        - Khong bong, khong bloom. ~92% FPS.
                  Cho: Intel HD 4000, 4GB RAM
  High Potato   - Potato + bong cung 512px tam gan.
                  ~88% FPS. Cho: Intel HD 5000/520
  Low           - Bong 768px + bloom. ~85% FPS.
                  Cho: Intel HD 620, Vega 3
  Medium        - Bong mem 1024px + suong nuoc.
                  ~80% FPS. (Khuyen dung)
                  Cho: Iris Xe, GT 1030, MX150
  High          - Bong 2048px, bong mau, dep nhu BSL.
                  ~72% FPS. Cho: GTX 1050 tro len
  Extra High    - Kich cau hinh, cloud translucency.
                  ~65% FPS. Cho: GTX 1060 tro len

MEO CHO MAY YEU
---------------
- Render Distance 6-8, Simulation Distance 5
- Clouds: Fast, Particles: Decreased
- Cai them: Lithium, FerriteCore, ImmediatelyFast,
  Entity Culling, ModernFix
- Bong do ton FPS nhat: giam Shadow Resolution truoc

CO GI MOI TRONG v1.1.0
----------------------
- Ho tro Minecraft 1.8 den 26.3 (4 nhom version)
- Ho tro OptiFine song song voi Iris
- Lam lai ban dem: anh trang theo chu ky, 3 tong mau,
  sao 2 lop, Dai Ngan Ha, quang trang, suong dem
- Legacy shadow path cho OptiFine doi cu
- block.properties sinh theo version (khong con warning)

LICENSE
-------
Lay cam hung tu phong cach BSL Shaders (Capt Tatsu).
Toan bo ma viet moi tu dau, khong su dung ma cua BSL.
Dung, sua, chia se thoai mai — vui long ghi nguon "Vivid Lite".

GitHub / Trang chu: xem file README.md
================================================================
`;
}

export function buildReadmeGithub(): string {
  return `# ✨ Vivid Lite Shaders

> **Shader Minecraft phong cách BSL, tối ưu cho máy yếu.**
> Đẹp như BSL, nhẹ như Vanilla. Dành cho Minecraft **26.2** + **Iris** + **Sodium** (Fabric).

[![Version](https://img.shields.io/badge/version-1.0.1-fbbf24.svg)](#)
[![Minecraft](https://img.shields.io/badge/Minecraft-26.2-62b47a.svg)](#)
[![Iris](https://img.shields.io/badge/Iris-1.11%2B-8b5cf6.svg)](https://modrinth.com/mod/iris)
[![License](https://img.shields.io/badge/license-Free%20to%20use-emerald.svg)](#-license)

---

## 🎯 Vivid Lite là gì?

Vivid Lite mang **hoàng hôn cam rực**, **bóng đổ mềm**, **nước phản chiếu bầu trời** và **bloom dịu** của BSL — nhưng được viết lại từ đầu để **chạy mượt trên máy yếu, kể cả siêu yếu**.

Không SSR, không volumetric light, không TAA: chỉ giữ những gì tạo nên vẻ đẹp thực sự.

### Vivid Lite vs BSL

| Chỉ số | BSL v8 Medium | Vivid Lite Medium |
|---|---|---|
| Pass toàn màn hình | 6–12 | **1–3** |
| FPS giữ lại (iGPU) | ~30% | **~80%** |
| Kích thước .zip | ~1.5 MB | **~60 KB** |
| Shadow map default | 2048px | 1024px (méo, sắc tương đương 1536px) |
| Bloom | 7 tile downsample | **2 tile mipmap** |
| Lighting model | Deferred | **Forward** |

---

## 🚀 Cài đặt (5 phút, 4 bước)

1. **Cài Fabric Loader cho Minecraft 26.2** — tải tại [fabricmc.net](https://fabricmc.net/use/installer/)
2. **Tải Sodium + Iris (bản 26.2)** từ [Modrinth](https://modrinth.com/mod/iris/versions?g=26.2) — bỏ 2 file \`.jar\` vào \`.minecraft/mods/\`
3. **Tải file \`VividLite_v1.0.1_<preset>.zip\`** ở trang chủ hoặc [Releases](../../releases) — bỏ **nguyên file .zip** (không giải nén) vào \`.minecraft/shaderpacks/\`
4. **Trong game:** \`Options → Video Settings → Shader Packs\` → chọn Vivid Lite → **Apply**

Bấm **"Shader Pack Settings"** để đổi profile hoặc tinh chỉnh gần **50 tùy chọn**.

---

## 🎚️ 7 Profile có sẵn

| Profile | FPS giữ lại | Phù hợp máy | Ghi chú |
|---|---|---|---|
| 💀 **Extra Potato** | ~98% | Intel HD 2000/3000, netbook Atom | Tối ưu hết mức. Bỏ sky procedural, tonemap, dithering, fog. |
| 🥔 **Low Potato** | ~95% | Intel HD 3000/4000, Celeron 2 nhân | Nước phẳng, sương tuyến tính. |
| 🍟 **Potato** | ~92% | Intel HD 4000, laptop 2012+ 4GB | Không bóng, không bloom. |
| 🌶️ **High Potato** | ~88% | Intel HD 5000/520, laptop VP 2014+ | Bóng cứng 512px tầm 48 block. |
| 🌱 **Low** | ~85% | Intel HD 620, UHD 600, Vega 3 | Bóng 768px + bloom. |
| 🌤️ **Medium** *(đề xuất)* | ~80% | Iris Xe, Vega 8, GT 1030, MX150 | Bóng mềm 1024px + sương nước. |
| ✨ **High** | ~72% | GTX 1050 / RX 560+ | Bóng 2048px + colored shadows. |
| 💎 **Extra High** | ~65% | GTX 1060 / RX 580+ | Kịch cấu hình, cloud translucency. |

---

## 🔧 Vivid Lite boost FPS bằng cách nào?

### 1. Forward lighting thay vì Deferred (BSL)
- Ánh sáng tính **ngay lúc vẽ geometry** trong \`gbuffers_terrain\`, không cần G-buffer extraction
- Không SSAO pass, không re-light pass, không TAA resolve
- **1–3 pass toàn màn hình thay vì 6–12** như BSL

### 2. Bloom 2 tile mipmap thay vì 7 tile
- BSL downsample thủ công 7 lần → \`7 × 270K\` pixel
- Vivid Lite bật \`colortex0MipmapEnabled=true\` → GPU tạo mipmap **miễn phí**
- Chỉ đọc 2 tile ở mip level 2 và 4 → \`~150K\` pixel

### 3. Shadow pass có thể tắt hoàn toàn
- Iris hỗ trợ \`program.shadow.enabled\` và \`program.composite.enabled\`
- Khi tắt \`SHADOWS\`, Iris **skip shadow pass** → CPU bớt ~1 triệu vertex
- Khi tắt \`WATER_FOG\` / \`BLOOM\`, các composite pass tương ứng cũng skip

### 4. Hiệu ứng thay thế (thay vì bỏ hẳn)
| BSL dùng | FPS cost | Vivid Lite thay bằng | Tại sao rẻ |
|---|---|---|---|
| Screen-space reflections (SSR) | 18% | Sky reflection + Fresnel | 1 texture lookup thay vì ray-march 32 bước |
| Volumetric light (god rays) | 15% | Bloom nhẹ | 2 mip tile thay vì 1 pass ray-march dày đặc |
| TAA (temporal AA) | 8% | Dithering 8-bit | 1 hash thay vì velocity buffer + resolve |
| SSAO | 10% | Fake AO từ lightmap² | 1 phép nhân đã có sẵn |
| POM / Parallax | 7% | (bỏ) | POM cần 8–32 texture lookup mỗi pixel |
| Motion blur | 5% | (bỏ) | Cần velocity buffer + blur toàn màn hình |
| Deferred composite (6+ pass) | 12% | Forward 1–3 pass | Không cần G-buffer extraction |

**Tổng tiết kiệm: ~75% frame time** so với BSL Medium trên iGPU.

---

## ⚡ Tùy chọn tối ưu (v1.0.1)

Menu **"⚡ Performance"** mới trong Shader Pack Settings:

| Option | Tác dụng | FPS gain |
|---|---|---|
| \`SKIP_SKY_PROC\` | Dùng gradient 2 màu thay sky procedural | ~5–8% |
| \`SKIP_TONEMAP\` | Bỏ đường cong tonemap, chỉ gamma | ~1–2% |
| \`SKIP_DITHERING\` | Bỏ hash noise chống banding | ~0.5% |
| \`SIMPLE_WATER\` | Nước phẳng, không sóng, không fresnel | ~3–5% |
| \`LOW_RES_SHADOW\` | Sample shadow ở ½ độ phân giải | ~3–4% |
| \`CULL_DISTANCE\` | Cắt hiệu ứng đắt sau khoảng cách này | tuyến tính |
| \`FOG_QUALITY\` | 0 = tắt, 1 = linear rẻ, 2 = khí quyển | ~1.5% |

---

## 🛠️ Đề xuất Video Settings cho máy yếu

| Setting | Giá trị | Vì sao |
|---|---|---|
| Render Distance | 6–8 chunk | Ảnh hưởng FPS nhiều nhất sau shader |
| Simulation Distance | 5 | Giảm tải CPU |
| Graphics | Fast | Lá cây đặc = ít pixel cần vẽ |
| Clouds | Fast hoặc Off | Mây fancy tốn fill-rate |
| Entity Shadows | Off | Shader đã có bóng thật |
| Particles | Decreased | Bớt overdraw |
| Max Framerate | 60 | Đỡ nóng máy, khung hình đều |
| Mipmap Levels | 2 | Vừa đủ mượt, ít VRAM |

**Mod nên cài thêm (Fabric, miễn phí):** Lithium · FerriteCore · ImmediatelyFast · Entity Culling · ModernFix · Dynamic FPS

---

## 📁 Cấu trúc file

\`\`\`
VividLite_v1.0.1_<preset>.zip
├── README.txt              # hướng dẫn ngắn
├── CHANGELOG.txt           # lịch sử phiên bản
└── shaders/
    ├── shaders.properties  # profiles + menu structure
    ├── block.properties    # block IDs cho lighting/emission
    ├── lib/
    │   ├── settings.glsl   # tất cả #define (thay đổi theo builder)
    │   ├── uniforms.glsl
    │   ├── common.glsl
    │   ├── atmosphere.glsl # sky, sun, moon, sunset colors
    │   ├── lighting.glsl   # forward lighting model
    │   ├── shadows.glsl    # distorted shadow mapping + PCF
    │   ├── fog.glsl        # atmospheric fog with FOG_QUALITY
    │   ├── waving.glsl     # wind animation for plants/leaves
    │   └── water.glsl      # analytic wave normals
    ├── program/            # main GLSL sources
    │   ├── gbuffers_terrain.glsl
    │   ├── gbuffers_water.glsl
    │   ├── gbuffers_entities.glsl
    │   ├── gbuffers_skybasic.glsl
    │   ├── gbuffers_clouds.glsl
    │   ├── shadow.glsl
    │   ├── composite.glsl  # water depth fog (WATER_FOG)
    │   ├── composite1.glsl # bloom (BLOOM)
    │   └── final.glsl      # tonemap + color grading
    ├── shaders/            # stub .vsh/.fsh files → include program/
    ├── world-1/            # Nether (no shadow pass)
    ├── world1/             # End (no shadow pass)
    └── lang/
        ├── en_us.lang
        └── vi_vn.lang
\`\`\`

---

## 🎨 Tạo shader riêng của bạn

Vào [trang web Vivid Lite](../../) → phần **"Tùy chỉnh & Tải"** → chọn preset → tinh chỉnh 50+ tùy chọn → tải file \`.zip\` ngay trên trình duyệt (không upload server, không cần đăng ký).

Trang cũng có:
- 📊 **Ước tính FPS** real-time cho 3 cấu hình máy tham chiếu
- 🎬 **Preview** ngày/đêm mô phỏng bằng CSS
- 📖 **Trình xem mã nguồn GLSL** có tô màu cú pháp
- 🔧 **Menu ⚡ Performance** với 7 tùy chọn tối ưu

---

## 🐛 Báo lỗi / Đóng góp

- **Lỗi shader?** Mở [Issue](../../issues) và dán nội dung \`.minecraft/logs/latest.log\` (dòng có \`ERROR:\`)
- **Ý tưởng?** Mở [Discussion](../../discussions)
- **PR?** Hoan nghênh! Vui lòng test trên Iris 1.11.x với Minecraft 26.2 trước khi submit

---

## 📄 License

Lấy cảm hứng từ phong cách hình ảnh của **BSL Shaders (Capt Tatsu)**. **Toàn bộ mã Vivid Lite viết mới từ đầu**, không sử dụng mã của BSL.

Dùng, sửa, chia sẻ thoải mái — vui lòng **ghi nguồn "Vivid Lite Shaders"** khi tái phát hành.

Không liên kết với Mojang hay Microsoft. Minecraft © Mojang AB.

---

<p align="center">
  <sub>Made with ❤️ cho máy yếu · <a href="../../">Trang chủ</a> · <a href="../../releases">Releases</a></sub>
</p>
`;
}

export function buildChangelog(): string {
  return `================================================================
  VIVID LITE SHADERS  —  CHANGELOG
================================================================

v1.1.0  (Compatibility & Night)
-------------------------------
+ Ho tro Minecraft 1.8 - 26.3, chia 4 nhom version:
    Legacy  (1.8 - 1.12.2)  block ID so, shadow manual, RGB16
    Classic (1.13 - 1.16.5) namespaced ID, hardware PCF
    Modern  (1.17 - 1.20.6) them block 1.17+
    Latest  (1.21 - 26.3)   block moi nhat
+ Ho tro OptiFine song song voi Iris (3 che do loader)
+ Legacy shadow path: sampler2D + manual compare
+ LAM LAI BAN DEM:
    - Anh trang that co do bong, theo chu ky trang
    - 3 tong mau dem: xanh duong / xanh ngoc / tim
    - Sao 2 lop + nhap nhay + bien thien mau
    - Dai Ngan Ha vat ngang bau troi
    - Quang sang mat trang nhieu lop
    - Suong dem xanh lam
    - Purkinje shift (canh toi mat bao hoa)
    - Airglow: chan troi dem khong den tuyen
+ 7 tuy chon dem moi + menu "Ban dem"
+ shadow.enabled cho Iris
+ block.properties sinh theo version
+ README.md day du cho GitHub

v1.0.1  (8 preset + Extra Potato mode)
--------------------------------------
+ 4 profile moi:
    - Extra Potato (~98% FPS)
    - Low Potato   (~95% FPS)
    - High Potato  (~88% FPS)
    - Extra High   (~65% FPS, kich cau hinh)
+ 7 tuy chon toi uu moi:
    - SKIP_SKY_PROC     : gradient 2 mau thay sky procedural
    - SKIP_TONEMAP      : bo duong cong tonemap
    - SKIP_DITHERING    : bo hash noise chong banding
    - SIMPLE_WATER      : nuoc phang, khong song, khong fresnel
    - LOW_RES_SHADOW    : sample bong o 1/2 do phan giai
    - CULL_DISTANCE     : cat hieu ung dat sau khoang cach
    - FOG_QUALITY       : 0 = tat, 1 = linear re, 2 = khi quyen
+ Menu "Performance" moi trong Shader Pack Settings
+ Cheap linear fog cho preset potato-tier
+ README.md day du cho GitHub

* Sua loi shader "Use of undeclared identifier 'minLight'"
  trong terrain_solid (thu tu khai bao trong lighting.glsl)

v1.0.0  (initial release)
--------------------------
+ Forward lighting kieu BSL (nang am, bong xanh, duoc cam)
+ Bong do mem voi shadow map meo + PCF phan cung
+ Bloom 2 tile mipmap (BSL dung 7 tile)
+ Nuoc phan chieu bau troi + Fresnel + vet nang
+ Co, hoa, la dung dua (vertex animation)
+ Suong khi quyen theo gio trong ngay
+ Hoang hon cam hong, sao dem lap lanh, mat troi tron
+ Tonemap song dong + saturation + vibrance + vignette
+ Ho tro Nether va End (khong shadow pass = them FPS)
+ Menu tieng Viet + tieng Anh
+ 4 profile: Potato, Low, Medium, High
+ 40+ tuy chon co the doi trong game

================================================================
`;
}
