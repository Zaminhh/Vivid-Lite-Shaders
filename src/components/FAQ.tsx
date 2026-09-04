import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import Reveal from './ui/Reveal';

const QA = [
  { q: 'Máy yếu cỡ nào thì chạy được?', a: 'Preset Khoai tây chạy được trên Intel HD 3000/4000 (2012) với 4 GB RAM, miễn là vanilla + Sodium đã đạt ~40 FPS. Không shadow pass, không bloom nên chi phí gần như chỉ là vài phép tính màu mỗi pixel. Intel HD 520/620 trở lên dùng thoải mái preset Thấp hoặc Trung bình.' },
  { q: 'Vivid Lite boost FPS thế nào so với BSL?', a: '3 cách chính: (1) Forward lighting thay vì deferred — ánh sáng tính ngay lúc vẽ geometry, bỏ 6–8 pass toàn màn hình. (2) Bloom 2 tile từ mipmap thay vì 7 tile downsample thủ công. (3) Shadow pass tắt được hoàn toàn — Iris skip pass, CPU bớt cả triệu vertex. Xem chi tiết ở phần "Hiệu năng".' },
  { q: 'Tại sao nước không phản chiếu cây cối / nhà cửa?', a: 'Phản chiếu vật thể (SSR) cần ray-march 16–32 bước qua depth buffer mỗi pixel — thường tốn 15–20% FPS trên iGPU. Vivid Lite thay bằng phản chiếu bầu trời có Fresnel + vệt nắng, chiếm 90% cảm giác "nước đẹp" với chi phí gần bằng 0.' },
  { q: 'Đây có phải BSL bản chỉnh sửa không?', a: 'Không. Vivid Lite được viết mới hoàn toàn, chỉ lấy cảm hứng phong cách hình ảnh của BSL (màu sắc, hoàng hôn, bóng xanh, đuốc ấm). Không có dòng code nào của BSL, nên bạn dùng, sửa, chia sẻ thoải mái.' },
  { q: 'Pass toàn màn hình là gì và tại sao ít hơn = nhanh hơn?', a: 'Mỗi "pass" đọc + ghi ~2 triệu pixel (1080p = ~8 MB). Ít pass = ít lần duyệt frame buffer = ít stall GPU. BSL Medium chạy 6–12 pass (SSAO, SSR, TAA, bloom×3, god rays…). Vivid Lite chỉ 1–3 pass, và 2 trong số đó có thể tắt hoàn toàn.' },
  { q: 'Shadow map "méo" (distorted) là gì?', a: 'Bình thường shadow map phân resolution đều → vùng xa (ít khi nhìn) được nhiều pixel浪费. Méo shadow map dồn resolution quanh người chơi → 768px méo cho bóng sắc tương đương 1536px đều. Kết quả: giảm resolution mà bóng vẫn đẹp → thêm FPS.' },
  { q: 'Bloom 2 tile mipmap khác BSL 7 tile thế nào?', a: 'BSL downsample thủ công 7 tile 512×512 → 7×270K pixel phải tính. Vivid Lite bật colortex0MipmapEnabled=true → GPU tạo mipmap tự động (miễn phí), rồi bloom chỉ đọc 2 tile từ mip level 2 và 4. Cùng hiệu ứng quầng sáng mềm, nhưng chỉ tính ~150K pixel thay vì ~1.9M.' },
  { q: 'Tại sao forward nhẹ hơn deferred?', a: 'Deferred phải: ghi G-buffer (normal + depth + material ID) → SSAO pass → re-light từng pixel → SSR ray-march → TAA resolve → bloom. Mỗi bước là 1 pass toàn màn hình. Forward tính ánh sáng ngay lúc vẽ geometry — 1 lần duyệt, không G-buffer, không re-light.' },
  { q: 'Làm sao chỉnh sáng / tối / màu trong game?', a: 'Vào Shader Pack Settings → mục "Màu sắc & Hậu kỳ" để đổi Phơi sáng, Bão hòa, Tương phản, Nhiệt độ màu; mục "Ánh sáng" cho Ánh nắng, Môi trường, Sáng tối thiểu trong hang. Menu có sẵn tiếng Việt.' },
  { q: 'FPS vẫn thấp thì làm gì trước?', a: 'Theo thứ tự ưu tiên: (1) tắt Bóng đổ hoặc giảm 512–768px, (2) tắt Mob đổ bóng, (3) giảm Render Distance 6, (4) hạ độ phân giải cửa sổ, (5) tắt Bloom + Sương nước, (6) cài Lithium + Entity Culling. Xem hướng dẫn chi tiết ở phần Cài đặt.' },
  { q: 'Có hỗ trợ Nether và End không?', a: 'Có. Nether dùng màu sương theo biome (đỏ, xanh soul, tím warped), End có bầu trời tím. Cả hai đều không chạy shadow pass — tiết kiệm FPS vì Nether/End ít ánh nắng mặt trời.' },
  { q: 'AO giả (FAKE_AO) khác SSAO thế nào?', a: 'SSAO lấy 8–16 depth sample theo hemisphere quanh mỗi pixel + blur 2 pass → 10% FPS. FAKE_AO chỉ nhân lightmap.x² → tối góc block tự nhiên, chi phí = 0 (1 phép nhân đã có trong pipeline). Không đẹp bằng SSAO thật, nhưng trên máy yếu thì đáng.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">FAQ</p>
          <h2 className="section-title mt-2">Câu hỏi thường gặp</h2>
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
