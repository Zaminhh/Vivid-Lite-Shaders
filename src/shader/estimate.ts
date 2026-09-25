import type { ShaderSettings } from './settings';

export interface CostPart { key: string; label: string; cost: number; tip?: string; }

const SHADOW_RES_COST: Record<number, number> = { 512:4, 768:6, 1024:9, 1536:14, 2048:20 };
const SHADOW_DIST_FACTOR: Record<number, number> = { 32:0.55, 48:0.7, 64:0.85, 80:1, 96:1.1, 128:1.35, 160:1.6 };

export function estimateCost(s: ShaderSettings): { parts: CostPart[]; total: number; retention: number; savings: CostPart[] } {
  const parts: CostPart[] = [];
  // Base cost — reduced when Extra Potato flags kick in
  let baseCost = 5;
  if (s.skipSky) baseCost -= 1.5;
  if (s.skipTonemap) baseCost -= 0.4;
  if (s.skipDithering) baseCost -= 0.2;
  parts.push({ key:'base', label:'Base pipeline (lighting + sky + tonemap)', cost: Math.max(1.5, baseCost),
    tip:'Forward lighting, sky, tonemap. SKIP_SKY_PROC / TONEMAP / DITHERING reduce this.' });

  if (s.shadows) {
    let c = (SHADOW_RES_COST[s.shadowRes] ?? 9) * (SHADOW_DIST_FACTOR[s.shadowDistance] ?? 1);
    c += s.shadowSoftness * 1.5;
    if (s.coloredShadows) c += 2;
    if (s.entityShadows) c += 2;
    if (s.lowResShadow) c *= 0.6;
    parts.push({ key:'shadows', label:`Shadows ${s.shadowRes}px / ${s.shadowDistance} block${s.lowResShadow ? ' (½ res)' : ''}`, cost:c,
      tip:'Shadow pass re-renders every chunk in range. LOW_RES_SHADOW saves 40%.' });
  }
  if (s.bloom) parts.push({ key:'bloom', label:'Bloom (2 mipmap tiles)', cost:3.5, tip:'BSL uses 7 tiles. We use 2 mipmap tiles.' });
  if (s.waterFog) parts.push({ key:'waterFog', label:'Water depth fog', cost:2, tip:'1 full-screen pass reading 2 depth buffers.' });
  const waving = (s.wavingPlants ? 0.8 : 0) + (s.wavingLeaves ? 0.8 : 0);
  if (waving > 0) parts.push({ key:'waving', label:'Waving grass / leaves', cost:waving, tip:'Vertex shader — nearly free.' });
  if (!s.simpleWater) {
    const water = (s.waterWaves ? 0.4 : 0) + (s.waterReflection ? 0.6 : 0);
    if (water > 0) parts.push({ key:'water', label:`Water waves & reflection (cull ${s.cullDistance}b)`, cost: water * Math.min(1, s.cullDistance / 128),
      tip:'CULL_DISTANCE reduces cost linearly with distance.' });
  }
  if (s.torchFlicker) parts.push({ key:'flicker', label:'Torch flicker', cost:0.3, tip:'One sin() call.' });
  if (s.ao) parts.push({ key:'ao', label:'Fake AO (corner darkening)', cost:0.2, tip:'lightmap² — free.' });
  if (s.cloudTranslucency) parts.push({ key:'cloud', label:'Cloud translucency', cost:0.5 });
  if (s.colorGrading) parts.push({ key:'grade', label:'BSL color grade (final pass)', cost:0.3, tip:'~12 ALU per pixel, no texture reads. Sunset weight is computed per vertex.' });
  if (s.fogQuality === 2) parts.push({ key:'fog', label:'Full atmospheric fog', cost:1.2, tip:'FOG_QUALITY=1 (cheap linear) costs only 0.3%.' });
  else if (s.fogQuality === 1) parts.push({ key:'fog', label:'Cheap linear fog', cost:0.3 });

  // Track savings for display
  const savings: CostPart[] = [];
  if (s.skipSky) savings.push({ key:'skipSky', label:'Skip procedural sky', cost:1.5, tip:'2-color gradient instead of full sky.' });
  if (s.skipTonemap) savings.push({ key:'skipTonemap', label:'Skip tonemap curve', cost:0.4, tip:'Just gamma.' });
  if (s.skipDithering) savings.push({ key:'skipDithering', label:'Skip dithering', cost:0.2, tip:'Skips 1 hash/pixel.' });
  if (s.simpleWater) savings.push({ key:'simpleWater', label:'Simple flat water', cost:1.5, tip:'Skips waves + reflection + Fresnel.' });
  if (s.lowResShadow && s.shadows) savings.push({ key:'lowResShadow', label:'Half-res shadow', cost:3, tip:'Snap sampling to half-res grid.' });
  if (s.fogQuality === 0) savings.push({ key:'noFog', label:'Fog off', cost:1.5, tip:'No exp() + no sky lookup for fog.' });

  const total = parts.reduce((a, p) => a + p.cost, 0);
  const retention = 100 / (1 + total / 100);
  return { parts, total, retention, savings };
}

export interface MachineExample { name: string; gpu: string; vanillaFps: number; bslFps: number; }
export const MACHINES: MachineExample[] = [
  { name:'Old office laptop', gpu:'Intel HD 4000 · RD 6', vanillaFps:45, bslFps:9 },
  { name:'Mainstream laptop', gpu:'Intel UHD 620 · RD 8', vanillaFps:70, bslFps:18 },
  { name:'Budget gaming PC / laptop', gpu:'GTX 1050 · RD 12', vanillaFps:180, bslFps:55 },
];

export const BSL_RETENTION = 30;

// Detailed FPS breakdown per BSL feature that we remove
export interface BSLFeature { name: string; costPct: number; replacement: string; whyCheap: string; }
export const BSL_FEATURES: BSLFeature[] = [
  { name:'Screen-space reflections (SSR)', costPct:18, replacement:'Sky reflection + specular', whyCheap:'1 texture lookup + pow() instead of ray-marching 16–32 steps through the depth buffer.' },
  { name:'Volumetric light (god rays)', costPct:15, replacement:'Subtle bloom', whyCheap:'2 mip tiles (~150K pixels) instead of a dense ray-march pass.' },
  { name:'TAA (temporal AA)', costPct:8, replacement:'8-bit dithering', whyCheap:'No extra pass — just add (hash − 0.5)/255 to the final color.' },
  { name:'SSAO', costPct:10, replacement:'Fake AO from lightmap', whyCheap:'lightmap.x² instead of 8–16 hemispherical depth samples + a 2-pass blur.' },
  { name:'Motion blur', costPct:5, replacement:'(dropped)', whyCheap:'Motion blur needs a velocity buffer + directional blur — a full-screen pass.' },
  { name:'POM / Parallax', costPct:7, replacement:'(dropped)', whyCheap:'POM needs 8–32 texture lookups per pixel. We use a flat normal instead (0 cost).' },
  { name:'Bloom 7 tile (BSL)', costPct:6, replacement:'Bloom 2 mipmap tiles', whyCheap:'Mip levels 2 and 4 are already built by the GPU → no manual downsample. 2 tiles instead of 7.' },
  { name:'Deferred composite (6+ pass)', costPct:12, replacement:'Forward 1–3 pass', whyCheap:'Light is computed inline in the gbuffer → no G-buffer extraction and re-light.' },
];
