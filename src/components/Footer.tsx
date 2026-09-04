import { Heart } from 'lucide-react';
import { Logo } from './Navbar';
import Reveal from './ui/Reveal';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Shader Minecraft 26.2 phong cách BSL cho máy yếu. Mã nguồn GLSL mở, tạo file .zip ngay trên trình duyệt — không upload gì lên
            máy chủ.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Lấy cảm hứng từ BSL Shaders của Capt Tatsu. Vivid Lite là dự án độc lập, không dùng mã của BSL và không liên kết với Mojang / Microsoft.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <h4 className="font-semibold text-white">Trang</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white">Tính năng</a></li>
              <li><a href="#compare" className="hover:text-white">So với BSL</a></li>
              <li><a href="#builder" className="hover:text-white">Tùy chỉnh & Tải</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Hỗ trợ</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="#install" className="hover:text-white">Cài đặt</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Cần có</h4>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li><a href="https://modrinth.com/mod/iris" target="_blank" rel="noreferrer" className="hover:text-white">Iris Shaders</a></li>
              <li><a href="https://modrinth.com/mod/sodium" target="_blank" rel="noreferrer" className="hover:text-white">Sodium</a></li>
              <li><a href="https://fabricmc.net" target="_blank" rel="noreferrer" className="hover:text-white">Fabric</a></li>
            </ul>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
        <span>© 2026 Vivid Lite Shaders · v1.0.0</span>
        <span className="inline-flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-rose-400 animate-pulse" /> cho máy yếu
        </span>
      </div>
    </footer>
  );
}
