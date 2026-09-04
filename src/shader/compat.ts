// ============================================================================
//  Vivid Lite — Minecraft version / loader compatibility layer
//  Supports Minecraft 1.8 → 26.3 on both Iris and OptiFine.
// ============================================================================

export type VersionTargetId = 'legacy' | 'classic' | 'modern' | 'latest';
export type LoaderId = 'both' | 'iris' | 'optifine';

export interface VersionTarget {
  id: VersionTargetId;
  label: string;
  range: string;
  /** Numeric block IDs (1.8–1.12) instead of namespaced IDs. */
  numericBlockIds: boolean;
  /** Old GPUs / old OptiFine: avoid sampler2DShadow hardware filtering. */
  legacyShadow: boolean;
  /** R11F_G11F_B10F not reliable before 1.13 OptiFine — use RGB16 instead. */
  legacyBuffers: boolean;
  /** OptiFine <1.13 has no `screen.X` sub-screens with <empty> placeholders. */
  simpleMenu: boolean;
  note: string;
  loaders: string;
}

export const VERSION_TARGETS: Record<VersionTargetId, VersionTarget> = {
  legacy: {
    id: 'legacy',
    label: '1.8 – 1.12.2',
    range: '1.8, 1.8.9, 1.9, 1.10, 1.11, 1.12.2',
    numericBlockIds: true,
    legacyShadow: true,
    legacyBuffers: true,
    simpleMenu: true,
    note: 'Numeric block IDs (31, 18, 8…), manual shadow compare, RGB16 buffer. Runs on old OptiFine HD U too.',
    loaders: 'OptiFine HD U (1.8.9+) · Iris (qua Legacy Iris/1.12 fork)',
  },
  classic: {
    id: 'classic',
    label: '1.13 – 1.16.5',
    range: '1.13, 1.14, 1.15, 1.16.5',
    numericBlockIds: false,
    legacyShadow: false,
    legacyBuffers: false,
    simpleMenu: false,
    note: 'Full namespaced block IDs, HDR buffer, hardware shadow. Iris 1.16.5 or OptiFine HD U.',
    loaders: 'OptiFine HD U G/H · Iris 1.1.x (1.16.5)',
  },
  modern: {
    id: 'modern',
    label: '1.17 – 1.20.6',
    range: '1.17, 1.18, 1.19, 1.20.x',
    numericBlockIds: false,
    legacyShadow: false,
    legacyBuffers: false,
    simpleMenu: false,
    note: 'Adds 1.17+ blocks (froglight, sculk, amethyst, candle). No copper bulb yet.',
    loaders: 'Iris 1.2–1.7 · OptiFine HD U I/J',
  },
  latest: {
    id: 'latest',
    label: '1.21 – 26.3',
    range: '1.21.x, 1.22+, 25.x, 26.1, 26.2, 26.3',
    numericBlockIds: false,
    legacyShadow: false,
    legacyBuffers: false,
    simpleMenu: false,
    note: 'Full latest blocks: pale oak, creaking heart, eyeblossom, wildflowers, copper bulb, vault, trial spawner.',
    loaders: 'Iris 1.8–1.11+ · OptiFine (once available for that version)',
  },
};

export const LOADER_META: Record<LoaderId, { label: string; desc: string; emoji: string }> = {
  both: { label: 'Both (recommended)', desc: 'Runs on both Iris and OptiFine. Iris-only directives stay in the file — OptiFine ignores them.', emoji: '🔀' },
  iris: { label: 'Iris / Sodium', desc: 'Enables Iris-only features: program.enabled and shadow.enabled → passes are fully skipped when unused.', emoji: '🌈' },
  optifine: { label: 'OptiFine', desc: 'Removes all Iris-only directives and uses the classic menu syntax. Safest for old OptiFine builds.', emoji: '🔧' },
};

