# Changelog

All notable changes to **Vivid Lite Shaders**.

**Author:** [zaminhh](https://github.com/Zaminhh) · **Source:** [github.com/Zaminhh/Vivid-Lite-Shaders](https://github.com/Zaminhh/Vivid-Lite-Shaders)

---

## [1.1.1] — More optimizations

### ➕ 8 new performance options (18 total)

**Skip entirely**
- `NO_COLOR_TEMP` — skip the warm/cool tint in the final pass
- `SKIP_SPECULAR` — skip water sun glints (saves 1 `pow` instruction)

**Cheap replacements**
- `SKIP_PCF` — 1-tap shadow instead of 4-tap soft filter (~3% FPS)
- `HALF_RES_BLOOM` — 3×3 bloom blur instead of 5×5 (~2% FPS)
- `FAST_NORMALIZE` — `inversesqrt()` chain instead of `normalize()` for water normals
- `PRECOMPUTED_VIEW` — avoid redundant `normalize()` in water reflection
- `CHEAP_EMISSIVE` — replace `smoothstep()` in emissive detection with a constant

**Distance culls**
- `FOG_CUTOFF` — hard-cull fog past a distance (skips `length`, `exp` and the sky lookup entirely)

### ⚡ Low-level GLSL optimizations
- `pow(NdotV, 3)` → `x*x*x` (Fresnel term)
- `pow(lm.x, 3)` → `lx*lx*lx` (End dimension blocklight)
- `reflect()` inlined manually in the water program
- Blocklight formula pre-fused: `(bl²·bl·1.2 + bl²·0.3)·1.5` → `bl²·bl·1.8 + bl²·0.45`
- Torch flicker: 2 `sin` calls → 1 `sin` at a non-harmonic frequency
- Lighting sum grouped as `(a+b)+(c+d)` so the compiler emits a single FMA chain
- End dimension: early return, skipping all shadow / normal / ambient logic
- Star field: two-stage gate (`starsF > 0.0 && starsF > 0.01`) before the hash work
- `dir = feetPos * rcpSafe(dist)` instead of `feetPos / max(dist, 0.001)`

### 🔧 Other
- Single source of truth for the version number (`src/shader/version.ts`) — bumping one constant now updates every GLSL header, `shaders.properties`, README.txt, CHANGELOG.txt and the website UI
- Extra Potato preset enables every new option → **~99% of vanilla FPS**
- Performance menu UI reorganized into 3 groups (Skip / Replace / Cull)

---

## [1.1.0] — Compatibility & Night

### ➕ Extended compatibility
- Support for **Minecraft 1.8 → 26.3**, in 4 version buckets:
  - **Legacy** (1.8 – 1.12.2) — numeric block IDs, manual shadow compare, `RGB16` buffer, flat menu
  - **Classic** (1.13 – 1.16.5) — namespaced IDs, hardware PCF
  - **Modern** (1.17 – 1.20.6) — adds 1.17+ blocks (froglight, sculk, amethyst, candle)
  - **Latest** (1.21 – 26.3) — pale oak, creaking heart, eyeblossom, wildflowers, copper bulb, vault
- **OptiFine** support alongside Iris. Pick one of 3 loader modes:
  - 🔀 **Both** — runs on both (default)
  - 🌈 **Iris** — full `program.*.enabled` + `shadow.enabled` to skip passes entirely
  - 🔧 **OptiFine** — drops Iris-specific directives, classic menu
- Legacy shadow path: `sampler2D` + `step()` manual compare instead of `sampler2DShadow`, with `shadowHardwareFiltering = false` — works on legacy drivers / old OptiFine

### 🌙 Night rework
- **Real moonlight with shadows**, varying with the moon phase (`moonPhase` uniform) — full moon ~3× brighter than new moon
- **3 night tints**: Blue (BSL) · Teal · Purple
- **2-layer stars** — sparse bright + dense faint, independent twinkle, warm/cool color variation
- **Milky Way band** across the sky with natural clumping (reuses existing hash, ~0 cost)
- **Moon glow halo** in multiple layers (`MOON_GLOW`)
- **Night fog** — blue haze at distance for depth (`NIGHT_FOG`)
- **Purkinje shift** — dim scenes lose saturation and shift toward the night tint, like real human eyes
- **Airglow** — the night horizon never reads as pure black
- 7 new night options + 🌙 Night menu in Shader Pack Settings

### ⚡ GLSL micro-optimizations (see README for full list)
- `mad` everywhere (compile to single MUL-ADD)
- `exp2` instead of `exp` (1–2 cycles vs ~5)
- Pre-fused cosine constants
- Branch culling: `if (dist >= SHADOW_CUTOFF) return vec3(1.0)` skips texture lookup
- Sky LOD: full procedural sky only within 48 block, 2-color gradient beyond
- No `pow` for envmap-style effects (replaced with `x*x*x*x*x*x`)
- `#if` (preprocessor) for compile-time branching

### 🔧 Other
- `shadow.enabled = SHADOWS` (Iris) — more aggressive pass skipping
- `block.properties` is now generated per-version — no more warnings about missing blocks
- Buffer format auto-selected by version (`RGB16` for legacy, `R11F_G11F_B10F` for modern)
- Full `README.md` in the project root for GitHub
- 5 new perf+ options: `SKY_LOD`, `SMALL_WAVE`, `WAVE_CUTOFF`, `SHADOW_CUTOFF`, `VERTEX_AO`

---

## [1.0.1] — Extra Potato

### ➕ 4 new presets (total 8)
| Preset | FPS retained | For |
|---|---|---|
| 💀 Extra Potato | ~98% | Intel HD 2000/3000, netbook |
| 🥔 Low Potato | ~95% | Intel HD 3000/4000 |
| 🌶️ High Potato | ~88% | Intel HD 5000/520 |
| 💎 Extra High | ~65% | GTX 1060+ |

### ⚡ 7 new optimization options
- `SKIP_SKY_PROC` — 2-color gradient instead of procedural sky (~5–8% FPS)
- `SKIP_TONEMAP` — skip the tonemap curve (~1–2%)
- `SKIP_DITHERING` — skip hash noise (~0.5%)
- `SIMPLE_WATER` — flat water, no waves/Fresnel (~3–5%)
- `LOW_RES_SHADOW` — sample shadow at ½ res grid (~3–4%)
- `CULL_DISTANCE` — cull expensive effects beyond distance
- `FOG_QUALITY` — 0 off / 1 linear / 2 atmospheric (~1.5%)
- New **⚡ Performance** menu in-game

### 🐛 Bug fix
- Compile error `ERROR: Use of undeclared identifier 'minLight'` in `terrain_solid`
  — `minLight` was referenced in `#if CAVE_LIGHTING == 1` before its declaration

---

## [1.0.0] — Initial release

- BSL-style forward lighting (warm sun, blue shadows, orange torch)
- Soft shadows with distorted shadow map + hardware PCF
- 2-tile mipmap bloom (BSL uses 7)
- Water sky reflection + Fresnel + sun glints
- Waving grass, flowers, leaves (vertex animation)
- Atmospheric fog by time of day
- Orange/pink sunset, twinkling stars, round sun
- Vivid tonemap + saturation + vibrance + vignette + dithering
- Nether & End support (no shadow pass = extra FPS)
- English + Vietnamese in-game menu
- 4 profiles: Potato, Low, Medium, High
- 40+ in-game tunable options

---

[1.1.1]: ../../releases/tag/v1.1.1
[1.1.0]: ../../releases/tag/v1.1.0
[1.0.1]: ../../releases/tag/v1.0.1
[1.0.0]: ../../releases/tag/v1.0.0
