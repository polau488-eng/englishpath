"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Vui lòng nhập đầy đủ thông tin");
    if (password.length < 6) return toast.error("Mật khẩu tối thiểu 6 ký tự");
    setLoading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) toast.error(error.message);
      else setDone(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Kiểm tra email!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Đã gửi link xác nhận đến <strong>{email}</strong>. Nhấp vào link để kích hoạt tài khoản.
        </p>
        <Link href="/auth/login" className="btn-primary inline-flex justify-center">Đăng nhập →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Tạo tài khoản miễn phí</h1>
            <p className="text-gray-500 text-sm mb-6">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Đăng nhập</Link>
            </p>
            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-700 transition-all mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng ký với Google
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Họ và tên</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nguyễn Văn A" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự" className="input-field" required minLength={6} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản miễn phí →"}
              </button>
            </form>
            <div className="mt-4 p-3 bg-brand-50 rounded-xl">
              <p className="text-xs text-brand-700 text-center">
                🎁 Free: A1 + A2 đầy đủ · 10 AI messages/tháng · Flashcard SRS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