// ---------------------------------------------------------------------------
// block.properties — modern (namespaced IDs, 1.13+)
// ---------------------------------------------------------------------------
const PLANTS_BASE =
  'minecraft:grass minecraft:tall_grass minecraft:fern minecraft:large_fern minecraft:dandelion minecraft:poppy minecraft:blue_orchid ' +
  'minecraft:allium minecraft:azure_bluet minecraft:red_tulip minecraft:orange_tulip minecraft:white_tulip minecraft:pink_tulip ' +
  'minecraft:oxeye_daisy minecraft:cornflower minecraft:lily_of_the_valley minecraft:wither_rose minecraft:sunflower minecraft:lilac ' +
  'minecraft:rose_bush minecraft:peony minecraft:wheat minecraft:carrots minecraft:potatoes minecraft:beetroots minecraft:sugar_cane ' +
  'minecraft:dead_bush minecraft:sweet_berry_bush minecraft:oak_sapling minecraft:spruce_sapling minecraft:birch_sapling ' +
  'minecraft:jungle_sapling minecraft:acacia_sapling minecraft:dark_oak_sapling minecraft:bamboo_sapling minecraft:seagrass ' +
  'minecraft:tall_seagrass minecraft:kelp minecraft:kelp_plant minecraft:red_mushroom minecraft:brown_mushroom minecraft:nether_wart';

const PLANTS_117 =
  ' minecraft:crimson_fungus minecraft:warped_fungus minecraft:crimson_roots minecraft:warped_roots minecraft:nether_sprouts ' +
  'minecraft:cave_vines minecraft:cave_vines_plant minecraft:glow_lichen minecraft:spore_blossom minecraft:big_dripleaf ' +
  'minecraft:small_dripleaf minecraft:moss_carpet minecraft:hanging_roots minecraft:mangrove_propagule minecraft:pitcher_plant ' +
  'minecraft:torchflower minecraft:pink_petals minecraft:cherry_sapling';

const PLANTS_121 =
  ' minecraft:short_grass minecraft:short_dry_grass minecraft:tall_dry_grass minecraft:bush minecraft:firefly_bush ' +
  'minecraft:wildflowers minecraft:open_eyeblossom minecraft:closed_eyeblossom minecraft:cactus_flower minecraft:pale_oak_sapling ' +
  'minecraft:leaf_litter';

const LEAVES_BASE =
  'minecraft:oak_leaves minecraft:spruce_leaves minecraft:birch_leaves minecraft:jungle_leaves minecraft:acacia_leaves ' +
  'minecraft:dark_oak_leaves minecraft:vine';
const LEAVES_117 = ' minecraft:azalea_leaves minecraft:flowering_azalea_leaves minecraft:mangrove_leaves minecraft:cherry_leaves minecraft:weeping_vines minecraft:weeping_vines_plant minecraft:twisting_vines minecraft:twisting_vines_plant';
const LEAVES_121 = ' minecraft:pale_oak_leaves minecraft:pale_hanging_moss';

const LIGHT_BASE =
  'minecraft:torch minecraft:wall_torch minecraft:redstone_torch:lit=true minecraft:redstone_wall_torch:lit=true ' +
  'minecraft:glowstone minecraft:sea_lantern minecraft:jack_o_lantern minecraft:end_rod minecraft:fire ' +
  'minecraft:redstone_lamp:lit=true minecraft:beacon minecraft:lantern minecraft:campfire:lit=true';
const LIGHT_116 = ' minecraft:soul_torch minecraft:soul_wall_torch minecraft:soul_lantern minecraft:soul_fire minecraft:soul_campfire:lit=true minecraft:shroomlight minecraft:crying_obsidian minecraft:respawn_anchor';
const LIGHT_117 = ' minecraft:ochre_froglight minecraft:verdant_froglight minecraft:pearlescent_froglight minecraft:candle:lit=true minecraft:white_candle:lit=true minecraft:orange_candle:lit=true minecraft:yellow_candle:lit=true minecraft:light_blue_candle:lit=true minecraft:cave_vines:berries=true minecraft:cave_vines_plant:berries=true';
const LIGHT_121 = ' minecraft:copper_bulb:lit=true minecraft:exposed_copper_bulb:lit=true minecraft:weathered_copper_bulb:lit=true minecraft:oxidized_copper_bulb:lit=true minecraft:waxed_copper_bulb:lit=true minecraft:waxed_exposed_copper_bulb:lit=true minecraft:waxed_weathered_copper_bulb:lit=true minecraft:waxed_oxidized_copper_bulb:lit=true';

