"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PROMPTS = [
  { id: "p1", level: "A2", title: "My favorite place", hint: "Mô tả nơi bạn yêu thích và giải thích tại sao. (60–100 từ)" },
  { id: "p2", level: "A2", title: "A memorable day", hint: "Kể về một ngày đáng nhớ trong cuộc đời bạn. (80–120 từ)" },
  { id: "p3", level: "B1", title: "Advantages and disadvantages of social media", hint: "Viết về mặt tích cực và tiêu cực của mạng xã hội. (120–180 từ)" },
  { id: "p4", level: "B1", title: "Should schools ban smartphones?", hint: "Trình bày ý kiến của bạn về việc cấm điện thoại trong trường. (150–200 từ)" },
  { id: "p5", level: "B2", title: "IELTS Task 2: Technology and human connection", hint: "Some people think technology has made people more isolated. To what extent do you agree? (250 từ)" },
];

export default function WritingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  async function getFeedback() {
    if (text.trim().length < 20) {
      toast.error("Hãy viết ít nhất 20 từ trước khi nhận phản hồi");
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "writing_coach",
          content: `Đề bài: "${selectedPrompt.title}"\n\nBài viết của học viên:\n${text}`,
          level: selectedPrompt.level,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data.result);
    } catch {
      toast.error("Không thể kết nối AI. Kiểm tra API key trong .env.local");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Writing Studio" subtitle="Luyện viết và nhận phản hồi từ AI ngay lập tức" />

      <div className="p-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Prompt selector */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Chọn đề bài</h3>
            {PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPrompt(p); setText(""); setFeedback(null); }}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all",
                  selectedPrompt.id === p.id
                    ? "bg-brand-50 border-brand-300"
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("badge text-xs", p.level === "B2" ? "bg-orange-100 text-orange-700" : p.level === "B1" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700")}>
                    {p.level}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Prompt card */}
            <div className="card p-4 bg-amber-50 border-amber-100">
              <p className="text-sm font-semibold text-amber-800 mb-1">📝 {selectedPrompt.title}</p>
              <p className="text-sm text-amber-700">{selectedPrompt.hint}</p>
            </div>

            {/* Textarea */}
            <div className="card overflow-hidden">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Bắt đầu viết bài của bạn tại đây..."
                className="w-full p-5 min-h-[240px] text-gray-800 text-sm leading-relaxed resize-none border-0 outline-none focus:ring-0"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className={cn("text-xs font-medium", wordCount > 0 ? "text-gray-600" : "text-gray-400")}>
                  {wordCount} từ
                </span>
                <div className="flex gap-2">
                  <button onClick={() => { setText(""); setFeedback(null); }} className="btn-ghost text-sm py-1.5">
                    Xóa
                  </button>
                  <button
                    onClick={getFeedback}
                    disabled={loading || text.trim().length < 20}
                    className="btn-primary text-sm py-2 disabled:opacity-50"
                  >
                    {loading ? "AI đang chấm..." : "🤖 Nhận phản hồi AI"}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            {loading && (
              <div className="card p-6 text-center">
                <div className="animate-spin text-3xl mb-3">⏳</div>
                <p className="text-gray-500 text-sm">AI đang phân tích bài viết của bạn...</p>
              </div>
            )}

            {feedback && (
              <div className="card p-5 border-l-4 border-brand-400 animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-semibold text-gray-900">Phản hồi từ AI Writing Coach</h3>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback}</div>
              </div>
            )}

            {/* Note if no API key */}
            <div className="card p-4 bg-blue-50 border-blue-100">
              <p className="text-xs text-blue-700">
                💡 <strong>Lưu ý:</strong> Tính năng AI Writing Coach cần cấu hình <code>ANTHROPIC_API_KEY</code> trong file <code>.env.local</code>.
                Bài tập viết vẫn hoạt động đầy đủ — chỉ phần AI feedback cần API key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
