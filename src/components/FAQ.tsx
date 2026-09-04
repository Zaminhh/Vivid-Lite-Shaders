import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

const QA = [
  { q: 'How weak is "weak enough" for Vivid Lite?', a: 'The Extra Potato preset runs on Intel HD 2000/3000 (2011) with 2 GB RAM, as long as vanilla + Sodium already hits ~35 FPS. It skips the procedural sky, tonemap, dithering, fog and water waves — keeping only the basic lighting + color grading.' },
  { q: 'How does Vivid Lite boost FPS compared to BSL?', a: '3 main tricks: (1) Forward lighting instead of deferred — light computed inline while drawing geometry, no G-buffer / SSAO / TAA. (2) 2 mip tiles for bloom instead of 7 downsample passes. (3) Shadow pass can be skipped entirely — Iris leaves the CPU free. See the "How we cut lag" section for the full breakdown.' },
  { q: 'Why doesn\'t water reflect trees / buildings?', a: 'SSR requires 16–32 ray-march steps per pixel through the depth buffer — 15–20% FPS on iGPU. Vivid Lite uses sky reflection + Fresnel + sun glints instead, which captures ~90% of the "pretty water" feel at near-zero cost.' },
  { q: 'Is this a modified BSL?', a: 'No. Vivid Lite is written entirely from scratch. We only borrow the visual style of BSL (color palette, sunset palette, blue shadows, warm torch light). There is not a single line of BSL code in the pack — so feel free to use, modify and redistribute (please credit the author).' },
  { q: 'What is a "full-screen pass" and why does fewer = faster?', a: 'Each pass reads + writes ~2M pixels (1080p = ~8 MB). Fewer passes = less frame buffer traffic = less GPU stall. BSL Medium runs 6–12 passes (SSAO, SSR, TAA, bloom×3, god rays…). Vivid Lite runs 1–3, and 2 of them are entirely skippable.' },
  { q: 'What is a "distorted" shadow map?', a: 'Normally the shadow map uses its resolution uniformly — far areas (rarely looked at) get many pixels wasted. A distorted shadow map concentrates resolution around the player, so 768px distorted looks as crisp as 1536px uniform. Less resolution → sharper shadows → more FPS.' },
  { q: 'How is the 2-tile mipmap bloom different from BSL\'s 7-tile bloom?', a: 'BSL manually downsamples 7 tiles of 512×512 → 7×270K pixels to process. Vivid Lite enables colortex0MipmapEnabled=true → GPU builds mipmaps for free. We only sample 2 tiles from mip levels 2 and 4. Same soft halo result, but only ~150K pixels of work instead of ~1.9M.' },
  { q: 'Why is forward cheaper than deferred?', a: 'Deferred must: write G-buffer (normal + depth + material ID) → SSAO pass → re-light every pixel → SSR ray-march → TAA resolve → bloom. Each step is a full-screen pass. Forward computes light inline while drawing geometry — 1 sweep, no G-buffer, no re-light.' },
  { q: 'How do I change brightness / color in-game?', a: 'Open Shader Pack Settings → "Color & Post-processing" to change Exposure, Saturation, Contrast, Color Temperature. Open "Lighting" for Sunlight, Ambient, Minimum cave light. The menu is available in English and Vietnamese.' },
  { q: 'FPS is still low — what should I do first?', a: 'In priority order: (1) Turn off Shadows or drop to 512px. (2) Turn off Mob Shadows. (3) Reduce Render Distance to 6. (4) Lower window resolution (1280×720). (5) Turn off Bloom + Water Fog. (6) Install Lithium + Entity Culling. See Install section.' },
  { q: 'Is the night too dark / too bright?', a: 'Open Shader Pack Settings → 🌙 Night. Too dark: raise NIGHT_BRIGHTNESS and MOONLIGHT. Too bright: drop NIGHT_BRIGHTNESS to 0.6–0.8. Want a horror vibe: MOONLIGHT = 0.25, MIN_LIGHT = 0, NIGHT_FOG = 2.0. Remember that moonlight varies with the moon phase — a new moon night is much darker than a full moon night.' },
  { q: 'Does the Milky Way cost FPS?', a: 'Almost none. The Milky Way and the second star layer reuse the existing hash13() call in the pipeline — no extra texture, no noise map, no extra pass. The whole night system combined is under 1% FPS.' },
  { q: 'Does it support OptiFine?', a: 'Yes, since v1.1.0. In the Customize section, pick "OptiFine" loader (drops Iris-only directives, uses classic menu) or "Both" (default — runs on both). Note: Iris + Sodium still gives 30–80% more FPS than OptiFine on the same machine.' },
  { q: 'Which Minecraft versions are supported?', a: '1.8 to 26.3, divided into 4 buckets: Legacy (1.8–1.12.2), Classic (1.13–1.16.5), Modern (1.17–1.20.6), Latest (1.21–26.3). Pick the right one in the Customize section — the builder generates block.properties, shadow path, buffer format and menu structure appropriate for that version.' },
  { q: 'I play 1.8.9 (PvP) — what should I pick?', a: 'Pick the "Legacy (1.8 – 1.12.2)" version bucket and the "OptiFine" loader. This build uses numeric block IDs (31, 18, 8…), manual shadow comparison instead of sampler2DShadow, RGB16 buffer format, and a flat one-level menu — all to run on legacy OptiFine HD U.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">FAQ</p>
          <h2 className="section-title mt-2">Frequently Asked Questions</h2>
        </Reveal>
        <div className="mt-10 space-y-2">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 40} className={cn('glass-sm overflow-hidden transition-colors', isOpen && 'bg-white/[0.04]')}>
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]">
                  <span className="font-semibold text-white">{item.q}</span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300', isOpen && 'rotate-180 text-amber-300')} />
                </button>
                <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-slate-400">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
