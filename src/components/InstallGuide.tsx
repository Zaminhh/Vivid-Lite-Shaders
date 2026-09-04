import { ExternalLink, FolderInput, Gamepad2, Layers, Settings2, Wrench } from 'lucide-react';
import Reveal from './ui/Reveal';

const STEPS = [
  {
    icon: Layers,
    title: 'Cài Fabric Loader cho Minecraft 26.2',
    body: 'Tải installer tại fabricmc.net, chọn phiên bản 26.2, bấm Install. Launcher sẽ có thêm profile "fabric-loader-26.2".',
    link: { href: 'https://fabricmc.net/use/installer/', label: 'fabricmc.net' },
  },
  {
    icon: Wrench,
    title: 'Tải Sodium + Iris (bản 26.2)',
    body: 'Tải 2 file .jar từ Modrinth và bỏ vào thư mục .minecraft/mods. Iris 1.11.x là bản hỗ trợ 26.2. Sodium là thứ tăng FPS nhiều nhất cho máy yếu — bắt buộc có.',
    link: { href: 'https://modrinth.com/mod/iris/versions?g=26.2', label: 'Iris trên Modrinth' },
  },
  {
    icon: FolderInput,
    title: 'Bỏ file .zip vào shaderpacks',
    body: 'Tải Vivid Lite ở phần trên rồi bỏ NGUYÊN file .zip (không giải nén) vào .minecraft/shaderpacks. Windows: %appdata%\\.minecraft\\shaderpacks',
  },
  {
    icon: Gamepad2,
    title: 'Bật trong game',
    body: 'Options → Video Settings → Shader Packs… → chọn "VividLite_v1.0.0_….zip" → Apply. Bấm "Shader Pack Settings" để đổi profile hoặc tinh chỉnh.',
  },
];

const VIDEO_SETTINGS = [
  ['Render Distance', '6–8 chunk', 'Ảnh hưởng FPS nhiều nhất sau shader'],
  ['Simulation Distance', '5', 'Giảm tải CPU'],
  ['Graphics', 'Fast', 'Lá cây đặc = ít pixel phải vẽ hơn'],
  ['Clouds', 'Fast hoặc Off', 'Mây fancy tốn fill-rate trên iGPU'],
  ['Entity Shadows', 'Off', 'Shader đã có bóng thật'],
  ['Particles', 'Decreased', 'Bớt overdraw'],
  ['Max Framerate', '60', 'Đỡ nóng máy, khung hình đều hơn'],
  ['Fullscreen Resolution', '1366×768 hoặc 1280×720', 'Với iGPU, độ phân giải quyết định tất cả'],
  ['Mipmap Levels', '2', 'Vừa đủ mượt, ít VRAM'],
];

const EXTRA_MODS = [
  ['Lithium', 'Tối ưu logic game (CPU)'],
  ['FerriteCore', 'Giảm RAM'],
  ['ImmediatelyFast', 'Tăng tốc render UI/entity'],
  ['Entity Culling', 'Không vẽ mob bị che khuất'],
  ['ModernFix', 'Vào game nhanh, ít lag chunk'],
  ['Dynamic FPS', 'Giảm tải khi thu nhỏ cửa sổ'],
];

export default function InstallGuide() {
  return (
    <section id="install" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-500/[0.04] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Cài đặt</p>
          <h2 className="section-title mt-2">4 bước, 5 phút</h2>
          <p className="mt-4 text-slate-400">Vivid Lite được thiết kế cho Iris + Sodium trên Fabric — combo nhẹ nhất hiện có cho Minecraft 26.2.</p>
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
              <h3 className="font-bold text-white">Video Settings đề xuất cho máy yếu</h3>
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
              <h3 className="font-bold text-white">Mod nên cài thêm (Fabric, miễn phí)</h3>
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
              <strong className="text-sky-200">RAM:</strong> máy 4 GB đặt <span className="font-mono">-Xmx1536M</span>, máy 8 GB đặt{' '}
              <span className="font-mono">-Xmx2G</span> trong JVM Arguments của launcher. Cấp quá nhiều RAM cho Java trên máy yếu
              lại làm giật hơn.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
