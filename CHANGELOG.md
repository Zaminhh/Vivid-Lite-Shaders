# Changelog

Tất cả thay đổi đáng chú ý của **Vivid Lite Shaders**.

---

## [1.1.0] — Compatibility & Night

### ➕ Tương thích mở rộng
- Hỗ trợ **Minecraft 1.8 → 26.3**, chia 4 nhóm version:
  - **Legacy** (1.8 – 1.12.2) — block ID số, shadow manual compare, buffer `RGB16`, menu phẳng
  - **Classic** (1.13 – 1.16.5) — namespaced ID, hardware PCF, HDR buffer
  - **Modern** (1.17 – 1.20.6) — thêm block 1.17+ (froglight, sculk, amethyst, candle)
  - **Latest** (1.21 – 26.3) — pale oak, creaking heart, eyeblossom, wildflowers, copper bulb, vault
- Hỗ trợ **OptiFine** song song với Iris. Chọn 1 trong 3 chế độ loader:
  - 🔀 **Cả hai** — chạy được trên cả hai (mặc định)
  - 🌈 **Iris** — bật `program.*.enabled` + `shadow.enabled` để skip pass triệt để
  - 🔧 **OptiFine** — bỏ chỉ thị riêng Iris, menu cổ điển
- Legacy shadow path: `sampler2D` + `step()` manual compare thay cho `sampler2DShadow`,
  kèm `shadowHardwareFiltering = false` — chạy được trên driver và OptiFine đời cũ

### 🌙 Làm lại ban đêm
- **Ánh trăng thật có đổ bóng**, cường độ theo chu kỳ trăng (`moonPhase`) — trăng tròn sáng ~3× trăng non
- **3 tông màu đêm**: Xanh dương (BSL) · Xanh ngọc · Tím
- **Sao 2 lớp** — lớp sáng thưa + lớp mờ dày, nhấp nháy độc lập, biến thiên màu ấm/lạnh
- **Dải Ngân Hà** vắt ngang bầu trời với vón cục tự nhiên (tái dùng hash sẵn có → chi phí ~0)
- **Quầng sáng mặt trăng** nhiều lớp (`MOON_GLOW`)
- **Sương đêm** xanh lam tạo chiều sâu ở xa (`NIGHT_FOG`)
- **Purkinje shift** — cảnh tối mất bão hòa và ngả về tông đêm, mô phỏng mắt người
- **Airglow** — chân trời đêm không bao giờ đen tuyền
- 7 tùy chọn mới: `NIGHT_BRIGHTNESS`, `MOONLIGHT`, `NIGHT_TINT`, `STAR_BRIGHTNESS`,
  `MILKY_WAY`, `MOON_GLOW`, `NIGHT_FOG`
- Menu mới **🌙 Ban đêm** trong Shader Pack Settings

### 🔧 Khác
- Thêm `shadow.enabled=SHADOWS` (Iris) → tắt shadow pass triệt để hơn
- `block.properties` giờ sinh theo version — không còn block ID không tồn tại gây warning
- Buffer format tự chọn theo version (`RGB16` cho legacy, `R11F_G11F_B10F` cho modern)
- README.md đầy đủ ở thư mục root cho GitHub

---

## [1.0.1] — Extra Potato

### ➕ 4 preset mới (tổng 8)
| Preset | FPS giữ lại | Máy |
|---|---|---|
| 💀 Extra Potato | ~98% | Intel HD 2000/3000, netbook |
| 🥔 Low Potato | ~95% | Intel HD 3000/4000 |
| 🌶️ High Potato | ~88% | Intel HD 5000/520 |
| 💎 Extra High | ~65% | GTX 1060+ |

### ⚡ 7 tùy chọn tối ưu mới
- `SKIP_SKY_PROC` — gradient 2 màu thay sky procedural (~5–8% FPS)
- `SKIP_TONEMAP` — bỏ đường cong tonemap (~1–2%)
- `SKIP_DITHERING` — bỏ hash noise chống banding (~0.5%)
- `SIMPLE_WATER` — nước phẳng, không sóng/fresnel (~3–5%)
- `LOW_RES_SHADOW` — sample shadow ở ½ res grid (~3–4%)
- `CULL_DISTANCE` — cắt hiệu ứng đắt ngoài khoảng cách
- `FOG_QUALITY` — 0 tắt / 1 linear rẻ / 2 khí quyển (~1.5%)
- Menu mới **⚡ Performance** trong game

### 🐛 Sửa lỗi
- Lỗi biên dịch `ERROR: Use of undeclared identifier 'minLight'` trong `terrain_solid`
  — biến `minLight` được dùng trong `#if CAVE_LIGHTING == 1` trước khi khai báo

---

## [1.0.0] — Initial release

- Forward lighting kiểu BSL (nắng ấm, bóng xanh, đuốc cam)
- Bóng đổ mềm với shadow map méo + hardware PCF
- Bloom 2 tile mipmap (BSL dùng 7 tile)
- Nước phản chiếu bầu trời + Fresnel + vệt nắng lấp lánh
- Cỏ, hoa, lá đung đưa (vertex animation)
- Sương khí quyển theo giờ trong ngày
- Hoàng hôn cam hồng, sao đêm, mặt trời tròn
- Tonemap sống động + saturation + vibrance + vignette + dithering
- Hỗ trợ Nether và End (không shadow pass = thêm FPS)
- Menu tiếng Việt + tiếng Anh
- 4 profile: Potato, Low, Medium, High
- 40+ tùy chọn đổi được trong game

---

[1.1.0]: ../../releases/tag/v1.1.0
[1.0.1]: ../../releases/tag/v1.0.1
[1.0.0]: ../../releases/tag/v1.0.0
