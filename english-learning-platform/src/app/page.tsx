import Link from "next/link";
import type { Skill } from "@/types";
import { SKILL_CONFIG } from "@/lib/utils";

const FEATURES = [
  { icon: "🎯", title: "Lộ trình rõ ràng A1→B2", desc: "360+ bài học được thiết kế khoa học theo từng cấp độ CEFR. Biết chính xác mình đang ở đâu và cần làm gì tiếp theo." },
  { icon: "🤖", title: "AI phản hồi cá nhân hóa", desc: "AI chữa bài viết, chấm điểm phát âm và giải thích ngữ pháp theo cách riêng của bạn — không phải đáp án cứng nhắc." },
  { icon: "🧠", title: "Spaced Repetition (SRS)", desc: "Flashcard thông minh tự động nhắc ôn tập đúng thời điểm não bộ sắp quên — tăng hiệu quả ghi nhớ lên 3 lần." },
  { icon: "🔥", title: "Streak & Gamification", desc: "Hệ thống điểm XP, streak, badge và bảng xếp hạng giữ bạn có động lực học mỗi ngày — chỉ cần 15 phút." },
  { icon: "🇻🇳", title: "Giải thích bằng tiếng Việt", desc: "Ngữ pháp được giải thích so sánh với tiếng Việt, chỉ rõ lỗi người Việt hay mắc — dễ hiểu hơn sách ngoại." },
  { icon: "📊", title: "Phân tích điểm mạnh yếu", desc: "Dashboard theo dõi tiến độ từng kỹ năng, gợi ý bài tập bù yếu tự động và báo cáo tiến độ hàng tuần." },
];

const STEPS = [
  { step: "01", title: "Kiểm tra trình độ", desc: "Làm bài test 10 câu — 5 phút để xác định đúng cấp độ của bạn." },
  { step: "02", title: "Nhận lộ trình cá nhân", desc: "AI tạo lộ trình học riêng dựa trên mục tiêu và điểm yếu của bạn." },
  { step: "03", title: "Học từng ngày 15–30 phút", desc: "Bài học ngắn, tương tác cao — kết hợp cả 4 kỹ năng và ngữ pháp." },
  { step: "04", title: "Đạt chứng chỉ mục tiêu", desc: "Luyện đề IELTS/TOEIC thực tế và nhận chứng chỉ hoàn thành lộ trình." },
];

const SKILLS: { key: Skill; sample: string }[] = [
  { key: "listening", sample: "Nghe hội thoại, podcast, tin tức BBC với tốc độ điều chỉnh và script song ngữ" },
  { key: "speaking",  sample: "Ghi âm, so sánh phát âm với native speaker và được AI chấm điểm tức thì" },
  { key: "reading",   sample: "Đọc văn bản từ 50–900 từ với công cụ tra từ ngay, highlight và ghi chú" },
  { key: "writing",   sample: "Viết từ câu đơn giản đến essay 250+ từ với AI chữa lỗi chi tiết từng câu" },
];

const TESTIMONIALS = [
  { name: "Nguyễn Thị Lan", level: "A2 → B1", time: "4 tháng", text: "Sau 4 tháng mình đã có thể nghe hiểu cuộc hội thoại tiếng Anh thông thường và viết email đơn giản. Cách giải thích ngữ pháp so sánh tiếng Việt giúp mình hiểu nhanh hơn nhiều!", avatar: "L" },
  { name: "Trần Minh Đức", level: "B1 → B2", time: "6 tháng", text: "Tôi dùng để chuẩn bị IELTS và đạt 6.5 sau 6 tháng. Phần Writing với AI feedback rất sát thực tế, giúp tôi hiểu rõ lỗi sai và cách sửa.", avatar: "Đ" },
  { name: "Phạm Thu Hương", level: "A1 → A2", time: "3 tháng", text: "Mình mất gốc tiếng Anh từ lâu nhưng với lộ trình A1, mình học lại từ đầu rất hệ thống. Streak 60 ngày rồi, không bỏ học ngày nào!", avatar: "H" },
];

