"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { MOCK_LESSONS } from "@/lib/mock-data";

const allWords = MOCK_LESSONS.flatMap((l) => l.content.vocabulary ?? []);

const MODES = ["Flashcard", "Trắc nghiệm", "Điền từ", "Danh sách"];

export default function VocabularyPage() {
  const [mode, setMode] = useState("Danh sách");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");
  const [mcAnswer, setMcAnswer] = useState<number | null>(null);

  const words = allWords.filter(
    (w) => !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning_vi.includes(search)
  );
  const card = words[cardIndex];

  // MC options for current card
  const getOptions = () => {
    const others = words.filter((_, i) => i !== cardIndex).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others.map((o) => o.meaning_vi), card?.meaning_vi].sort(() => Math.random() - 0.5);
  };
  const [mcOptions] = useState(() => getOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Từ vựng" subtitle={`${words.length} từ đang học · Hệ thống SRS thông minh`} />

      <div className="p-6 max-w-4xl mx-auto w-full">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Đã học", value: allWords.length, color: "text-brand-600", bg: "bg-brand-50" },
            { label: "Cần ôn", value: 8, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Thành thạo", value: 214, color: "text-green-600", bg: "bg-green-50" },
            { label: "Hôm nay", value: 12, color: "text-blue-600", bg: "bg-blue-50" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SRS due */}
        <div className="card p-4 mb-6 flex items-center justify-between bg-amber-50 border-amber-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-semibold text-amber-800">8 từ cần ôn tập hôm nay</p>
              <p className="text-sm text-amber-600">Ôn tập đúng lịch giúp ghi nhớ lâu hơn 90%</p>
            </div>
          </div>
          <button className="btn-primary bg-amber-500 hover:bg-amber-600 border-0 text-sm py-2">
            Ôn ngay →
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                mode === m ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >{m}</button>
          ))}
        </div>

        {/* Flashcard mode */}
        {mode === "Flashcard" && card && (
          <div className="flex flex-col items-center gap-6">
            <div
              onClick={() => setFlipped(!flipped)}
              className="w-full max-w-md cursor-pointer"
            >
              <div className={cn(
                "card p-10 text-center min-h-[200px] flex flex-col items-center justify-center gap-4 transition-all duration-300 border-2",
                flipped ? "bg-brand-50 border-brand-200" : "bg-white border-gray-200"
              )}>
                {!flipped ? (
                  <>
                    <p className="text-4xl font-bold text-gray-900">{card.word}</p>
                    <p className="text-gray-400 font-mono text-lg">{card.ipa}</p>
                    <p className="text-xs text-gray-400 mt-2">Nhấn để xem nghĩa</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-brand-700">{card.meaning_vi}</p>
                    <p className="text-gray-600 italic text-sm">"{card.example}"</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { label: "Không nhớ", color: "bg-red-100 text-red-700 hover:bg-red-200", emoji: "😓" },
                { label: "Khó",       color: "bg-amber-100 text-amber-700 hover:bg-amber-200", emoji: "🤔" },
                { label: "Dễ",        color: "bg-green-100 text-green-700 hover:bg-green-200", emoji: "😊" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => { setCardIndex((cardIndex + 1) % words.length); setFlipped(false); }}
                  className={cn("px-5 py-2.5 rounded-xl font-medium text-sm transition-all", btn.color)}
                >
                  {btn.emoji} {btn.label}
                </button>
              ))}
            </div>

            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{cardIndex + 1} / {words.length}</span>
                <span>{Math.round(((cardIndex + 1) / words.length) * 100)}%</span>
              </div>
              <Progress value={cardIndex + 1} max={words.length} />
            </div>
          </div>
        )}

        {/* Multiple choice mode */}
        {mode === "Trắc nghiệm" && card && (
          <div className="max-w-lg mx-auto space-y-4">
            <div className="card p-6 text-center">
              <p className="text-xs text-gray-400 mb-2">Chọn nghĩa đúng của từ:</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.word}</p>
              <p className="text-gray-400 font-mono">{card.ipa}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {mcOptions.map((opt, i) => (
                <button
                  key={i}
                  disabled={mcAnswer !== null}
                  onClick={() => setMcAnswer(i)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-sm font-medium text-left transition-all",
                    mcAnswer === null
                      ? "bg-white border-gray-200 hover:border-brand-300 hover:bg-brand-50"
                      : opt === card.meaning_vi
                        ? "bg-green-50 border-green-400 text-green-800"
                        : mcAnswer === i
                          ? "bg-red-50 border-red-400 text-red-800"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                  )}
                >{opt}</button>
              ))}
            </div>
            {mcAnswer !== null && (
              <button
                onClick={() => { setCardIndex((cardIndex + 1) % words.length); setMcAnswer(null); }}
                className="btn-primary w-full justify-center"
              >Từ tiếp theo →</button>
            )}
          </div>
        )}

        {/* List mode */}
        {mode === "Danh sách" && (
          <>
            <input
              type="search"
              placeholder="🔍  Tìm từ vựng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field mb-4"
            />
            <div className="space-y-2">
              {words.map((w, i) => (
                <div key={i} className="card p-4 flex items-start gap-4 hover:shadow-sm transition-all">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-sm font-bold text-brand-700">
                    {w.word.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">{w.word}</span>
                      <span className="text-xs text-gray-400 font-mono">{w.ipa}</span>
                    </div>
                    <p className="text-sm text-brand-700 font-medium">{w.meaning_vi}</p>
                    <p className="text-xs text-gray-500 italic mt-0.5">"{w.example}"</p>
                  </div>
                  <button className="text-gray-400 hover:text-brand-600 transition-colors text-lg" title="Lưu để ôn tập">
                    ⭐
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
