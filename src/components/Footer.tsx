import { Heart } from 'lucide-react';
import { Logo } from './Navbar';
import Reveal from './ui/Reveal';
import { VERSION } from '../shader/version';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            BSL-style Minecraft shader optimized for weak hardware. Shader pack generated entirely in your browser — no uploads, no
            registration, no tracking.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Inspired by BSL Shaders (Capt Tatsu). Vivid Lite is an independent project, contains no BSL code, and is not
            affiliated with Mojang or Microsoft.
          </p>
          <a href="https://github.com/Zaminhh/Vivid-Lite-Shaders" target="_blank" rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-mono text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.67.8.55C20.21 21.4 23.5 17.09 23.5 12.02 23.5 5.73 18.27.5 12 .5z"/></svg>
            github.com/Zaminhh/Vivid-Lite-Shaders
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <h4 className="font-semibold text-white">Page</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#perf" className="hover:text-white">Performance</a></li>
              <li><a href="#builder" className="hover:text-white">Customize</a></li>
              <li><a href="#lag" className="hover:text-white">How we cut lag</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="#install" className="hover:text-white">Install</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><a href="#compat" className="hover:text-white">Compatibility</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Required</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="https://modrinth.com/mod/iris" target="_blank" rel="noreferrer" className="hover:text-white">Iris Shaders</a></li>
              <li><a href="https://modrinth.com/mod/sodium" target="_blank" rel="noreferrer" className="hover:text-white">Sodium</a></li>
              <li><a href="https://fabricmc.net" target="_blank" rel="noreferrer" className="hover:text-white">Fabric</a></li>
              <li><a href="https://optifine.net" target="_blank" rel="noreferrer" className="hover:text-white">OptiFine</a></li>
            </ul>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
        <span>© 2026 Vivid Lite Shaders · v{VERSION} · MC 1.8–26.3</span>
        <span className="inline-flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-rose-400 animate-pulse" /> by <a href="https://github.com/Zaminhh" target="_blank" rel="noreferrer" className="font-mono text-slate-400 hover:text-white">zaminhh</a>
        </span>
      </div>
    </footer>
  );
}
