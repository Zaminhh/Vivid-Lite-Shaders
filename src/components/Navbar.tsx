import { useEffect, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

const LINKS = [
  { href: '#features', label: 'Tính năng' },
  { href: '#perf', label: 'Hiệu năng' },
  { href: '#builder', label: 'Tùy chỉnh & Tải' },
  { href: '#install', label: 'Cài đặt' },
  { href: '#faq', label: 'FAQ' },
];

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn('flex items-center gap-2.5 group', className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg shadow-amber-500/30">
        <span className="h-4 w-4 rounded-sm bg-night-950" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-sky-400 shadow shadow-sky-400/60 animate-pulse-soft" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-white">Vivid Lite</span>
        <span className="block font-pixel text-[8px] text-amber-300/90">v1.0.1 · MC 26.2</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-night-900/90 border-b border-white/10' : 'bg-transparent',
      )}
    >
      {/* scroll progress bar (GPU-accelerated: only transform) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400"
        style={{ transform: `scaleX(${progress / 100})`, transition: 'transform 0.1s linear', willChange: 'transform' }} />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <a href="#builder" className="btn-primary !px-4 !py-2 text-sm">
            <Download className="h-4 w-4" /> Tải shader
          </a>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-night-900/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href="#builder" onClick={() => setOpen(false)} className="btn-primary w-full text-sm">
                <Download className="h-4 w-4" /> Tải shader
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