const PRICING = [
  {
    name: "Miễn phí", price: "0đ", period: "mãi mãi", highlight: false,
    features: ["Toàn bộ A1 + A2 (140 bài)", "Flashcard SRS cơ bản", "10 AI messages/tháng", "Placement Test", "Progress tracking"],
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Premium", price: "199.000đ", period: "/ tháng", highlight: true,
    features: ["Tất cả tính năng Free", "B1 + B2 đầy đủ (220 bài)", "AI không giới hạn", "Speaking AI Coach", "Mock Test IELTS/TOEIC", "Offline mode", "Báo cáo chi tiết"],
    cta: "Dùng thử 7 ngày miễn phí",
  },
  {
    name: "Pro", price: "399.000đ", period: "/ tháng", highlight: false,
    features: ["Tất cả tính năng Premium", "1-on-1 AI Tutor không giới hạn", "Essay correction chi tiết", "Pronunciation coaching", "Certificate hoàn thành", "Ưu tiên hỗ trợ 24/7"],
    cta: "Liên hệ tư vấn",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">EnglishPath</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Tính năng</a>
            <a href="#skills"   className="hover:text-gray-900 transition-colors">Kỹ năng</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">Bảng giá</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/placement-test" className="btn-ghost text-sm hidden sm:flex">Kiểm tra trình độ</Link>
            <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">Học ngay →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-hero-gradient pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🎉 Hơn 50,000 học viên đang học mỗi ngày
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Học tiếng Anh{" "}
            <span className="text-gradient">có hệ thống</span>
            <br />từ A1 đến B2
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nền tảng học tiếng Anh toàn diện với 4 kỹ năng, ngữ pháp có hệ thống và AI cá nhân hóa.
            Lộ trình rõ ràng, phản hồi tức thì, giải thích bằng tiếng Việt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/placement-test" className="btn-primary text-base px-8 py-3.5 animate-bounce-subtle">
              Kiểm tra trình độ miễn phí →
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-3.5">
              Xem demo Dashboard
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Không cần thẻ tín dụng · A1 và A2 hoàn toàn miễn phí</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "50K+", lbl: "Học viên đang học" },
            { val: "360+", lbl: "Bài học" },
            { val: "4",    lbl: "Kỹ năng + Ngữ pháp" },
            { val: "AI",   lbl: "Feedback cá nhân hóa" },
          ].map((s) => (
            <div key={s.lbl}>
              <p className="text-3xl font-bold text-brand-600">{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn EnglishPath?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Được thiết kế riêng cho người Việt học tiếng Anh — không phải bản dịch của sản phẩm nước ngoài.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4 Kỹ năng + Ngữ pháp tích hợp</h2>
            <p className="text-gray-500">Mỗi bài học kết hợp nhiều kỹ năng — học tự nhiên như cách người bản ngữ học</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS.map(({ key, sample }) => {
              const cfg = SKILL_CONFIG[key];
              return (
                <div key={key} className="card p-6 flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${cfg.bg}`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{cfg.label}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{sample}</p>
                  </div>
                </div>
              );
            })}
            {/* Grammar */}
            <div className="card p-6 flex gap-4 sm:col-span-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-amber-50">📐</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Ngữ pháp — Tích hợp vào cả 4 kỹ năng</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Không học ngữ pháp khô khan — học trong ngữ cảnh thực tế. Mỗi điểm ngữ pháp được giải thích bằng tiếng Việt,
                  so sánh lỗi người Việt hay mắc và có bài tập drill tức thì. Từ To Be (A1) đến Inversion và Cleft Sentences (B2).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bắt đầu chỉ trong 4 bước</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/placement-test" className="btn-primary text-base px-8 py-3.5">
              Bắt đầu với bài kiểm tra trình độ →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Học viên nói gì?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-brand-600">{t.level} · {t.time}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[1,2,3,4,5].map((i) => <span key={i} className="text-amber-400">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bảng giá</h2>
            <p className="text-gray-500">A1 và A2 hoàn toàn miễn phí — không cần thẻ tín dụng</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`card p-6 flex flex-col ${plan.highlight ? "border-2 border-brand-500 relative" : ""}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">PHỔ BIẾN NHẤT</span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-brand-500 mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.highlight ? "/dashboard" : "/placement-test"}
                  className={plan.highlight ? "btn-primary justify-center" : "btn-secondary justify-center"}
                >{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-600 to-accent-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Bắt đầu hành trình tiếng Anh hôm nay</h2>
          <p className="text-brand-100 mb-8">Chỉ cần 15 phút mỗi ngày. A1 và A2 miễn phí hoàn toàn.</p>
          <Link href="/placement-test" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all text-base shadow-lg">
            Kiểm tra trình độ ngay — Miễn phí →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">EP</span>
            </div>
            <span className="font-bold text-gray-900">EnglishPath</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 EnglishPath. Học tiếng Anh hiệu quả mỗi ngày.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Điều khoản</a>
            <a href="#" className="hover:text-gray-600">Bảo mật</a>
            <a href="#" className="hover:text-gray-600">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
