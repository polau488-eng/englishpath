"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const PHRASES = [
  { text: "Good morning! How are you?", ipa: "/ɡʊd ˈmɔːrnɪŋ haʊ ɑːr juː/", meaning: "Chào buổi sáng! Bạn khỏe không?" },
  { text: "Nice to meet you.", ipa: "/naɪs tə miːt juː/", meaning: "Rất vui được gặp bạn." },
  { text: "Could you repeat that, please?", ipa: "/kʊd juː rɪˈpiːt ðæt pliːz/", meaning: "Bạn có thể nhắc lại không?" },
  { text: "I'm not sure about that.", ipa: "/aɪm nɒt ʃʊər əˈbaʊt ðæt/", meaning: "Tôi không chắc về điều đó." },
];

export default function SpeakingPage() {
  const [recording, setRecording] = useState(false);
  const [activePhrase, setActivePhrase] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Kỹ năng Nói" subtitle="Luyện phát âm, shadowing và role-play với AI" />

      <div className="p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* Info */}
        <div className="card p-5 bg-red-50 border-red-100 flex items-center gap-4">
          <span className="text-4xl">🎤</span>
          <div>
            <h3 className="font-bold text-red-900">Speaking Lab — AI Pronunciation Coach</h3>
            <p className="text-sm text-red-700">Ghi âm giọng nói · So sánh với native speaker · Chấm điểm phát âm từng âm tiết</p>
          </div>
        </div>

        {/* Shadowing practice */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Shadowing Practice</h3>
          <div className="space-y-3">
            {PHRASES.map((p, i) => (
              <div key={i}
                onClick={() => setActivePhrase(i)}
                className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all",
                  activePhrase === i ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                )}>
                <p className="font-semibold text-gray-900 mb-1">{p.text}</p>
                <p className="text-xs text-gray-400 font-mono mb-1">{p.ipa}</p>
                <p className="text-xs text-brand-600">{p.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Record button */}
        <div className="card p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Nhấn để ghi âm câu đã chọn:</p>
          <p className="font-bold text-gray-900 mb-4 text-lg">"{PHRASES[activePhrase].text}"</p>
          <button
            onClick={() => setRecording(!recording)}
            className={cn(
              "w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl transition-all shadow-lg",
              recording
                ? "bg-red-500 hover:bg-red-600 animate-pulse-ring"
                : "bg-brand-600 hover:bg-brand-700"
            )}
          >
            {recording ? "⏹" : "🎙"}
          </button>
          <p className="text-xs text-gray-400 mt-3">{recording ? "Đang ghi âm... Nhấn để dừng" : "Nhấn để bắt đầu ghi âm"}</p>
          {recording && (
            <p className="text-xs text-red-500 mt-1 font-medium animate-pulse">● REC</p>
          )}
          <p className="text-xs text-gray-400 mt-4 bg-gray-50 rounded-lg p-2">
            🔐 Tính năng ghi âm cần trình duyệt cho phép sử dụng microphone
          </p>
        </div>
      </div>
    </div>
  );
}
