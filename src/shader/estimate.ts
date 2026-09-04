import type { ShaderSettings } from './settings';

export interface CostPart { key: string; label: string; cost: number; tip: string; }

const SHADOW_RES_COST: Record<number, number> = { 512:4, 768:6, 1024:9, 1536:14, 2048:20 };
const SHADOW_DIST_FACTOR: Record<number, number> = { 48:0.7, 64:0.85, 80:1, 96:1.1, 128:1.35, 160:1.6 };

export function estimateCost(s: ShaderSettings): { parts: CostPart[]; total: number; retention: number } {
  const parts: CostPart[] = [];
  parts.push({ key:'base', label:'Ánh sáng forward + bầu trời + tonemap', cost:5, tip:'Không thể tắt — đây là cái làm Minecraft đẹp hơn vanilla.' });

  if (s.shadows) {
    let c = (SHADOW_RES_COST[s.shadowRes]??9) * (SHADOW_DIST_FACTOR[s.shadowDistance]??1);
    c += s.shadowSoftness * 1.5;
    if (s.coloredShadows) c += 2;
    if (s.entityShadows) c += 2;
    parts.push({ key:'shadows', label:`Bóng đổ ${s.shadowRes}px / ${s.shadowDistance} block`, cost:c,
      tip:'Shadow pass render lại toàn bộ chunk trong tầm xa. Giảm resolution / distance = giảm lượng geometry phải render.' });
  }
  if (s.bloom) parts.push({ key:'bloom', label:'Bloom (2 tile mipmap)', cost:3.5, tip:'BSL dùng 7 tile 512×512 mỗi tile → 7×270K pixel. Ta dùng 2 tile từ mipmap → chỉ ~150K pixel.' });
  if (s.waterFog) parts.push({ key:'waterFog', label:'Sương nước theo độ sâu', cost:2, tip:'1 pass toàn màn hình đọc 2 depth buffer → chỉ thêm ~2% frame time.' });
  const waving = (s.wavingPlants?0.8:0) + (s.wavingLeaves?0.8:0);
  if (waving > 0) parts.push({ key:'waving', label:'Cỏ / lá đung đưa', cost:waving, tip:'Vertex shader thêm 2–3 sin/cos mỗi đỉnh cây → gần như miễn phí.' });
  const water = (s.waterWaves?0.4:0) + (s.waterReflection?0.6:0);
  if (water > 0) parts.push({ key:'water', label:'Sóng & phản chiếu nước', cost:water, tip:'Sóng = 3 cos trong fragment. Phản chiếu = 1 texture lookup sky + pow() cho Fresnel.' });
  if (s.torchFlicker) parts.push({ key:'flicker', label:'Đuốc lung linh', cost:0.3, tip:'1 sin() call mỗi pixel có ánh đuốc → miễn phí.' });
  if (s.ao) parts.push({ key:'ao', label:'AO giả (tối góc)', cost:0.2, tip:'Nhân lightmap.x² → không thêm phép tính nào đáng kể.' });
  if (s.cloudTranslucency) parts.push({ key:'cloud', label:'Mây trong sáng', cost:0.5, tip:'Mây nhận ánh nắng thay vì chỉ màu xám.' });

  const total = parts.reduce((a,p) => a + p.cost, 0);
  const retention = 100 / (1 + total / 100);
  return { parts, total, retention };
}

export interface MachineExample { name: string; gpu: string; vanillaFps: number; bslFps: number; }
export const MACHINES: MachineExample[] = [
  { name:'Laptop văn phòng cũ', gpu:'Intel HD 4000 · RD 6', vanillaFps:45, bslFps:9 },
  { name:'Laptop phổ thông', gpu:'Intel UHD 620 · RD 8', vanillaFps:70, bslFps:18 },
  { name:'PC / laptop gaming rẻ', gpu:'GTX 1050 · RD 12', vanillaFps:180, bslFps:55 },
];

export const BSL_RETENTION = 30;

// Detailed FPS breakdown per BSL feature that we remove
export interface BSLFeature { name: string; costPct: number; replacement: string; whyCheap: string; }
export const BSL_FEATURES: BSLFeature[] = [
  { name:'Screen-space reflections (SSR)', costPct:18, replacement:'Sky reflection + specular', whyCheap:'1 texture lookup + pow() thay vì ray-march 16–32 bước qua depth buffer.' },
  { name:'Volumetric light (god rays)', costPct:15, replacement:'Bloom nhẹ', whyCheap:'Bloom 2 tile từ mipmap (~150K pixel) thay vì 1 pass ray-march dày đặc.' },
  { name:'TAA (temporal AA)', costPct:8, replacement:'Dithering 8-bit', whyCheap:'0 pass phụ. Chỉ thêm (hash−0.5)/255 vào final — chống banding gần như miễn phí.' },
  { name:'SSAO', costPct:10, replacement:'AO giả từ lightmap', whyCheap:'lightmap.x² thay vì 8–16 depth sample theo hemisphere + blur 2 pass.' },
  { name:'Motion blur', costPct:5, replacement:'(bỏ)', whyCheap:'Motion blur cần velocity buffer + blur theo hướng — 1 pass toàn màn hình.' },
  { name:'POM / Parallax', costPct:7, replacement:'(bỏ)', whyCheap:'POM cần 8–32 texture lookup mỗi pixel. Ta dùng bump map 0 cost (flat normal).' },
  { name:'Bloom 7 tile (BSL)', costPct:6, replacement:'Bloom 2 tile mipmap', whyCheap:'Mipmap cấp 2 và 4 có sẵn → không cần downsample thủ công. 2 tile thay vì 7.' },
  { name:'Deferred composite (6+ pass)', costPct:12, replacement:'Forward 1–3 pass', whyCheap:'Ánh sáng tính ngay trong gbuffers → không cần G-buffer extraction + re-light.' },
];
