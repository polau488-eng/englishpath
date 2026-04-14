"use client";
import { useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/Progress";
import { PLACEMENT_QUESTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";

function calcLevel(answers: number[]): Level {
  let score = 0;
  PLACEMENT_QUESTIONS.forEach((q, i) => { if (answers[i] === q.correct) score++; });
  const pct = (score / PLACEMENT_QUESTIONS.length) * 100;
  if (pct >= 80) return "B2";
  if (pct >= 60) return "B1";
  if (pct >= 35) return "A2";
  return "A1";
}

const LEVEL_ADVICE: Record<Level, { title: string; desc: string; lessons: number; weeks: number }> = {
  A1: { title: "Bắt đầu từ nền tảng", desc: "Bạn sẽ học từ những kiến thức cơ bản nhất — bảng chữ cái IPA, câu đơn giản, từ vựng thiết yếu. Đừng lo, mỗi ngày 20 phút là đủ!", lessons: 60, weeks: 12 },
  A2: { title: "Nền tảng đã có, phát triển thêm", desc: "Bạn đã có vốn tiếng Anh cơ bản. Chúng ta sẽ tập trung vào giao tiếp hàng ngày, đọc hiểu và mở rộng ngữ pháp.", lessons: 80, weeks: 16 },
  B1: { title: "Trung cấp — lên một tầm cao mới", desc: "Bạn đã giao tiếp được. Giờ là lúc học nghe tin tức, viết đoạn văn và nắm các cấu trúc ngữ pháp phức tạp hơn.", lessons: 100, weeks: 20 },
  B2: { title: "Khá — hoàn thiện để đạt mục tiêu", desc: "Bạn đang ở mức khá. Chúng ta sẽ luyện essay, debate, và chuẩn bị cho IELTS 6.0+ hoặc TOEIC 750+.", lessons: 120, weeks: 24 },
};

export default function PlacementTestPage() {
  const [step, setStep] = useState<"intro" | "test" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultLevel, setResultLevel] = useState<Level>("A1");

  const q = PLACEMENT_QUESTIONS[current];
  const progress = ((current) / PLACEMENT_QUESTIONS.length) * 100;

  function handleNext() {
    const newAnswers = [...answers, selected ?? -1];
    if (current < PLACEMENT_QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const level = calcLevel(newAnswers);
      setResultLevel(level);
      setStep("result");
    }
  }

  // ── INTRO ──
  if (step === "intro") return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Trang chủ</Link>

        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiểm tra trình độ</h1>
          <p className="text-gray-600 mb-6">Làm bài kiểm tra 10 câu để chúng tôi xác định cấp độ phù hợp và tạo lộ trình học cá nhân hóa cho bạn.</p>

          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            {[
              { icon: "⏱", val: "5–10 phút", lbl: "Thời gian" },
              { icon: "❓", val: "10 câu",    lbl: "Số câu" },
              { icon: "🎓", val: "A1–B2",    lbl: "Phạm vi" },
            ].map((s) => (
              <div key={s.lbl} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl mb-0.5">{s.icon}</p>
                <p className="font-bold text-gray-900 text-sm">{s.val}</p>
                <p className="text-xs text-gray-500">{s.lbl}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setStep("test")} className="btn-primary w-full justify-center text-base py-3">
            Bắt đầu kiểm tra →
          </button>
          <p className="text-xs text-gray-400 mt-3">Không cần tài khoản để làm bài kiểm tra</p>
        </div>
      </div>
    </div>
  );

  // ── TEST ──
  if (step === "test") return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Câu {current + 1} / {PLACEMENT_QUESTIONS.length}</span>
            <span className="text-xs text-gray-400 badge bg-gray-100">{q.level}</span>
          </div>
          <Progress value={progress} size="md" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="card p-8">
            {/* Level indicator */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Cấp độ {q.level} · {q.skill === "grammar" ? "Ngữ pháp" : "Từ vựng"}
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-6">{q.question}</h2>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium text-sm transition-all",
                    selected === i
                      ? "border-brand-500 bg-brand-50 text-brand-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mr-3 font-bold border transition-all",
                    selected === i ? "bg-brand-500 border-brand-500 text-white" : "border-gray-300 text-gray-400"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setAnswers([...answers, -1]); setCurrent(current + 1); setSelected(null); }}
                className="btn-secondary"
              >
                Bỏ qua
              </button>
              <button
                disabled={selected === null}
                onClick={handleNext}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                {current < PLACEMENT_QUESTIONS.length - 1 ? "Câu tiếp theo →" : "Xem kết quả →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──
  const advice = LEVEL_ADVICE[resultLevel];
  const levelColors: Record<Level, string> = {
    A1: "from-green-400 to-emerald-500",
    A2: "from-teal-400 to-cyan-500",
    B1: "from-amber-400 to-orange-500",
    B2: "from-orange-400 to-red-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-5">
        {/* Result card */}
        <div className="card p-8 text-center">
          <div className={cn(
            "w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center text-white font-bold text-3xl bg-gradient-to-br",
            levelColors[resultLevel]
          )}>
            {resultLevel}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Trình độ của bạn: {resultLevel}</h1>
          <p className="text-lg text-gray-600 font-medium mb-2">{advice.title}</p>
          <p className="text-gray-500 text-sm mb-6">{advice.desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">{advice.lessons}</p>
              <p className="text-xs text-gray-500">bài học phù hợp</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">~{advice.weeks}</p>
              <p className="text-xs text-gray-500">tuần để hoàn thành</p>
            </div>
          </div>

          {/* Level roadmap */}
          <div className="flex items-center gap-2 mb-6 px-2">
            {(["A1", "A2", "B1", "B2"] as Level[]).map((lv, i) => {
              const done = ["A1","A2","B1","B2"].indexOf(resultLevel) > i;
              const cur  = lv === resultLevel;
              return (
                <div key={lv} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-bold text-center border",
                    done ? "bg-brand-500 text-white border-brand-500" :
                    cur  ? "bg-white border-brand-500 text-brand-600 ring-2 ring-brand-200" :
                           "bg-gray-100 border-gray-200 text-gray-400"
                  )}>{lv}</div>
                  {i < 3 && <span className="text-gray-300 text-xs">›</span>}
                </div>
              );
            })}
          </div>

          <Link href="/dashboard" className="btn-primary w-full justify-center text-base py-3">
            Bắt đầu học {resultLevel} ngay →
          </Link>
          <button
            onClick={() => { setStep("test"); setCurrent(0); setSelected(null); setAnswers([]); }}
            className="btn-ghost w-full justify-center mt-2 text-sm"
          >
            Làm lại bài kiểm tra
          </button>
        </div>
      </div>
    </div>
  );
}
