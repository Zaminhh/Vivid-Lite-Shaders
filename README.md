<div align="center">

# ✨ Vivid Lite Shaders

**Shader Minecraft phong cách BSL — tối ưu cho máy yếu.**
Đẹp như BSL, nhẹ như Vanilla.

[![Version](https://img.shields.io/badge/version-1.1.0-fbbf24?style=flat-square)](CHANGELOG.md)
[![Minecraft](https://img.shields.io/badge/Minecraft-1.8%20→%2026.3-62b47a?style=flat-square)](#-tương-thích)
[![Iris](https://img.shields.io/badge/Iris-✔-8b5cf6?style=flat-square)](https://modrinth.com/mod/iris)
[![OptiFine](https://img.shields.io/badge/OptiFine-✔-38bdf8?style=flat-square)](https://optifine.net)
[![License](https://img.shields.io/badge/license-Free%20to%20use-10b981?style=flat-square)](#-license)

[Tải shader](#-cài-đặt) · [8 preset](#-8-preset) · [Cách boost FPS](#-vivid-lite-boost-fps-bằng-cách-nào) · [Tương thích](#-tương-thích) · [FAQ](#-faq)

</div>

---

## 🎯 Vivid Lite là gì?

Vivid Lite mang **hoàng hôn cam rực**, **bóng đổ mềm**, **nước phản chiếu bầu trời**, **bloom dịu** và **bầu trời đêm đầy sao** của BSL — nhưng được **viết lại từ đầu** để chạy mượt trên máy yếu, kể cả **siêu yếu**.

Không SSR, không volumetric light, không TAA, không SSAO. Chỉ giữ lại những gì thực sự tạo nên vẻ đẹp.

> 🌐 **Có web builder:** chọn preset → tinh chỉnh 60+ tùy chọn → tải `.zip` ngay trên trình duyệt. Không upload server, không cần đăng ký.

### Vivid Lite vs BSL

| Chỉ số | BSL v8 Medium | Vivid Lite Medium |
|---|---|---|
| Pass toàn màn hình | 6–12 | **1–3** |
| FPS giữ lại (iGPU) | ~30% | **~80%** |
| Kích thước `.zip` | ~1.5 MB | **~70 KB** |
| Shadow map mặc định | 2048px | 1024px *(méo — sắc tương đương 1536px)* |
| Bloom | 7 tile downsample | **2 tile mipmap** |
| Lighting model | Deferred | **Forward** |
| Minecraft hỗ trợ | 1.16+ | **1.8 → 26.3** |

---

## 🚀 Cài đặt

### Với Iris + Sodium *(khuyên dùng — FPS cao nhất)*

1. Cài **Fabric Loader** cho phiên bản Minecraft của bạn — [fabricmc.net](https://fabricmc.net/use/installer/)
2. Tải **[Sodium](https://modrinth.com/mod/sodium)** + **[Iris](https://modrinth.com/mod/iris)** (đúng version) → bỏ vào `.minecraft/mods/`
3. Tải `VividLite_v1.1.0_<preset>.zip` từ [Releases](../../releases)
4. Bỏ **nguyên file `.zip`** (❗ **không giải nén**) vào `.minecraft/shaderpacks/`
5. Trong game: `Options → Video Settings → Shader Packs` → chọn Vivid Lite → **Apply**

### Với OptiFine

1. Cài **[OptiFine](https://optifine.net/downloads)** (HD U, đúng version Minecraft)
2. Tải bản Vivid Lite build cho **OptiFine** hoặc **Cả hai** ở web builder
3. Bỏ `.zip` vào `.minecraft/shaderpacks/`
4. Trong game: `Options → Video Settings → Shaders...` → chọn Vivid Lite

<details>
<summary>📁 Thư mục shaderpacks ở đâu?</summary>

| Hệ điều hành | Đường dẫn |
|---|---|
| Windows | `%appdata%\.minecraft\shaderpacks` |
| macOS | `~/Library/Application Support/minecraft/shaderpacks` |
| Linux | `~/.minecraft/shaderpacks` |

</details>

---

## 🎚️ 8 Preset

Đổi bất cứ lúc nào trong game: **Shader Pack Settings → Profile**

### 🥔 Máy siêu yếu → yếu

| Preset | FPS giữ lại | Phù hợp | Đặc điểm |
|---|---|---|---|
| 💀 **Extra Potato** | ~98% | Intel HD 2000/3000, netbook Atom, 2GB RAM | Tối ưu hết mức. Bỏ sky procedural, tonemap, dithering, fog, sóng nước. |
| 🥔 **Low Potato** | ~95% | Intel HD 3000/4000, Celeron 2 nhân | Nước phẳng, sương tuyến tính rẻ, bỏ dithering. |
| 🍟 **Potato** | ~92% | Intel HD 4000, laptop 2012+ 4GB | Không bóng, không bloom. Ánh sáng + bầu trời đẹp. |
| 🌶️ **High Potato** | ~88% | Intel HD 5000/520, laptop VP 2014+ | Potato + bóng cứng 512px tầm gần 48 block. |

### ⚖️ Máy phổ thông

| Preset | FPS giữ lại | Phù hợp | Đặc điểm |
|---|---|---|---|
| 🌱 **Low** | ~85% | Intel HD 620, UHD 600, Vega 3 | Bóng cứng 768px + bloom nhẹ. |
| 🌤️ **Medium** ⭐ | ~80% | Iris Xe, Vega 8, GT 1030, MX150 | Bóng mềm 1024px, sương nước, lá đung đưa. **Đề xuất.** |

### ✨ Máy khỏe

| Preset | FPS giữ lại | Phù hợp | Đặc điểm |
|---|---|---|---|
| ✨ **High** | ~72% | GTX 1050 / RX 560+ | Bóng 2048px rất mềm, bóng màu, đuốc lung linh. |
| 💎 **Extra High** | ~65% | GTX 1060 / RX 580+ | Kịch cấu hình: bóng 2048/160, Dải Ngân Hà, cloud translucency. |

---

## 🌙 Ban đêm (mới ở v1.1.0)

Ban đêm được làm lại hoàn toàn:

- **Ánh trăng thật** có đổ bóng, cường độ theo **chu kỳ trăng** (`moonPhase`) — trăng tròn sáng gấp ~3× trăng non
- **3 tông màu đêm**: 🔵 Xanh dương (BSL) · 🟢 Xanh ngọc · 🟣 Tím
- **Quầng sáng mặt trăng** (moon halo) nhiều lớp
- **Sao 2 lớp** — lớp sáng + lớp mờ dày, có nhấp nháy và biến thiên màu (sao ấm / sao lạnh)
- **Dải Ngân Hà** vắt ngang bầu trời, có vón cục tự nhiên — chi phí gần 0 (tái dùng hash sẵn có)
- **Sương đêm** xanh lam tạo chiều sâu ở xa
- **Purkinje shift** — cảnh tối mất bão hòa và ngả về tông đêm, giống mắt người thật
- **Airglow** — chân trời đêm không bao giờ đen tuyền

| Tùy chọn | Mô tả |
|---|---|
| `NIGHT_BRIGHTNESS` | Độ sáng tổng thể ban đêm (0.4 – 2.0) |
| `MOONLIGHT` | Cường độ ánh trăng (0 – 2.0) |
| `NIGHT_TINT` | Tông màu: Xanh dương / Xanh ngọc / Tím |
| `STAR_BRIGHTNESS` | Độ sáng sao (0 – 3.0) |
| `MILKY_WAY` | Bật/tắt Dải Ngân Hà |
| `MOON_GLOW` | Bật/tắt quầng sáng mặt trăng |
| `NIGHT_FOG` | Sương đêm (0 – 2.0) |

---

## 🧩 Tương thích

Vivid Lite hỗ trợ **Minecraft 1.8 → 26.3** trên **cả Iris và OptiFine**. Web builder sinh file phù hợp với version bạn chọn.

| Nhóm version | Minecraft | Block IDs | Shadow | Buffer | Menu |
|---|---|---|---|---|---|
| **Legacy** | 1.8 – 1.12.2 | Số (`31`, `18`, `8`…) | Manual compare | `RGB16` | Phẳng |
| **Classic** | 1.13 – 1.16.5 | Namespaced | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |
| **Modern** | 1.17 – 1.20.6 | Namespaced + 1.17 blocks | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |
| **Latest** | 1.21 – 26.3 | Đầy đủ block mới nhất | Hardware PCF | `R11F_G11F_B10F` | Sub-screen |

### Chế độ loader

| Chế độ | Mô tả |
|---|---|
| 🔀 **Cả hai** *(mặc định)* | Chạy được trên cả Iris và OptiFine. Chỉ thị riêng Iris được giữ lại — OptiFine tự bỏ qua. |
| 🌈 **Iris / Sodium** | Bật đầy đủ `program.*.enabled` và `shadow.enabled` → Iris **skip hẳn** pass không dùng. FPS cao nhất. |
| 🔧 **OptiFine** | Bỏ mọi chỉ thị riêng Iris, dùng cú pháp menu cổ điển. An toàn nhất cho OptiFine đời cũ. |

<details>
<summary>⚙️ Chi tiết kỹ thuật của compatibility layer</summary>

- **Block IDs:** 1.8–1.12 không có namespaced ID → sinh `block.properties` bằng ID số (`block.10001=31 37 38 59 83 …`)
- **Shadow sampling:** `sampler2DShadow` + `shadow2D()` không đáng tin trên driver cũ → chế độ Legacy dùng `sampler2D` + `step(p.z, texture2D(...).x)` thủ công, kèm `shadowHardwareFiltering = false`
- **Buffer format:** `R11F_G11F_B10F` không được OptiFine cũ hỗ trợ đầy đủ → Legacy dùng `RGB16`
- **Menu:** OptiFine <1.13 không hỗ trợ `screen.X` với `<empty>` → Legacy dùng menu phẳng một cấp
- **GLSL:** toàn bộ shader viết bằng **GLSL 120** — chuẩn chung của cả OptiFine và Iris

</details>

---

## 🔧 Vivid Lite boost FPS bằng cách nào?

### 1️⃣ Forward lighting thay vì Deferred

Ánh sáng được tính **ngay lúc vẽ geometry** trong `gbuffers_terrain`. Không cần G-buffer extraction, không SSAO pass, không re-light pass, không TAA resolve.

```
BSL (deferred):  gbuffer×3 → deferred×2 → composite×6 → final   = 12 pass
Vivid Lite:      gbuffers  → composite(opt) → composite1(opt) → final = 1–3 pass
```

### 2️⃣ Bloom 2 tile mipmap thay vì 7 tile

BSL downsample thủ công 7 lần → `7 × 270K` pixel. Vivid Lite bật `colortex0MipmapEnabled = true` → GPU tạo mipmap **miễn phí**, chỉ đọc 2 tile ở mip level 2 và 4 → `~150K` pixel.

### 3️⃣ Pass có thể tắt hoàn toàn (Iris)

```properties
program.composite.enabled  = WATER_FOG
program.composite1.enabled = BLOOM
shadow.enabled             = SHADOWS
```

Khi tắt `SHADOWS`, Iris **không render shadow pass** → CPU bớt gần 1 triệu vertex mỗi frame.

### 4️⃣ Thay thế hiệu ứng đắt (thay vì bỏ hẳn)

| BSL dùng | FPS cost | Vivid Lite thay bằng | Tại sao rẻ hơn |
|---|---:|---|---|
| Screen-space reflections | 18% | Sky reflection + Fresnel | 1 texture lookup thay vì ray-march 32 bước |
| Volumetric light | 15% | Bloom nhẹ | 2 mip tile thay vì ray-march dày đặc |
| SSAO | 10% | Fake AO từ `lightmap²` | 1 phép nhân đã có sẵn trong pipeline |
| TAA | 8% | Dithering 8-bit | 1 hash thay vì velocity buffer + resolve |
| POM / Parallax | 7% | *(bỏ)* | POM cần 8–32 texture lookup mỗi pixel |
| Motion blur | 5% | *(bỏ)* | Cần velocity buffer + blur toàn màn hình |
| Deferred composite | 12% | Forward 1–3 pass | Không cần G-buffer extraction |

**Tổng: ~75% frame time** tiết kiệm so với BSL Medium trên iGPU.

---

## ⚡ Menu tối ưu

Menu **⚡ Performance** trong Shader Pack Settings:

| Option | Tác dụng | FPS gain |
|---|---|---:|
| `SKIP_SKY_PROC` | Gradient 2 màu thay sky procedural | ~5–8% |
| `SIMPLE_WATER` | Nước phẳng, không sóng/fresnel | ~3–5% |
| `LOW_RES_SHADOW` | Sample shadow ở ½ res grid | ~3–4% |
| `FOG_QUALITY` | 0 = tắt · 1 = linear rẻ · 2 = khí quyển | ~1.5% |
| `SKIP_TONEMAP` | Bỏ đường cong tonemap, chỉ gamma | ~1–2% |
| `SKIP_DITHERING` | Bỏ hash noise chống banding | ~0.5% |
| `CULL_DISTANCE` | Cắt hiệu ứng đắt ngoài khoảng cách | tuyến tính |

---

## 🛠️ Video Settings đề xuất cho máy yếu

| Setting | Giá trị | Vì sao |
|---|---|---|
| Render Distance | 6–8 chunk | Ảnh hưởng FPS nhiều nhất sau shader |
| Simulation Distance | 5 | Giảm tải CPU |
| Graphics | Fast | Lá cây đặc = ít pixel cần vẽ |
| Clouds | Fast / Off | Mây fancy tốn fill-rate trên iGPU |
| Entity Shadows | Off | Shader đã có bóng thật |
| Particles | Decreased | Bớt overdraw |
| Max Framerate | 60 | Đỡ nóng máy, khung hình đều hơn |
| Mipmap Levels | 2 | Vừa đủ mượt, ít VRAM |

**Mod nên cài thêm** *(Fabric, miễn phí)*: [Lithium](https://modrinth.com/mod/lithium) · [FerriteCore](https://modrinth.com/mod/ferrite-core) · [ImmediatelyFast](https://modrinth.com/mod/immediatelyfast) · [Entity Culling](https://modrinth.com/mod/entityculling) · [ModernFix](https://modrinth.com/mod/modernfix) · [Dynamic FPS](https://modrinth.com/mod/dynamic-fps)

> 💡 **RAM:** máy 4 GB đặt `-Xmx1536M`, máy 8 GB đặt `-Xmx2G`. Cấp quá nhiều RAM cho Java trên máy yếu lại **làm giật hơn**.

---

## 📁 Cấu trúc shader pack

```
VividLite_v1.1.0_<preset>.zip
├── README.txt              # hướng dẫn nhanh
├── README.md               # tài liệu đầy đủ
├── CHANGELOG.txt           # lịch sử phiên bản
└── shaders/
    ├── shaders.properties  # 8 profile + cấu trúc menu (loader-aware)
    ├── block.properties    # block IDs (số hoặc namespaced tùy version)
    ├── lib/
    │   ├── settings.glsl   # tất cả #define — thay đổi theo builder
    │   ├── uniforms.glsl
    │   ├── common.glsl
    │   ├── atmosphere.glsl # sky, sun, moon, sunset, night palette
    │   ├── lighting.glsl   # forward lighting + Purkinje shift
    │   ├── shadows.glsl    # distorted shadow map (+ legacy path)
    │   ├── fog.glsl        # 3 mức chất lượng + night haze
    │   ├── waving.glsl     # wind animation
    │   └── water.glsl      # analytic wave normals
    ├── program/            # nguồn GLSL chính (dùng chung 3 dimension)
    │   ├── gbuffers_terrain.glsl
    │   ├── gbuffers_water.glsl
    │   ├── gbuffers_entities.glsl
    │   ├── gbuffers_skybasic.glsl   # sky + stars + Milky Way
    │   ├── gbuffers_clouds.glsl
    │   ├── shadow.glsl
    │   ├── composite.glsl           # water depth fog  (WATER_FOG)
    │   ├── composite1.glsl          # bloom            (BLOOM)
    │   └── final.glsl               # tonemap + grading
    ├── *.vsh / *.fsh       # stub Overworld → #include program/
    ├── world-1/            # Nether  (không shadow pass)
    ├── world1/             # End     (không shadow pass)
    └── lang/
        ├── en_us.lang
        └── vi_vn.lang
```

---

## ❓ FAQ

<details>
<summary><b>Máy yếu cỡ nào thì chạy được?</b></summary>

Preset **Extra Potato** chạy được trên Intel HD 2000/3000 (2011) với 2 GB RAM, miễn là vanilla + Sodium đã đạt ~35 FPS. Preset này bỏ sky procedural, tonemap, dithering, sương và sóng nước — gần như chỉ còn ánh sáng cơ bản + grading màu.
</details>

<details>
<summary><b>OptiFine hay Iris tốt hơn?</b></summary>

**Iris + Sodium** luôn cho FPS cao hơn OptiFine (thường 30–80%), và hỗ trợ `program.*.enabled` để skip hẳn pass không dùng. Chỉ dùng OptiFine nếu bạn cần shader pack/resource pack chỉ OptiFine hỗ trợ, hoặc chơi version rất cũ.
</details>

<details>
<summary><b>Tại sao nước không phản chiếu cây cối / nhà cửa?</b></summary>

SSR cần ray-march 16–32 bước qua depth buffer mỗi pixel → 15–20% FPS trên iGPU. Vivid Lite thay bằng phản chiếu bầu trời có Fresnel + vệt nắng, chiếm ~90% cảm giác "nước đẹp" với chi phí gần bằng 0.
</details>

<details>
<summary><b>Đây có phải BSL bản chỉnh sửa không?</b></summary>

**Không.** Vivid Lite viết mới hoàn toàn, chỉ lấy cảm hứng từ **phong cách hình ảnh** của BSL (màu sắc, hoàng hôn, bóng xanh, đuốc ấm). Không có dòng code nào của BSL.
</details>

<details>
<summary><b>FPS vẫn thấp thì làm gì trước?</b></summary>

Theo thứ tự ưu tiên:
1. Đổi sang preset thấp hơn (Medium → Low → High Potato → Potato → …)
2. Tắt **Bóng đổ** hoặc giảm xuống 512px
3. Tắt **Mob & người chơi đổ bóng**
4. Giảm Render Distance xuống 6
5. Hạ độ phân giải cửa sổ (1280×720)
6. Bật `SIMPLE_WATER` + `FOG_QUALITY = 0` trong menu ⚡ Performance
7. Cài Lithium + Entity Culling
</details>

<details>
<summary><b>Ban đêm quá tối / quá sáng?</b></summary>

Vào `Shader Pack Settings → 🌙 Ban đêm`:
- Quá tối → tăng `NIGHT_BRIGHTNESS` và `MOONLIGHT`
- Quá sáng → giảm `NIGHT_BRIGHTNESS` xuống 0.6–0.8
- Muốn tối bí ẩn → `MOONLIGHT = 0.25`, `MIN_LIGHT = 0`, `NIGHT_FOG = 2.0`
</details>

<details>
<summary><b>Bóng đổ bị vỡ / răng cưa ở xa?</b></summary>

Shadow map được "méo" để dồn resolution quanh người chơi, nên bóng ở xa mềm hơn là bình thường. Muốn sắc hơn: tăng Shadow Resolution (1024 → 1536) hoặc giảm Shadow Distance (96 → 64). Nếu bật `LOW_RES_SHADOW` thì tắt đi.
</details>

---

## 🐛 Báo lỗi & Đóng góp

- 🐞 **Lỗi shader?** Mở [Issue](../../issues) và dán dòng có `ERROR:` trong `.minecraft/logs/latest.log` — kèm **version Minecraft**, **loader** (Iris/OptiFine) và **preset** đang dùng
- 💡 **Ý tưởng?** Mở [Discussion](../../discussions)
- 🔧 **Pull Request?** Hoan nghênh! Vui lòng test trên ít nhất 1 version Iris và 1 version OptiFine trước khi submit

---

## 📜 Changelog

Xem đầy đủ tại [CHANGELOG.md](CHANGELOG.md).

### v1.1.0 — *Compatibility & Night*
- ➕ Hỗ trợ **Minecraft 1.8 → 26.3** (4 nhóm version) và **OptiFine**
- ➕ Chọn loader: Cả hai / Iris / OptiFine
- 🌙 Làm lại ban đêm: ánh trăng theo chu kỳ, 3 tông màu, sao 2 lớp, **Dải Ngân Hà**, quầng trăng, sương đêm, Purkinje shift
- ➕ `shadow.enabled` cho Iris → tắt shadow pass triệt để hơn
- ➕ Legacy shadow path (`sampler2D` + manual compare) cho OptiFine cũ

### v1.0.1 — *Extra Potato*
- ➕ 4 preset mới: Extra Potato, Low Potato, High Potato, Extra High
- ➕ 7 tùy chọn tối ưu + menu ⚡ Performance
- 🐛 Sửa lỗi `undeclared identifier 'minLight'`

### v1.0.0 — *Initial release*
- 🎉 Forward lighting kiểu BSL, bóng đổ mềm, bloom mipmap, nước phản chiếu, 4 preset

---

## 📄 License

Lấy cảm hứng từ phong cách hình ảnh của **BSL Shaders** (Capt Tatsu). **Toàn bộ mã Vivid Lite được viết mới từ đầu** — không sử dụng bất kỳ dòng code nào của BSL.

Bạn được tự do **dùng, sửa, chia sẻ, phát hành lại** — vui lòng **ghi nguồn "Vivid Lite Shaders"**.

Không liên kết với Mojang hay Microsoft. *Minecraft © Mojang AB.*

---

<div align="center">
<sub>Made with ❤️ cho máy yếu · Nếu thấy hữu ích, cho một ⭐ nhé!</sub>
</div>
