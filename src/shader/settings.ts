// ============================================================================
//  Vivid Lite — extended settings model, presets and generated pack files
// ============================================================================

export type PresetId = 'potato' | 'low' | 'medium' | 'high';

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
};

export const PRESETS: Record<PresetId, ShaderSettings> = {
  potato: {
    ...BASE,
    shadows: false, shadowRes: 512, shadowDistance: 48, shadowSoftness: 0,
    entityShadows: false, wavingLeaves: false, waterFog: false, waterReflection: false,
    bloom: false, vignette: false, ao: false, torchFlicker: false,
    cloudTranslucency: false, sunsetIntensity: 0.7,
  },
  low: {
    ...BASE,
    shadowRes: 768, shadowDistance: 64, shadowSoftness: 0,
    entityShadows: false, wavingLeaves: false, waterFog: false,
    cloudTranslucency: false, sunsetIntensity: 0.85,
  },
  medium: { ...BASE },
  high: {
    ...BASE,
    shadowRes: 2048, shadowDistance: 128, shadowSoftness: 2,
    coloredShadows: true, bloomStrength: 0.16, torchFlicker: true,
    cloudTranslucency: true, sunsetIntensity: 1.2,
  },
};

export const PRESET_META: Record<PresetId, { name: string; tagline: string; target: string; emoji: string; fpsNote: string }> = {
  potato: {
    name: 'Khoai tây', emoji: '🥔',
    tagline: 'Không bóng, không bloom — ánh sáng đẹp, bầu trời, nước trong.',
    target: 'Intel HD 3000/4000, 4 GB RAM, laptop cũ 2012+',
    fpsNote: '~93% FPS vanilla',
  },
  low: {
    name: 'Thấp', emoji: '🌱',
    tagline: 'Bóng cứng 768px + bloom nhẹ. Đẹp rõ rệt, nhẹ bất ngờ.',
    target: 'Intel HD 520/620, UHD 600, Vega 3',
    fpsNote: '~86% FPS vanilla',
  },
  medium: {
    name: 'Trung bình', emoji: '🌤️',
    tagline: 'Bóng mềm 1024px, sương nước, lá đung đưa. Cân bằng hoàn hảo.',
    target: 'Iris Xe, Vega 8, GT 1030, MX150',
    fpsNote: '~80% FPS vanilla',
  },
  high: {
    name: 'Cao (BSL look)', emoji: '✨',
    tagline: 'Bóng 2048px rất mềm, bóng màu, đuốc lung linh. Gần nhất BSL.',
    target: 'GTX 1050 / RX 560 trở lên',
    fpsNote: '~72% FPS vanilla',
  },
};

// ---------------------------------------------------------------------------
// formatting
// ---------------------------------------------------------------------------
const f2 = (v: number) => v.toFixed(2);
const f1 = (v: number) => v.toFixed(1);
const list = (vals: readonly number[], fmt: (v: number) => string) => `//[${vals.map(fmt).join(' ')}]`;
const flag = (name: string, on: boolean) => `${on ? '' : '//'}#define ${name}`;

export function detectPreset(s: ShaderSettings): PresetId | 'custom' {
  for (const id of Object.keys(PRESETS) as PresetId[]) {
    const p = PRESETS[id];
    if ((Object.keys(p) as (keyof ShaderSettings)[]).every((k) => p[k] === s[k])) return id;
  }
  return 'custom';
}

