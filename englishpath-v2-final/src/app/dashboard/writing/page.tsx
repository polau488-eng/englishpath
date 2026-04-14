"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { LevelBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PROMPTS = [
  { id: "p1", level: "A2", title: "My favorite place",           min: 60,  max: 100,  hint: "Mô tả nơi bạn yêu thích và giải thích tại sao.", starters: ["My favorite place is...", "I love going to... because..."] },
  { id: "p2", level: "A2", title: "A memorable day",             min: 80,  max: 120,  hint: "Kể về một ngày đáng nhớ trong cuộc đời bạn.",   starters: ["One day I will never forget is...", "Last year, something amazing happened..."] },
  { id: "p3", level: "B1", title: "Advantages and disadvantages of social media", min: 120, max: 180, hint: "Viết về mặt tích cực và tiêu cực của mạng xã hội.", starters: ["Social media has become an important part of...", "While social media offers many benefits..."] },
  { id: "p4", level: "B1", title: "Should schools ban smartphones?", min: 150, max: 200, hint: "Trình bày ý kiến của bạn kèm lý do và ví dụ.", starters: ["In my opinion, schools should...", "The question of whether schools should ban smartphones..."] },
  { id: "p5", level: "B2", title: "IELTS Task 2: Technology and human connection", min: 250, max: 300, hint: "Some people think technology has made people more isolated. To what extent do you agree?", starters: ["It is often argued that modern technology...", "In recent years, rapid technological advancement has..."] },
];

const WRITING_TIPS: Record<string, string[]> = {
  A2: ["Dùng câu đơn giản, rõ ràng", "Thêm tính từ để mô tả chi tiết", "Kết nối câu bằng: and, but, because, so", "Kiểm tra: subject + verb agreement"],
  B1: ["Mỗi đoạn có topic sentence rõ ràng", "Dùng discourse markers: However, Furthermore, Therefore", "Thêm ví dụ cụ thể để minh họa", "Câu kết bài tóm tắt ý chính"],
  B2: ["Mở bài paraphrase đề bài, không copy", "Dùng các cấu trúc nâng cao: passive, inversion, cleft", "Balance argument: đưa cả 2 phía trước khi kết luận", "Kết bài gồm summary + personal stance"],
};

type FeedbackSection = { title: string; items: string[]; color: string };

