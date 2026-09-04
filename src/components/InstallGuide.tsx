import { ExternalLink, FolderInput, Gamepad2, Layers, Settings2, Wrench } from 'lucide-react';
import Reveal from './ui/Reveal';
import { VERSION } from '../shader/version';

const STEPS = [
  {
    icon: Layers,
    title: 'Choose Iris or OptiFine',
    body: 'Iris + Sodium (Fabric) gives the highest FPS — recommended. If you play a very old version or need OptiFine, pick "OptiFine" loader in the Customize section. Vivid Lite supports both, Minecraft 1.8 → 26.3.',
    link: { href: 'https://fabricmc.net/use/installer/', label: 'fabricmc.net' },
  },
  {
    icon: Wrench,
    title: 'Install mod / OptiFine for your version',
    body: 'Iris: download Sodium + Iris (.jar) from Modrinth, drop into .minecraft/mods. OptiFine: download HD U for your version at optifine.net and run the installer.',
    link: { href: 'https://modrinth.com/mod/iris/versions', label: 'Iris on Modrinth' },
  },
  {
    icon: FolderInput,
    title: 'Drop the .zip into shaderpacks',
    body: `Download VividLite_v${VERSION}_<preset>.zip from Releases or via the web builder. Drop the .zip AS-IS (❗ do not extract) into .minecraft/shaderpacks. Windows path: %appdata%\\.minecraft\\shaderpacks`,
  },
  {
    icon: Gamepad2,
    title: 'Enable in-game',
    body: `Iris: Options → Video Settings → Shader Packs… OptiFine: Options → Video Settings → Shaders… Pick "VividLite_v${VERSION}_….zip" → Apply. Click "Shader Pack Settings" to switch between 8 profiles or tune 60+ options (includes 🌙 Night and ⚡ Performance menus).`,
  },
];

const VIDEO_SETTINGS = [
  ['Render Distance', '6–8 chunks', 'Biggest FPS impact after shader'],
  ['Simulation Distance', '5', 'Reduces CPU load'],
  ['Graphics', 'Fast', 'Dense leaves = fewer pixels to draw'],
  ['Clouds', 'Fast or Off', 'Fancy clouds are fill-rate heavy on iGPU'],
  ['Entity Shadows', 'Off', 'The shader already draws real shadows'],
  ['Particles', 'Decreased', 'Less overdraw'],
  ['Max Framerate', '60', 'Less heat, more consistent frame times'],
  ['Fullscreen Resolution', '1366×768 or 1280×720', 'On iGPU, resolution matters most'],
  ['Mipmap Levels', '2', 'Smooth enough, less VRAM'],
];

const EXTRA_MODS = [
  ['Lithium', 'Optimize game logic (CPU)'],
  ['FerriteCore', 'Less RAM usage'],
  ['ImmediatelyFast', 'Speed up UI/entity rendering'],
  ['Entity Culling', 'Don\'t render hidden mobs'],
  ['ModernFix', 'Faster load, less chunk lag'],
  ['Dynamic FPS', 'Reduce load when window unfocused'],
];

export default function InstallGuide() {
  return (
    <section id="install" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-500/[0.04] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Installation</p>
          <h2 className="section-title mt-2">4 steps, 5 minutes</h2>
          <p className="mt-4 text-slate-400">Works on <strong className="text-white">Iris + Sodium</strong> (fastest) or <strong className="text-white">OptiFine</strong>, from Minecraft 1.8 to 26.3.</p>
        </Reveal>

        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 100} variant="scale" className="glass hover-lift relative rounded-2xl p-6">
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-0.5 font-pixel text-[9px] text-night-950">
                {i + 1}
              </span>
              <s.icon className="h-6 w-6 text-amber-300" />
              <h3 className="mt-3 font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              {s.link && (
                <a href={s.link.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:underline">
                  {s.link.label} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </Reveal>
          ))}
        </ol>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <Settings2 className="h-4 w-4 text-amber-300" />
              <h3 className="font-bold text-white">Recommended Video Settings for weak hardware</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                {VIDEO_SETTINGS.map(([k, v, why]) => (
                  <tr key={k} className="hover:bg-white/[0.03]">
                    <td className="px-5 py-2.5 font-medium text-slate-200">{k}</td>
                    <td className="px-5 py-2.5 font-mono text-xs text-amber-200">{v}</td>
                    <td className="hidden px-5 py-2.5 text-xs text-slate-500 sm:table-cell">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white">Recommended companion mods (Fabric, free)</h3>
              <ul className="mt-3 space-y-2">
                {EXTRA_MODS.map(([name, why]) => (
                  <li key={name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-200">{name}</span>
                    <span className="text-right text-xs text-slate-500">{why}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5 text-sm text-sky-100/90">
              <strong className="text-sky-200">RAM:</strong> on 4 GB systems set <span className="font-mono">-Xmx1536M</span>, on 8 GB set
              <span className="font-mono"> -Xmx2G</span> in the launcher's JVM arguments. Giving Java too much RAM on weak hardware actually <em>causes</em> more stutter.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
