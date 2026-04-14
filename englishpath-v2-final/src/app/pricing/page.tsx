"use client";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "",
    desc: "Bắt đầu học không cần thẻ tín dụng",
    color: "border-gray-200",
    cta: "Bắt đầu miễn phí",
    ctaStyle: "btn-secondary w-full justify-center",
    highlight: false,
    features: [
      { text: "A1 + A2 đầy đủ (140 bài học)", ok: true },
      { text: "10 AI messages / tháng", ok: true },
      { text: "Flashcard SRS cơ bản", ok: true },
      { text: "Placement Test", ok: true },
      { text: "Bảng xếp hạng cộng đồng", ok: true },
      { text: "B1 + B2 content", ok: false },
      { text: "AI Writing Coach không giới hạn", ok: false },
      { text: "Mock Test IELTS/TOEIC", ok: false },
      { text: "Speaking AI Role-play", ok: false },
      { text: "Học offline (PWA)", ok: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 199000,
    period: "/ tháng",
    desc: "Lộ trình đầy đủ A1→B2 với AI không giới hạn",
    color: "border-brand-400",
    cta: "Dùng thử 7 ngày miễn phí",
    ctaStyle: "btn-primary w-full justify-center",
    highlight: true,
    badge: "Phổ biến nhất",
    features: [
      { text: "Tất cả A1 + A2 + B1 + B2 (360 bài học)", ok: true },
      { text: "AI Writing Coach không giới hạn", ok: true },
      { text: "AI Tutor không giới hạn", ok: true },
      { text: "Speaking AI Role-play", ok: true },
      { text: "Mock Test IELTS/TOEIC đầy đủ", ok: true },
      { text: "Flashcard SRS + Download offline", ok: true },
      { text: "Phân tích điểm yếu chi tiết", ok: true },
      { text: "Báo cáo tiến độ hàng tuần", ok: true },
      { text: "Học offline (PWA)", ok: false },
      { text: "1-on-1 AI tutor session", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 399000,
    period: "/ tháng",
    desc: "Dành cho người có mục tiêu IELTS 7.0+ hoặc TOEIC 800+",
    color: "border-amber-400",
    cta: "Bắt đầu Pro",
    ctaStyle: "w-full justify-center inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-all",
    highlight: false,
    badge: "Best Value",
    features: [
      { text: "Tất cả tính năng Premium", ok: true },
      { text: "Học offline (PWA)", ok: true },
      { text: "AI Pronunciation Coach chuyên sâu", ok: true },
      { text: "Essay correction không giới hạn", ok: true },
      { text: "Mock IELTS band score chính xác", ok: true },
      { text: "Chứng chỉ hoàn thành lộ trình", ok: true },
      { text: "Priority support", ok: true },
      { text: "Beta access tính năng mới", ok: true },
      { text: "1-on-1 AI tutor session (4 lần/tháng)", ok: true },
      { text: "Offline content pack đầy đủ", ok: true },
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planId: string) {
    if (planId === "free") { window.location.href = "/auth/register"; return; }
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, userId: "mock-user-id", email: "user@example.com" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Lỗi tạo checkout. Vui lòng thử lại.");
    } catch {
      toast.error("Lỗi kết nối. Kiểm tra Stripe API key.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <span className="font-bold text-gray-900">EnglishPath</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login"    className="btn-ghost text-sm">Đăng nhập</Link>
          <Link href="/auth/register" className="btn-primary text-sm py-2">Bắt đầu miễn phí</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="badge bg-brand-100 text-brand-700 text-sm px-4 py-1.5 mb-4 inline-block">Đơn giản và minh bạch</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Chọn gói phù hợp với bạn</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Bắt đầu miễn phí với A1 + A2 đầy đủ. Nâng cấp khi sẵn sàng lên B1/B2.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={cn("card p-6 relative flex flex-col", plan.highlight ? "border-2 border-brand-400 shadow-lg" : "border")}>
              {plan.badge && (
                <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white",
                  plan.id === "premium" ? "bg-brand-600" : "bg-amber-500"
                )}>{plan.badge}</div>
              )}

              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-gray-900">Miễn phí</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">{plan.price.toLocaleString("vi-VN")}₫</span>
                      <span className="text-gray-400 text-sm">{plan.period}</span>
                    </>
                  )}
                </div>
                {plan.price > 0 && <p className="text-xs text-gray-400 mt-1">= {Math.round(plan.price / 30_000).toLocaleString()}$ USD / tháng</p>}
              </div>

              <button onClick={() => handleUpgrade(plan.id)} disabled={loading === plan.id}
                className={cn(plan.ctaStyle, "mb-5 disabled:opacity-60")}>
                {loading === plan.id ? "Đang xử lý..." : plan.cta}
              </button>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={cn("flex items-start gap-2 text-sm", f.ok ? "text-gray-700" : "text-gray-300")}>
                    <span className={cn("flex-shrink-0 mt-0.5 font-bold", f.ok ? "text-brand-500" : "text-gray-200")}>
                      {f.ok ? "✓" : "✗"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Câu hỏi thường gặp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Có thể huỷ bất cứ lúc nào không?", a: "Có! Bạn có thể huỷ Premium/Pro bất kỳ lúc nào. Tài khoản vẫn active đến hết kỳ thanh toán." },
              { q: "Thanh toán có an toàn không?", a: "Chúng tôi dùng Stripe — chuẩn bảo mật PCI DSS. Chúng tôi không lưu thông tin thẻ của bạn." },
              { q: "Dùng thử 7 ngày có cần thẻ không?", a: "Có, cần nhập thẻ nhưng sẽ không bị tính tiền trong 7 ngày đầu. Huỷ trước hạn nếu không muốn tiếp tục." },
              { q: "Có thể chia sẻ tài khoản không?", a: "Không. Mỗi tài khoản dành cho 1 người. Dùng chung sẽ ảnh hưởng đến tiến độ và AI cá nhân hóa." },
              { q: "Free có đủ để học A2 không?", a: "Hoàn toàn đủ! Gói Free có toàn bộ A1 và A2 — 140 bài học, đủ cho người mới bắt đầu đến sơ cấp." },
              { q: "Học xong A2 thì nâng cấp lên gì?", a: "Nâng Premium để tiếp tục với B1/B2. Lộ trình liên tục, không gián đoạn — progress của bạn được giữ nguyên." },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-gray-900 text-sm mb-1">{item.q}</p>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-3">Được tin dùng bởi học viên trên toàn Việt Nam</p>
          <div className="flex items-center justify-center gap-6 text-gray-300 text-xs">
            <span>🔒 Bảo mật SSL</span>
            <span>💳 Stripe PCI DSS</span>
            <span>🔄 Huỷ bất cứ lúc nào</span>
            <span>📧 Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