const WEAK_BASE =
  'minecraft:magma_block minecraft:enchanting_table minecraft:ender_chest minecraft:brewing_stand minecraft:dragon_egg ' +
  'minecraft:redstone_ore:lit=true minecraft:furnace:lit=true minecraft:blast_furnace:lit=true minecraft:smoker:lit=true ' +
  'minecraft:brown_mushroom_block minecraft:end_portal_frame:eye=true';
const WEAK_117 = ' minecraft:amethyst_cluster minecraft:large_amethyst_bud minecraft:medium_amethyst_bud minecraft:small_amethyst_bud minecraft:sculk_catalyst minecraft:deepslate_redstone_ore:lit=true minecraft:sculk_sensor:sculk_sensor_phase=active';
const WEAK_121 = ' minecraft:calibrated_sculk_sensor:sculk_sensor_phase=active minecraft:vault:vault_state=active minecraft:trial_spawner:trial_spawner_state=active minecraft:creaking_heart:creaking_heart_state=awake minecraft:heavy_core';

/** Numeric IDs for 1.8 – 1.12.2 (no namespaced IDs in that era). */
const LEGACY_BLOCKS = `# Vivid Lite — block.properties
# Author: zaminhh | https://github.com/Zaminhh/Vivid-Lite-Shaders
# Minecraft 1.8 – 1.12.2 (numeric block IDs)
# 10001 waving plants | 10002 leaves & vines | 10003 water | 10004 lava
# 10010 strong light  | 10011 weak light     | 10012 nether portal

block.10001=31 37 38 59 83 141 142 175 207 6 32 39 40 115 111 104 105
block.10002=18 161 106
block.10003=8 9
block.10004=10 11
block.10010=50 51 62 76 89 91 124 138 169 198 119 120
block.10011=61 73 74 99 100 116 117 122 130 213
block.10012=90
`;

export function buildBlockProperties(target: VersionTargetId): string {
  if (VERSION_TARGETS[target].numericBlockIds) return LEGACY_BLOCKS;

  let plants = PLANTS_BASE;
  let leaves = LEAVES_BASE;
  let light = LIGHT_BASE;
  let weak = WEAK_BASE;

  if (target === 'classic') {
    light += LIGHT_116;
  }
  if (target === 'modern' || target === 'latest') {
    plants += PLANTS_117;
    leaves += LEAVES_117;
    light += LIGHT_116 + LIGHT_117;
    weak += WEAK_117;
  }
  if (target === 'latest') {
    plants += PLANTS_121;
    leaves += LEAVES_121;
    light += LIGHT_121;
    weak += WEAK_121;
  }

  return `# Vivid Lite — block.properties
# Author: zaminhh | https://github.com/Zaminhh/Vivid-Lite-Shaders
# Minecraft ${VERSION_TARGETS[target].label}
# 10001 waving plants | 10002 leaves & vines | 10003 water | 10004 lava
# 10010 strong light  | 10011 weak light     | 10012 nether portal

block.10001=${plants}

block.10002=${leaves}

block.10003=minecraft:water minecraft:flowing_water

block.10004=minecraft:lava minecraft:flowing_lava

block.10010=${light}

block.10011=${weak}

block.10012=minecraft:nether_portal
`;
}

/** Buffer format block — legacy targets avoid R11F_G11F_B10F. */
export function buildBufferFormats(target: VersionTargetId): string {
  if (VERSION_TARGETS[target].legacyBuffers) {
    return `/*
const int colortex0Format = RGB16;
const int colortex1Format = RGB16;
const int colortex2Format = RGBA8;
*/`;
  }
  return `/*
const int colortex0Format = R11F_G11F_B10F;
const int colortex1Format = R11F_G11F_B10F;
const int colortex2Format = RGBA8;
*/`;
}
