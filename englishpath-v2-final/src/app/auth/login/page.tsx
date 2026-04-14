"use client";
import { useState } from "react";
import Link from "next/link";
import { signInWithGoogle, signInWithEmail } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [showPw, setShowPw] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Vui lòng nhập đầy đủ thông tin");
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Email hoặc mật khẩu không đúng" : error.message);
    else window.location.href = "/dashboard";
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { toast.error("Đăng nhập Google thất bại"); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <span className="font-bold text-gray-900">EnglishPath</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="card p-8">
            {mode === "forgot" ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Quên mật khẩu?</h1>
                <p className="text-gray-500 text-sm mb-6">Nhập email để nhận link đặt lại mật khẩu</p>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-field mb-3" />
                <button disabled={loading} className="btn-primary w-full justify-center mb-3">
                  {loading ? "Đang gửi..." : "Gửi email đặt lại"}
                </button>
                <button onClick={() => setMode("login")} className="btn-ghost w-full justify-center text-sm">
                  ← Quay lại đăng nhập
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Chào mừng trở lại!</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Chưa có tài khoản?{" "}
                  <Link href="/auth/register" className="text-brand-600 font-medium hover:underline">Đăng ký miễn phí</Link>
                </p>

                {/* Google */}
                <button onClick={handleGoogle} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-700 transition-all mb-4 disabled:opacity-60">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Tiếp tục với Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">hoặc</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Email form */}
                <form onSubmit={handleEmail} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" className="input-field pr-11" required />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                        {showPw ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode("forgot")}
                      className="text-sm text-brand-600 hover:underline">
                      Quên mật khẩu?
                    </button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Điều khoản dịch vụ</Link>
            {" "}và{" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Chính sách bảo mật</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