function parseFeedback(raw: string): FeedbackSection[] {
  const sections: FeedbackSection[] = [];
  const lines = raw.split("\n").filter(l => l.trim());
  let current: FeedbackSection | null = null;
  for (const line of lines) {
    if (line.startsWith("**") || line.startsWith("##") || line.match(/^\d\./)) {
      if (current) sections.push(current);
      const title = line.replace(/\*\*/g, "").replace(/##/g, "").replace(/^\d\./, "").trim();
      const color = title.toLowerCase().includes("lỗi") || title.toLowerCase().includes("sai") ? "red"
        : title.toLowerCase().includes("tốt") || title.toLowerCase().includes("điểm mạnh") ? "green"
        : title.toLowerCase().includes("gợi ý") || title.toLowerCase().includes("cải thiện") ? "blue"
        : "gray";
      current = { title, items: [], color };
    } else if (current && line.trim().startsWith("-")) {
      current.items.push(line.replace(/^-/, "").trim());
    } else if (current && line.trim()) {
      current.items.push(line.trim());
    }
  }
  if (current) sections.push(current);
  return sections.length > 0 ? sections : [{ title: "Phản hồi từ AI", items: [raw], color: "gray" }];
}

export default function WritingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState("");
  const [feedbackRaw, setFeedbackRaw] = useState<string | null>(null);
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "tips" | "history">("write");
  const [history, setHistory] = useState<{ prompt: string; text: string; score: number; date: string }[]>([]);
  const [showStarters, setShowStarters] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const level = selectedPrompt.level as "A2" | "B1" | "B2";
  const tips = WRITING_TIPS[level] ?? WRITING_TIPS["A2"];
  const progressPct = Math.min(100, Math.round((wordCount / selectedPrompt.min) * 100));

  async function getFeedback() {
    if (wordCount < 20) { toast.error("Hãy viết ít nhất 20 từ trước khi nhận phản hồi"); return; }
    setLoading(true);
    setFeedbackRaw(null);
    setFeedbackSections([]);
    setScore(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "writing_coach", content: `Đề bài: "${selectedPrompt.title}"\n\nBài viết:\n${text}`, level: selectedPrompt.level }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const raw: string = data.result;
      setFeedbackRaw(raw);
      setFeedbackSections(parseFeedback(raw));

      // Extract score from feedback
      const scoreMatch = raw.match(/(\d+)\s*\/\s*10|điểm[:\s]+(\d+)/i);
      const parsedScore = scoreMatch ? parseInt(scoreMatch[1] ?? scoreMatch[2]) * 10 : Math.min(90, 50 + wordCount / 3);
      setScore(Math.min(100, parsedScore));

      // Save to history
      setHistory(h => [{ prompt: selectedPrompt.title, text: text.slice(0, 100) + "...", score: parsedScore * 10, date: new Date().toLocaleDateString("vi-VN") }, ...h].slice(0, 5));
      toast.success("AI đã chữa bài xong!");
    } catch (err) {
      toast.error("Lỗi kết nối AI. Kiểm tra ANTHROPIC_API_KEY.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Kỹ năng Viết" subtitle="AI Writing Coach — chữa lỗi, chấm điểm, gợi ý cải thiện" />
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {([
            { key: "write",   icon: "✍️", label: "Viết bài" },
            { key: "tips",    icon: "💡", label: "Mẹo viết" },
            { key: "history", icon: "📋", label: "Lịch sử" },
          ] as { key: typeof tab; icon: string; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── WRITE TAB ── */}
        {tab === "write" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Prompt selector */}
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Chọn đề bài</p>
                <div className="space-y-2">
                  {PROMPTS.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPrompt(p); setText(""); setFeedbackRaw(null); setScore(null); setShowStarters(false); }}
                      className={cn("w-full text-left px-4 py-3 rounded-xl border transition-all",
                        selectedPrompt.id === p.id ? "bg-purple-50 border-purple-300" : "bg-white border-gray-200 hover:border-gray-300"
                      )}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <LevelBadge level={p.level as "A1" | "A2" | "B1" | "B2"} />
                        <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                      </div>
                      <p className="text-xs text-gray-500">{p.hint} ({p.min}–{p.max} từ)</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <div className="card overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedPrompt.title}</p>
                    <p className="text-xs text-gray-500">{selectedPrompt.hint}</p>
                  </div>
                  <button onClick={() => setShowStarters(!showStarters)}
                    className="text-xs text-purple-600 font-medium hover:underline">
                    {showStarters ? "Ẩn gợi ý" : "💡 Câu mở đầu"}
                  </button>
                </div>

                {showStarters && (
                  <div className="border-b border-gray-100 p-4 bg-purple-50">
                    <p className="text-xs font-medium text-purple-700 mb-2">Gợi ý câu mở đầu — click để dùng:</p>
                    <div className="space-y-2">
                      {selectedPrompt.starters.map((s, i) => (
                        <button key={i} onClick={() => { setText(s + " "); setShowStarters(false); }}
                          className="block w-full text-left text-sm text-purple-800 bg-white border border-purple-200 rounded-lg px-3 py-2 hover:bg-purple-50 transition-all italic">
                          &ldquo;{s}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Bắt đầu viết bài của bạn ở đây..."
                  className="w-full p-5 text-gray-900 resize-none focus:outline-none text-sm leading-relaxed min-h-[280px] bg-white"
                  spellCheck={false}
                />
                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-4">
                    <span className={cn("text-sm font-semibold", wordCount >= selectedPrompt.min ? "text-green-600" : "text-gray-500")}>
                      {wordCount} / {selectedPrompt.min}–{selectedPrompt.max} từ
                    </span>
                    <div className="w-24">
                      <Progress value={progressPct} size="sm"
                        barClassName={progressPct >= 100 ? "bg-green-500" : progressPct >= 60 ? "bg-brand-500" : "bg-amber-400"} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setText(""); setFeedbackRaw(null); setScore(null); }}
                      className="btn-ghost text-sm text-gray-400">Xóa</button>
                    <button onClick={getFeedback} disabled={loading || wordCount < 20}
                      className="btn-primary text-sm disabled:opacity-50">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          AI đang chấm...
                        </span>
                      ) : "🤖 Nhận phản hồi AI"}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              {feedbackSections.length > 0 && (
                <div className="card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      🤖 Phản hồi từ AI Writing Coach
                    </h3>
                    {score !== null && (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={cn("text-2xl font-bold", score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-500")}>{score}/100</p>
                          <p className="text-xs text-gray-400">Điểm tổng</p>
                        </div>
                        <div className="w-16">
                          <Progress value={score} size="lg"
                            barClassName={score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-400"} />
                        </div>
                      </div>
                    )}
                  </div>
                  {feedbackSections.map((sec, i) => (
                    <div key={i} className={cn("rounded-xl p-4 border",
                      sec.color === "red"   ? "bg-red-50 border-red-200"    :
                      sec.color === "green" ? "bg-green-50 border-green-200" :
                      sec.color === "blue"  ? "bg-blue-50 border-blue-200"   :
                      "bg-gray-50 border-gray-200"
                    )}>
                      <p className={cn("font-semibold text-sm mb-2",
                        sec.color === "red"   ? "text-red-800"   :
                        sec.color === "green" ? "text-green-800" :
                        sec.color === "blue"  ? "text-blue-800"  :
                        "text-gray-800"
                      )}>{sec.title}</p>
                      <ul className="space-y-1.5">
                        {sec.items.map((item, j) => (
                          <li key={j} className={cn("text-sm flex gap-2",
                            sec.color === "red"   ? "text-red-700"   :
                            sec.color === "green" ? "text-green-700" :
                            sec.color === "blue"  ? "text-blue-700"  :
                            "text-gray-700"
                          )}>
                            <span className="flex-shrink-0 mt-0.5">
                              {sec.color === "red" ? "❌" : sec.color === "green" ? "✅" : sec.color === "blue" ? "💡" : "•"}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button onClick={() => { setFeedbackRaw(null); setFeedbackSections([]); }}
                    className="btn-ghost text-sm text-gray-400 w-full justify-center">Ẩn phản hồi</button>
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              {/* Stats */}
              {score !== null && (
                <div className="card p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Kết quả bài viết</p>
                  <div className={cn("text-3xl font-bold mb-1 text-center", score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-500")}>{score}/100</div>
                  <div className="mb-2"><Progress value={score} barClassName={score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-400"} /></div>
                  <p className="text-xs text-center text-gray-500">
                    {score >= 80 ? "🌟 Xuất sắc! Viết rất tốt." : score >= 60 ? "👍 Khá tốt! Còn cải thiện được." : "💪 Cần luyện thêm. Đọc gợi ý AI."}
                  </p>
                </div>
              )}

              {/* Quick tips */}
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Mẹo nhanh — {level}</p>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600">
                      <span className="text-purple-500 flex-shrink-0">→</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Useful phrases */}
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Cụm từ hữu ích</p>
                <div className="space-y-1.5">
                  {(level === "B2" ? [
                    "It is often argued that...",
                    "While it is true that...",
                    "The evidence suggests...",
                    "From my perspective...",
                    "In conclusion, it is clear that...",
                  ] : level === "B1" ? [
                    "In my opinion,...",
                    "On the other hand,...",
                    "For example,...",
                    "As a result,...",
                    "To sum up,...",
                  ] : [
                    "I think...",
                    "Because...",
                    "First, ... Second,...",
                    "In the end,...",
                    "I really like...",
                  ]).map((ph, i) => (
                    <button key={i} onClick={() => setText(t => t + (t.endsWith(" ") || t === "" ? "" : " ") + ph + " ")}
                      className="block w-full text-left text-xs text-gray-600 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-lg px-3 py-1.5 transition-all italic">
                      &ldquo;{ph}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Word count target */}
              <div className="card p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Mục tiêu độ dài</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <Progress value={progressPct} barClassName={progressPct >= 100 ? "bg-green-500" : "bg-purple-400"} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{wordCount}/{selectedPrompt.min}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {wordCount < selectedPrompt.min
                    ? `Cần thêm ${selectedPrompt.min - wordCount} từ để đạt ngưỡng tối thiểu`
                    : wordCount > selectedPrompt.max
                    ? `Vượt quá ${wordCount - selectedPrompt.max} từ — cân nhắc rút gọn`
                    : "✅ Đạt độ dài yêu cầu!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TIPS TAB ── */}
        {tab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { level: "A2", color: "bg-teal-50 border-teal-200", title: "Viết A2 — Email & Mô tả", tips: [
                "Dùng câu đơn giản: S + V + O. Ví dụ: I visited Hanoi last week.",
                "Kết nối ý bằng: and, but, because, so, then.",
                "Thêm tính từ: big, beautiful, delicious, interesting để bài sinh động hơn.",
                "Kiểm tra: mỗi câu có subject và verb chưa?",
                "Email: Dear... / I am writing to... / Best regards,...",
              ]},
              { level: "B1", color: "bg-amber-50 border-amber-200", title: "Viết B1 — Luận điểm & Hội thoại", tips: [
                "Mỗi đoạn = 1 ý chính. Bắt đầu bằng topic sentence.",
                "Dùng discourse markers: However, Furthermore, Therefore, In addition.",
                "Thêm ví dụ: 'For example, studies show that...'",
                "Tránh lặp từ — dùng synonyms: good = beneficial, great, excellent.",
                "Kết bài: In conclusion, it is clear that... + ý kiến cá nhân.",
              ]},
              { level: "B2", color: "bg-orange-50 border-orange-200", title: "Viết B2 — Essay IELTS", tips: [
                "Mở bài: Paraphrase đề bài (không copy), nêu quan điểm chung.",
                "Thân bài 1: Lập luận chính với evidence + example.",
                "Thân bài 2: Lập luận đối lập hoặc ý chính thứ 2.",
                "Dùng cấu trúc nâng cao: passive voice, conditionals, relative clauses.",
                "Kết bài: Summary ngắn + stance rõ ràng. Không đưa ý mới.",
              ]},
              { level: "All", color: "bg-purple-50 border-purple-200", title: "Lỗi phổ biến của người Việt", tips: [
                "❌ Dùng từ 'very' quá nhiều → ✅ Dùng: extremely, incredibly, remarkably.",
                "❌ Câu thiếu subject → ✅ Luôn có S + V trong câu tiếng Anh.",
                "❌ Sai thì (tense): viết hiện tại khi kể chuyện quá khứ.",
                "❌ Article sai: a/an/the → 'a' trước phụ âm, 'an' trước nguyên âm.",
                "❌ Plural thiếu: 'many student' → ✅ 'many students'.",
              ]},
            ].map(section => (
              <div key={section.level} className={cn("card p-5 border", section.color)}>
                <p className="font-semibold text-gray-900 mb-3">{section.title}</p>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="flex-shrink-0 text-gray-400 mt-0.5">{i + 1}.</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">📄</p>
                <p className="font-medium text-gray-600">Chưa có bài viết nào</p>
                <p className="text-sm mt-1">Viết bài và nhận AI feedback để lưu lịch sử</p>
                <button onClick={() => setTab("write")} className="btn-primary mt-4">Viết bài đầu tiên →</button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">{history.length} bài viết gần đây</p>
                {history.map((item, i) => (
                  <div key={i} className="card p-5 flex items-start gap-4">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0",
                      item.score >= 80 ? "bg-green-100 text-green-700" : item.score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>{Math.round(item.score / 10)}/10</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.prompt}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
