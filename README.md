<div align="center">

# ✨ Vivid Lite Shaders

**BSL-style Minecraft shader — optimized for weak hardware.**
As pretty as BSL, as light as Vanilla.

[![Version](https://img.shields.io/badge/version-1.1.1-fbbf24?style=flat-square)](CHANGELOG.md)
[![Minecraft](https://img.shields.io/badge/Minecraft-1.8%20→%2026.3-62b47a?style=flat-square)](#-compatibility)
[![Iris](https://img.shields.io/badge/Iris-✔-8b5cf6?style=flat-square)](https://modrinth.com/mod/iris)
[![OptiFine](https://img.shields.io/badge/OptiFine-✔-38bdf8?style=flat-square)](https://optifine.net)
[![License](https://img.shields.io/badge/license-Free%20to%20use-10b981?style=flat-square)](#-license)

[Download](#-installation) · [8 presets](#-8-presets) · [How we cut lag](#-how-we-cut-lag-line-by-line) · [Compatibility](#-compatibility) · [FAQ](#-faq)

</div>

---

**Author:** [zaminhh](https://github.com/Zaminhh) · **Source code:** [github.com/Zaminhh/Vivid-Lite-Shaders](https://github.com/Zaminhh/Vivid-Lite-Shaders)

If you redistribute, modify or build upon this project, **please credit zaminhh**. That's all I ask. ❤️

---

## 🎯 What is Vivid Lite?

Vivid Lite brings the **warm orange sunset**, **soft shadows**, **water sky reflection**, **subtle bloom** and **star-filled night sky** of BSL — but **rewritten from scratch** to run smoothly on weak hardware, even **ultra-weak** hardware.

No SSR. No volumetric light. No TAA. No SSAO. Just what actually makes Minecraft beautiful.

> 🌐 **Web builder:** pick a preset → tune 60+ options → download the `.zip` right in your browser. No server upload, no signup.

### Vivid Lite vs BSL

| Metric | BSL v8 Medium | Vivid Lite Medium |
|---|---|---|
| Full-screen passes | 6–12 | **1–3** |
| FPS retained (iGPU) | ~30% | **~80%** |
| `.zip` size | ~1.5 MB | **~70 KB** |
| Default shadow map | 2048px | 1024px *(distorted — as sharp as 1536px uniform)* |
| Bloom | 7 downsample tiles | **2 mipmap tiles** |
| Lighting model | Deferred | **Forward** |
| Minecraft versions | 1.16+ | **1.8 → 26.3** |
| OptiFine | ✓ | **✓ (since v1.1.0)** |

---

## 🚀 Installation

### With Iris + Sodium *(recommended — highest FPS)*

1. Install **Fabric Loader** for your Minecraft version — [fabricmc.net](https://fabricmc.net/use/installer/)
2. Download **[Sodium](https://modrinth.com/mod/sodium)** + **[Iris](https://modrinth.com/mod/iris)** (matching version) → drop the `.jar` files into `.minecraft/mods/`
3. Download `VividLite_v1.1.1_<preset>.zip` from [Releases](../../releases)
4. Drop the `.zip` **as-is** (❗ **don't extract**) into `.minecraft/shaderpacks/`
5. In-game: `Options → Video Settings → Shader Packs` → select Vivid Lite → **Apply**

### With OptiFine

1. Install **[OptiFine](https://optifine.net/downloads)** (HD U, matching version)
2. Download the OptiFine-targeted build of Vivid Lite (or pick "OptiFine" loader in the web builder)
3. Drop `.zip` into `.minecraft/shaderpacks/`
4. In-game: `Options → Video Settings → Shaders...` → select Vivid Lite

<details>
<summary>📁 Where is the shaderpacks folder?</summary>

| OS | Path |
|---|---|
| Windows | `%appdata%\.minecraft\shaderpacks` |
| macOS | `~/Library/Application Support/minecraft/shaderpacks` |
| Linux | `~/.minecraft/shaderpacks` |

</details>

---

## 🎚️ 8 Presets

Switch any time in-game: **Shader Pack Settings → Profile**

### 🥔 Ultra-weak → weak hardware

| Preset | FPS retained | For | Notes |
|---|---|---|---|
| 💀 **Extra Potato** | ~98% | Intel HD 2000/3000, netbook Atom, 2GB RAM | Maximum optimization. Skips procedural sky, tonemap, dithering, fog, water waves. |
| 🥔 **Low Potato** | ~95% | Intel HD 3000/4000, dual-core Celeron | Flat water, cheap linear fog, no dithering. |
| 🍟 **Potato** | ~92% | Intel HD 4000, 2012+ laptop 4GB | No shadows, no bloom. Lighting + pretty sky. |
| 🌶️ **High Potato** | ~88% | Intel HD 5000/520, 2014+ office laptop | Potato + 512px hard shadows at 48 block range. |

### ⚖️ Mainstream hardware

| Preset | FPS retained | For | Notes |
|---|---|---|---|
| 🌱 **Low** | ~85% | Intel HD 620, UHD 600, Vega 3 | 768px hard shadows + bloom. |
| 🌤️ **Medium** ⭐ | ~80% | Iris Xe, Vega 8, GT 1030, MX150 | 1024px soft shadows, water depth fog, waving leaves. **Recommended.** |

### ✨ Strong hardware

| Preset | FPS retained | For | Notes |
|---|---|---|---|
| ✨ **High** | ~72% | GTX 1050 / RX 560+ | 2048px very soft shadows, colored shadows, torch flicker. |
| 💎 **Extra High** | ~65% | GTX 1060 / RX 580+ | Maxed: 2048/160 shadows, Milky Way, cloud translucency. |

---

## 🌙 Night (added in v1.1.0)

Night is fully reworked:

- **Real moonlight with shadows** that varies with the **moon phase** (`moonPhase` uniform) — a full moon is ~3× brighter than a new moon
- **3 night tints**: 🔵 Blue (BSL) · 🟢 Teal · 🟣 Purple
- **2-layer stars** — sparse bright + dense faint, each twinkles independently, with warm/cool color variation
- **Milky Way band** across the sky with natural clumping — reuses existing hash, ~0 cost
- **Moon glow halo** in multiple layers
- **Night fog** — blue haze at distance for depth
- **Purkinje shift** — dim scenes lose saturation and shift toward the night tint, like real human eyes
- **Airglow** — the night horizon never reads as pure black

| Option | Description |
|---|---|
| `NIGHT_BRIGHTNESS` | Overall night exposure (0.4 – 2.0) |
| `MOONLIGHT` | Directional moonlight strength (0 – 2.0) |
| `NIGHT_TINT` | Tint: Blue / Teal / Purple |
| `STAR_BRIGHTNESS` | Star brightness (0 – 3.0) |
| `MILKY_WAY` | Toggle the Milky Way band |
| `MOON_GLOW` | Toggle the moon halo |
| `NIGHT_FOG` | Night haze (0 – 2.0) |

---

## 🧩 Compatibility

Vivid Lite supports **Minecraft 1.8 → 26.3** on **both Iris and OptiFine**. The web builder generates the right file for the version you pick.

| Bucket | Minecraft | Block IDs | Shadow | Buffer | Menu |
|---|---|---|---|---|---|
| **Legacy** | 1.8 – 1.12.2 | Numeric (`31`, `18`, `8`…) | Manual compare | `RGB16` | Flat |
| **Classic** | 1.13 – 1.16.5 | Namespaced | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |
| **Modern** | 1.17 – 1.20.6 | Namespaced + 1.17 blocks | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |
| **Latest** | 1.21 – 26.3 | Full new blocks | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |

### Loader modes

| Mode | Description |
|---|---|
| 🔀 **Both** *(default)* | Runs on both Iris and OptiFine. Iris-specific directives are kept — OptiFine ignores them. |
| 🌈 **Iris / Sodium** | Full `program.*.enabled` + `shadow.enabled` → Iris **skips** unused passes. Highest FPS. |
| 🔧 **OptiFine** | Drops all Iris-specific directives, uses the classic menu. Safest for old OptiFine. |

<details>
<summary>⚙️ Compatibility layer — technical details</summary>

- **Block IDs:** 1.8–1.12 has no namespaced IDs → `block.properties` is generated with numeric IDs (`block.10001=31 37 38 59 83 …`)
- **Shadow sampling:** `sampler2DShadow` + `shadow2D()` is unreliable on old drivers → Legacy mode uses `sampler2D` + `step(p.z, texture2D(...).x)`, with `shadowHardwareFiltering = false`
- **Buffer format:** `R11F_G11F_B10F` is not fully supported on old OptiFine → Legacy uses `RGB16`
- **Menu:** OptiFine <1.13 doesn't support `screen.X` with `<empty>` → Legacy uses a flat one-level menu
- **GLSL:** every shader is written in **GLSL 120** — the common ground of OptiFine and Iris

</details>

---

## 🔧 How Vivid Lite boosts FPS

### 1️⃣ Forward lighting instead of Deferred

Lighting is computed **inline while drawing geometry** in `gbuffers_terrain`. No G-buffer extraction, no SSAO pass, no re-light pass, no TAA resolve.

```
BSL (deferred):  gbuffer×3 → deferred×2 → composite×6 → final   = 12 passes
Vivid Lite:      gbuffers → composite(opt) → composite1(opt) → final = 1–3 passes
```

### 2️⃣ 2-tile mipmap bloom instead of 7-tile

BSL manually downsamples 7 times → `7 × 270K` pixels. Vivid Lite enables `colortex0MipmapEnabled = true` → GPU builds mipmaps **for free**, we only sample 2 tiles at mip level 2 and 4 → `~150K` pixels.

### 3️⃣ Passes that can be turned off entirely (Iris)

```properties
program.composite.enabled  = WATER_FOG
program.composite1.enabled = BLOOM
shadow.enabled             = SHADOWS
```

When `SHADOWS` is off, Iris **doesn't render the shadow pass** → CPU saves ~1M vertices per frame.

### 4️⃣ Replacing expensive effects (instead of dropping them)

| BSL effect | FPS cost | Vivid Lite replacement | Why it's cheaper |
|---|---:|---|---|
| Screen-space reflections | 18% | Sky reflection + Fresnel | 1 texture lookup vs ray-march 32 steps |
| Volumetric light | 15% | Bloom | 2 mip tiles vs dense ray-march |
| SSAO | 10% | Fake AO from `lightmap²` | 1 multiply already in pipeline |
| TAA | 8% | 8-bit dithering | 1 hash vs velocity buffer + resolve |
| POM / Parallax | 7% | *(cut)* | POM needs 8–32 texture lookups per pixel |
| Motion blur | 5% | *(cut)* | Needs velocity buffer + full-screen blur |
| Deferred composite | 12% | Forward 1–3 passes | No G-buffer extraction |

**Total: ~75% frame time** saved vs BSL Medium on iGPU.

---

## ⚡ Performance menu

**⚡ Performance** menu in Shader Pack Settings — **18 options** in 3 groups:

### Skip entirely
| Option | Effect | FPS gain |
|---|---|---:|
| `SKIP_SKY_PROC` | 2-color gradient instead of procedural sky | ~5–8% |
| `SKIP_TONEMAP` | Skip tonemap curve, just gamma | ~1–2% |
| `SKIP_DITHERING` | Skip hash noise | ~0.5% |
| `NO_COLOR_TEMP` | Skip warm/cool tint in final pass | ~0.5% |
| `SKIP_SPECULAR` | Skip water sun glints (saves 1 `pow`) | ~1% |

### Cheap replacements
| Option | Effect | FPS gain |
|---|---|---:|
| `SIMPLE_WATER` | Flat water, no waves/Fresnel | ~3–5% |
| `LOW_RES_SHADOW` | Sample shadow at ½ res grid | ~3–4% |
| `SKIP_PCF` | 1-tap shadow instead of 4-tap | ~3% |
| `HALF_RES_BLOOM` | 3×3 bloom blur instead of 5×5 | ~2% |
| `SKY_LOD` | Full sky near, cheap sky far | ~2–3% |
| `SMALL_WAVE` | 1 wave instead of 3 | ~1% |
| `FAST_NORMALIZE` | `inversesqrt()` chain instead of `normalize()` | ~1% |
| `PRECOMPUTED_VIEW` | Avoid redundant `normalize()` in reflection | ~0.5% |
| `CHEAP_EMISSIVE` | Skip `smoothstep()` in emissive detection | ~0.5% |

### Distance culls
| Option | Effect | FPS gain |
|---|---|---:|
| `CULL_DISTANCE` | Cull expensive effects beyond | linear |
| `WAVE_CUTOFF` | Disable waves beyond this distance | linear |
| `SHADOW_CUTOFF` | Disable shadow lookup beyond | linear |
| `FOG_CUTOFF` | Skip fog beyond (no `length` / `exp` / sky lookup) | linear |
| `FOG_QUALITY` | 0 = off · 1 = linear · 2 = atmospheric | ~1.5% |

---

## 🛠️ Recommended Video Settings for weak hardware

| Setting | Value | Why |
|---|---|---|
| Render Distance | 6–8 chunks | Biggest FPS impact after shader |
| Simulation Distance | 5 | Reduces CPU load |
| Graphics | Fast | Dense leaves = fewer pixels |
| Clouds | Fast / Off | Fancy clouds are fill-rate heavy on iGPU |
| Entity Shadows | Off | The shader already draws real shadows |
| Particles | Decreased | Less overdraw |
| Max Framerate | 60 | Less heat, more consistent frame times |
| Mipmap Levels | 2 | Smooth enough, less VRAM |

**Recommended companion mods** *(Fabric, free)*: [Lithium](https://modrinth.com/mod/lithium) · [FerriteCore](https://modrinth.com/mod/ferrite-core) · [ImmediatelyFast](https://modrinth.com/mod/immediatelyfast) · [Entity Culling](https://modrinth.com/mod/entityculling) · [ModernFix](https://modrinth.com/mod/modernfix) · [Dynamic FPS](https://modrinth.com/mod/dynamic-fps)

> 💡 **RAM:** 4 GB → `-Xmx1536M`, 8 GB → `-Xmx2G`. Giving Java too much RAM on weak hardware *causes* more stutter.

---

## 🧪 How we cut lag line by line

Vivid Lite doesn't just "drop features". Every expensive BSL effect is **re-implemented** with GPU-friendly code. The tricks below are visible in every `*.glsl` file.

### GLSL-level techniques

| Trick | Effect | FPS gain |
|---|---|---:|
| **mad everywhere** | We write `a*b + c` style so the compiler fuses into a single MUL-ADD. `length(sp.xy)*SHADOW_DISTORT + (1.0 - SHADOW_DISTORT)` becomes one mad instead of 3 ops. | ~3–5% |
| **exp2 instead of exp** | GPU shaders implement exp2 in 1–2 cycles, exp in ~5. We pre-multiply constants so calls become `exp2(-x * K)` instead of `exp(-x)`. | ~2–4% |
| **Pre-fuse cosines** | `cos(dot(p, k1) * 2.1 + t*1.6)` would normally be 1 sin/cos per term. We bake the amplitude `2.1 * 0.045 = 0.0945` so the compiler can't undo our packing. | ~1% |
| **Branch culling** | `if (dist >= SHADOW_CUTOFF) return vec3(1.0)` skips 100% of the shadow texture lookup. `if (abs(normal.y) > 0.5 && dist < WAVE_CUTOFF)` skips the wave cosines on flat blocks. | ~5–8% |
| **Sky LOD** | `getSkyCheap(dir)` returns a 2-color gradient in 4 instructions; `getSkyColor` is the full procedural sky in ~40. We use the full one only for distance < 48 block, then drop to cheap. | ~2–3% |
| **No `pow` for envmap-style effects** | `pow(x, 6.0)` is 1 instruction on modern GPUs but 3–4 on old iGPUs. We replaced the original BSL god-ray `pow` with cheap `VdotS * VdotS * VdotS * VdotS * VdotS * VdotS`. | ~1% |
| **Pre-baked constants in library** | All `2.1 * 0.045` style constants are evaluated at glsl-parse time → zero runtime cost. The 3 water waves became `k * 0.0945 * c1` instead of `k * 2.1 * 0.045 * c1`. | tiny but free |
| **No uniform branches on hot path** | `#if` (preprocessor) is free; `if` (uniform branch) is divergent and slow on iGPU. We use #if everywhere the condition is known at compile time (preset, version, loader). | ~1–2% |

### Driver-level tricks

- **SkiaMipmap level pre-baked** — GLSLES doesn't allow inline mipmap gen; we sample 2 pre-built mip levels (2 and 4) instead of 7 downsample passes. Memory traffic cut 70%.
- **Texture unit pinning** — explicit types (sampler2DShadow, sampler2D) instead of generic `sampler` avoids driver re-validation.
- **Avoid earlyZ break** — we `discard` only when alpha < 0.1 in `gbuffers_terrain` (cutout blocks). Solid blocks always write → driver can use Hi-Z / Early-Z, which is a 30–50% speedup on iGPU.

### Memory tricks

- We never sample a texture we already have on hand (eg: `gShadow` is computed once, reused 4 times).
- All `vec3 = vec3(0.5, 0.5, 0.5) * x` are vectorized to a single DP3-equivalent in scalar.
- We pre-allocate `gShadow` and `gSkyMask` as globals so the compiler keeps them in registers, not stack.
- No per-pixel allocations, no loops over arrays.

### Frame budget at Medium preset (1080p, 60 FPS target)

Estimates on Intel UHD 620 (mainstream 2018 laptop):

| Pass | Cost | Note |
|---|---:|---|
| `gbuffers_terrain` | 100μs | Always runs. Most expensive program. |
| `gbuffers_water` | 40μs | Water + reflection |
| `composite` | 100μs | Skipped if FOG_QUALITY=0 |
| `composite1` | 12μs | Skipped if BLOOM=off |
| `final` | 100μs | Always runs |
| **Total** | **~352μs** | **≈ 2,840 FPS ceiling** |

Real-world FPS depends on scene complexity, render distance and mob count. These numbers are reference points for understanding where the cost lives.

---

## 📁 Shader pack structure

```
VividLite_v1.1.1_<preset>.zip
├── README.txt              # quick guide
├── README.md               # full docs (this file)
├── CHANGELOG.txt           # version history
└── shaders/
    ├── shaders.properties  # 8 profiles + menu structure (loader-aware)
    ├── block.properties    # block IDs (numeric or namespaced by version)
    ├── lib/
    │   ├── settings.glsl   # every #define — changes per build
    │   ├── uniforms.glsl
    │   ├── common.glsl
    │   ├── atmosphere.glsl # sky, sun, moon, sunset, night palette
    │   ├── lighting.glsl   # forward lighting + Purkinje shift
    │   ├── shadows.glsl    # distorted shadow map (+ legacy path)
    │   ├── fog.glsl        # 3 quality levels + night haze
    │   ├── waving.glsl     # wind animation
    │   └── water.glsl      # analytic wave normals
    ├── program/            # main GLSL sources (shared across dimensions)
    │   ├── gbuffers_terrain.glsl
    │   ├── gbuffers_water.glsl
    │   ├── gbuffers_entities.glsl
    │   ├── gbuffers_skybasic.glsl   # sky + stars + Milky Way
    │   ├── gbuffers_clouds.glsl
    │   ├── shadow.glsl
    │   ├── composite.glsl           # water depth fog (WATER_FOG)
    │   ├── composite1.glsl          # bloom (BLOOM)
    │   └── final.glsl               # tonemap + grading
    ├── *.vsh / *.fsh       # Overworld stubs → #include program/
    ├── world-1/            # Nether  (no shadow pass)
    ├── world1/             # End     (no shadow pass)
    └── lang/
        ├── en_us.lang
        └── vi_vn.lang
```

---

## ❓ FAQ

<details>
<summary><b>How weak is "weak enough" for Vivid Lite?</b></summary>

The Extra Potato preset runs on Intel HD 2000/3000 (2011) with 2 GB RAM, as long as vanilla + Sodium already hits ~35 FPS. It skips the procedural sky, tonemap, dithering, fog and water waves — keeping only the basic lighting + color grading.
</details>

<details>
<summary><b>How does Vivid Lite boost FPS compared to BSL?</b></summary>

3 main tricks: (1) Forward lighting instead of deferred — light computed inline while drawing geometry, no G-buffer / SSAO / TAA. (2) 2 mip tiles for bloom instead of 7 downsample passes. (3) Shadow pass can be skipped entirely — Iris leaves the CPU free. See the "How we cut lag" section for the full breakdown.
</details>

<details>
<summary><b>Why doesn't water reflect trees / buildings?</b></summary>

SSR requires 16–32 ray-march steps per pixel through the depth buffer — 15–20% FPS on iGPU. Vivid Lite uses sky reflection + Fresnel + sun glints instead, which captures ~90% of the "pretty water" feel at near-zero cost.
</details>

<details>
<summary><b>Is this a modified BSL?</b></summary>

No. Vivid Lite is written entirely from scratch. We only borrow the visual style of BSL (color palette, sunset palette, blue shadows, warm torch light). There is not a single line of BSL code in the pack — so feel free to use, modify and redistribute (please credit the author).
</details>

<details>
<summary><b>FPS is still low — what should I do first?</b></summary>

In priority order:
1. Switch to a lower preset (Medium → Low → High Potato → Potato → …)
2. Turn off **Shadows** or drop to 512px
3. Turn off **Mob & player shadows**
4. Reduce Render Distance to 6
5. Lower window resolution (1280×720)
6. Enable `SIMPLE_WATER` + `FOG_QUALITY = 0` in the ⚡ Performance menu
7. Install Lithium + Entity Culling
</details>

<details>
<summary><b>The night is too dark / too bright</b></summary>

Open `Shader Pack Settings → 🌙 Night`. Too dark: raise `NIGHT_BRIGHTNESS` and `MOONLIGHT`. Too bright: drop `NIGHT_BRIGHTNESS` to 0.6–0.8. Want a horror vibe: `MOONLIGHT = 0.25`, `MIN_LIGHT = 0`, `NIGHT_FOG = 2.0`. Remember that moonlight varies with the moon phase — a new-moon night is much darker than a full-moon night.
</details>

<details>
<summary><b>Does the Milky Way cost FPS?</b></summary>

Almost none. The Milky Way and the second star layer reuse the existing `hash13()` call in the pipeline — no extra texture, no noise map, no extra pass. The whole night system combined is under 1% FPS.
</details>

<details>
<summary><b>Does it support OptiFine?</b></summary>

Yes, since v1.1.0. In the Customize section, pick "OptiFine" loader (drops Iris-specific directives, uses the classic menu) or "Both" (default — runs on both). Note: Iris + Sodium still gives 30–80% more FPS than OptiFine on the same machine.
</details>

<details>
<summary><b>Which Minecraft versions are supported?</b></summary>

1.8 to 26.3, divided into 4 buckets: Legacy (1.8–1.12.2), Classic (1.13–1.16.5), Modern (1.17–1.20.6), Latest (1.21–26.3). Pick the right one in the Customize section — the builder generates block.properties, shadow path, buffer format and menu structure appropriate for that version.
</details>

<details>
<summary><b>I play 1.8.9 (PvP) — what should I pick?</b></summary>

Pick the "Legacy (1.8 – 1.12.2)" version bucket and the "OptiFine" loader. This build uses numeric block IDs (31, 18, 8…), manual shadow comparison instead of sampler2DShadow, RGB16 buffer format, and a flat one-level menu — all to run on legacy OptiFine HD U.
</details>

---

## 🐛 Bug reports & Contributing

- 🐞 **Shader bug?** Open an [Issue](../../issues) and paste the `ERROR:` line from `.minecraft/logs/latest.log` — include **Minecraft version**, **loader** (Iris/OptiFine) and **preset** you're using
- 💡 **Idea?** Open a [Discussion](../../discussions)
- 🔧 **Pull Request?** Welcome! Please test on at least 1 Iris version and 1 OptiFine version before submitting

---

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history.

### v1.1.1 — *More optimizations*
- ➕ 8 new perf options: `SKIP_PCF`, `HALF_RES_BLOOM`, `SKIP_SPECULAR`, `NO_COLOR_TEMP`, `FAST_NORMALIZE`, `PRECOMPUTED_VIEW`, `CHEAP_EMISSIVE`, `FOG_CUTOFF`
- ⚡ Low-level GLSL work: `inversesqrt` instead of `normalize`, inlined `pow(x,3)`, inlined `reflect()`, pre-fused blocklight formula, torch flicker 2 sin → 1 sin, End dimension early return
- 📈 Extra Potato now retains **~99%** of vanilla FPS

### v1.1.0 — *Compatibility & Night*
- ➕ Minecraft **1.8 → 26.3** (4 version buckets) and **OptiFine** support
- ➕ Loader selector: Both / Iris / OptiFine
- 🌙 Night reworked: phased moonlight, 3 tints, 2-layer stars, **Milky Way**, moon halo, night fog
- ➕ `shadow.enabled` for Iris — fully skips the shadow pass
- ➕ Legacy shadow path (`sampler2D` + manual compare) for old OptiFine
- ➕ GLSL micro-optimizations: `mad` everywhere, `exp2`, branch culling, pre-fused cosines
- ➕ 5 new perf+ options: `SKY_LOD`, `SMALL_WAVE`, `WAVE_CUTOFF`, `SHADOW_CUTOFF`, `VERTEX_AO`

### v1.0.1 — *Extra Potato*
- ➕ 4 new presets: Extra Potato, Low Potato, High Potato, Extra High
- ➕ 7 optimization options + ⚡ Performance menu
- 🐛 Fixed `undeclared identifier 'minLight'` in `terrain_solid`

### v1.0.0 — *Initial release*
- 🎉 BSL-style forward lighting, soft shadows, mipmap bloom, water reflection, 4 presets

---

## 📄 License

Inspired by the visual style of **BSL Shaders** (Capt Tatsu). **All Vivid Lite code is written from scratch** — no BSL code is used.

You are free to **use, modify, redistribute** — please **credit zaminhh** when doing so.

Not affiliated with Mojang or Microsoft. *Minecraft © Mojang AB.*

---

<div align="center">
<sub>Made with ❤️ for weak hardware · If you find this useful, give it a ⭐!</sub>
</div>