// ---------------------------------------------------------------------------
// shaders/lib/settings.glsl
// ---------------------------------------------------------------------------
export function buildSettingsGlsl(s: ShaderSettings, presetLabel: string): string {
  return `// ============================================================================
//  Vivid Lite Shaders — lib/settings.glsl
//  Generated by the Vivid Lite web builder — preset: ${presetLabel}
//  Every option below can be changed in game:
//  Options > Video Settings > Shader Packs > Shader Pack Settings
// ============================================================================

// ---------------- SHADOWS ----------------
${flag('SHADOWS', s.shadows)}
const int shadowMapResolution = ${s.shadowRes}; ${list(OPTION_VALUES.shadowRes, String)}
const float shadowDistance = ${f1(s.shadowDistance)}; ${list(OPTION_VALUES.shadowDistance, f1)}
#define SHADOW_SOFTNESS ${s.shadowSoftness} //[0 1 2]
${flag('COLORED_SHADOWS', s.coloredShadows)}
const float sunPathRotation = ${f1(s.sunPathRotation)}; ${list(OPTION_VALUES.sunPathRotation, f1)}
const float shadowDistanceRenderMul = 1.0;
const bool  shadowHardwareFiltering = true;
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

// ---------------- BUFFERS (do not edit) ----------------
/*
const int colortex0Format = R11F_G11F_B10F;
const int colortex1Format = R11F_G11F_B10F;
const int colortex2Format = RGBA8;
*/
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
  return `# Vivid Lite Shaders — shaders.properties (generated preset: ${presetLabel})
version.1.0.0

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

program.composite.enabled=WATER_FOG
program.composite1.enabled=BLOOM
program.world1/composite.enabled=WATER_FOG
program.world1/composite1.enabled=BLOOM
program.world-1/composite1.enabled=BLOOM

profile.POTATO=!SHADOWS shadowMapResolution=512 shadowDistance=48.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS !BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES !VIGNETTE !FAKE_AO !TORCH_FLICKER !WATER_REFLECTION
profile.LOW=SHADOWS shadowMapResolution=768 shadowDistance=64.0 SHADOW_SOFTNESS=0 !COLORED_SHADOWS BLOOM !WATER_FOG WAVING_PLANTS !WAVING_LEAVES VIGNETTE
profile.MEDIUM=SHADOWS shadowMapResolution=1024 shadowDistance=96.0 SHADOW_SOFTNESS=1 !COLORED_SHADOWS BLOOM WATER_FOG WAVING_PLANTS WAVING_LEAVES VIGNETTE
profile.HIGH=SHADOWS shadowMapResolution=2048 shadowDistance=128.0 SHADOW_SOFTNESS=2 COLORED_SHADOWS BLOOM WATER_FOG WAVING_PLANTS WAVING_LEAVES VIGNETTE TORCH_FLICKER CLOUD_TRANSLUCENCY

screen=<profile> <empty> [SHADOW_SCREEN] [LIGHTING_SCREEN] [WORLD_SCREEN] [POST_SCREEN]
screen.SHADOW_SCREEN=SHADOWS shadowMapResolution shadowDistance SHADOW_SOFTNESS COLORED_SHADOWS sunPathRotation
screen.LIGHTING_SCREEN=SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I BLOCKLIGHT_WARMTH MIN_LIGHT HAND_LIGHT EMISSIVE_BLOCKS EMISSIVE_STRENGTH NIGHT_DESATURATION TORCH_FLICKER FAKE_AO CAVE_LIGHTING
screen.WORLD_SCREEN=WAVING_PLANTS WAVING_LEAVES WAVING_STRENGTH WATER_WAVES WATER_REFLECTION WATER_FOG WATER_ALPHA WATER_TINT STARS FOG_DENSITY RAIN_FOG SUNSET_INTENSITY CLOUD_TRANSLUCENCY
screen.POST_SCREEN=BLOOM BLOOM_STRENGTH TONEMAP EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE VIGNETTE_STRENGTH COLOR_TEMP
sliders=shadowDistance sunPathRotation SUNLIGHT_I AMBIENT_I BLOCKLIGHT_I MIN_LIGHT EMISSIVE_STRENGTH WAVING_STRENGTH WATER_ALPHA FOG_DENSITY RAIN_FOG SUNSET_INTENSITY BLOOM_STRENGTH EXPOSURE SATURATION VIBRANCE CONTRAST VIGNETTE_STRENGTH COLOR_TEMP
`;
}

// ---------------------------------------------------------------------------
// shaders/block.properties
// ---------------------------------------------------------------------------
export const BLOCK_PROPERTIES = `# Vivid Lite Shaders — block.properties
block.10001=minecraft:short_grass minecraft:grass minecraft:tall_grass minecraft:fern minecraft:large_fern minecraft:short_dry_grass minecraft:tall_dry_grass minecraft:bush minecraft:firefly_bush minecraft:dandelion minecraft:poppy minecraft:blue_orchid minecraft:allium minecraft:azure_bluet minecraft:red_tulip minecraft:orange_tulip minecraft:white_tulip minecraft:pink_tulip minecraft:oxeye_daisy minecraft:cornflower minecraft:lily_of_the_valley minecraft:wither_rose minecraft:torchflower minecraft:open_eyeblossom minecraft:closed_eyeblossom minecraft:cactus_flower minecraft:pink_petals minecraft:wildflowers minecraft:sunflower minecraft:lilac minecraft:rose_bush minecraft:peony minecraft:pitcher_plant minecraft:wheat minecraft:carrots minecraft:potatoes minecraft:beetroots minecraft:sugar_cane minecraft:dead_bush minecraft:sweet_berry_bush minecraft:nether_sprouts minecraft:warped_roots minecraft:crimson_roots minecraft:oak_sapling minecraft:spruce_sapling minecraft:birch_sapling minecraft:jungle_sapling minecraft:acacia_sapling minecraft:dark_oak_sapling minecraft:cherry_sapling minecraft:pale_oak_sapling minecraft:mangrove_propagule minecraft:bamboo_sapling minecraft:seagrass minecraft:tall_seagrass minecraft:kelp minecraft:kelp_plant minecraft:crimson_fungus minecraft:warped_fungus minecraft:red_mushroom minecraft:brown_mushroom
block.10002=minecraft:oak_leaves minecraft:spruce_leaves minecraft:birch_leaves minecraft:jungle_leaves minecraft:acacia_leaves minecraft:dark_oak_leaves minecraft:mangrove_leaves minecraft:cherry_leaves minecraft:pale_oak_leaves minecraft:azalea_leaves minecraft:flowering_azalea_leaves minecraft:vine minecraft:cave_vines minecraft:cave_vines_plant minecraft:weeping_vines minecraft:weeping_vines_plant minecraft:twisting_vines minecraft:twisting_vines_plant minecraft:hanging_roots minecraft:pale_hanging_moss
block.10003=minecraft:water minecraft:flowing_water
block.10004=minecraft:lava minecraft:flowing_lava
block.10010=minecraft:torch minecraft:wall_torch minecraft:soul_torch minecraft:soul_wall_torch minecraft:redstone_torch:lit=true minecraft:redstone_wall_torch:lit=true minecraft:lantern minecraft:soul_lantern minecraft:glowstone minecraft:sea_lantern minecraft:shroomlight minecraft:jack_o_lantern minecraft:end_rod minecraft:fire minecraft:soul_fire minecraft:campfire:lit=true minecraft:soul_campfire:lit=true minecraft:redstone_lamp:lit=true minecraft:beacon minecraft:ochre_froglight minecraft:verdant_froglight minecraft:pearlescent_froglight minecraft:copper_bulb:lit=true minecraft:exposed_copper_bulb:lit=true minecraft:weathered_copper_bulb:lit=true minecraft:oxidized_copper_bulb:lit=true minecraft:waxed_copper_bulb:lit=true minecraft:waxed_exposed_copper_bulb:lit=true minecraft:waxed_weathered_copper_bulb:lit=true minecraft:waxed_oxidized_copper_bulb:lit=true minecraft:crying_obsidian minecraft:respawn_anchor minecraft:end_portal_frame:eye=true minecraft:glow_lichen
block.10011=minecraft:magma_block minecraft:enchanting_table minecraft:ender_chest minecraft:amethyst_cluster minecraft:large_amethyst_bud minecraft:medium_amethyst_bud minecraft:small_amethyst_bud minecraft:brewing_stand minecraft:sculk_catalyst minecraft:brown_mushroom_block minecraft:dragon_egg minecraft:furnace:lit=true minecraft:blast_furnace:lit=true minecraft:smoker:lit=true
block.10012=minecraft:nether_portal
`;

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

export function buildReadme(pl: string): string {
  return `VIVID LITE SHADERS v1.0 — preset: ${pl}
=============================================
Shader Minecraft phong cach BSL, toi uu cho may yeu. Minecraft 26.2 + Iris.

CAI DAT
1. Cai Fabric Loader cho Minecraft 26.2 (fabricmc.net).
2. Tai Sodium va Iris (ban 26.2) tu modrinth.com, bo vao .minecraft/mods
3. Bo NGUYEN file .zip nay (khong giai nen) vao .minecraft/shaderpacks
4. Trong game: Options > Video Settings > Shader Packs > chon Vivid Lite > Apply.
5. FPS thap? Vao Shader Pack Settings, chon Profile "Khoai tay".

MEO CHO MAY YEU
- Render Distance 6-8, Simulation Distance 5, Clouds: Fast.
- Cai them Lithium, FerriteCore, ImmediatelyFast, Entity Culling.
- Bong do la thu ton FPS nhat: giam Shadow Resolution / Shadow Distance truoc.

Lay cam hung tu phong cach BSL Shaders (Capt Tatsu). Toan bo ma viet moi.
Giay phep: dung, sua, chia se thoai mai — vui long ghi nguon "Vivid Lite".
`;
}
