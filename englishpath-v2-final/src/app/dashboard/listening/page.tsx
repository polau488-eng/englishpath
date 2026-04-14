"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { LevelBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const LISTENING_TRACKS = [
  {
    id: "lt1", level: "A1" as const, title: "Numbers & Colors", duration: "1:20",
    topic: "Đếm số và màu sắc", icon: "🔢",
    script: [
      { time: "0:00", text: "Hello! Today we're going to practice numbers and colors together." },
      { time: "0:08", text: "First, let's count: one, two, three, four, five." },
      { time: "0:15", text: "Now colors: red, blue, green, yellow, orange, purple." },
      { time: "0:24", text: "Can you see the red apple and the blue sky?" },
      { time: "0:32", text: "The green grass is beautiful today. And the sun is yellow." },
    ],
    questions: [
      { q: "How many numbers does the speaker practice?", opts: ["3", "5", "7", "10"], correct: 1 },
      { q: "What color is the apple?", opts: ["Blue", "Green", "Red", "Yellow"], correct: 2 },
      { q: "What color is the sky?", opts: ["Red", "Blue", "Green", "Purple"], correct: 1 },
    ],
  },
  {
    id: "lt2", level: "A2" as const, title: "Morning Routine", duration: "2:15",
    topic: "Thói quen buổi sáng", icon: "🌅",
    script: [
      { time: "0:00", text: "Hi! I'm Sarah. Let me tell you about my typical morning." },
      { time: "0:07", text: "I usually wake up at six thirty. First, I brush my teeth and wash my face." },
      { time: "0:15", text: "Then I have breakfast. I often eat toast with eggs and drink coffee." },
      { time: "0:24", text: "After breakfast, I check my emails and get ready for work." },
      { time: "0:33", text: "I leave home at eight o'clock and take the bus to the office." },
      { time: "0:42", text: "The commute takes about thirty minutes. I arrive at work at eight thirty." },
    ],
    questions: [
      { q: "What time does Sarah wake up?", opts: ["6:00", "6:30", "7:00", "7:30"], correct: 1 },
      { q: "What does Sarah eat for breakfast?", opts: ["Cereal and milk", "Toast with eggs", "Pancakes", "Nothing"], correct: 1 },
      { q: "How does Sarah get to work?", opts: ["By car", "By bike", "By bus", "On foot"], correct: 2 },
      { q: "How long is her commute?", opts: ["15 minutes", "20 minutes", "30 minutes", "45 minutes"], correct: 2 },
    ],
  },
  {
    id: "lt3", level: "B1" as const, title: "Climate Change Discussion", duration: "3:40",
    topic: "Thảo luận về biến đổi khí hậu", icon: "🌍",
    script: [
      { time: "0:00", text: "Welcome to today's discussion about climate change and what we can do about it." },
      { time: "0:10", text: "Scientists have confirmed that global temperatures are rising due to greenhouse gas emissions." },
      { time: "0:20", text: "The main causes include burning fossil fuels, deforestation, and industrial processes." },
      { time: "0:30", text: "The effects are already visible: more extreme weather events, rising sea levels, and loss of biodiversity." },
      { time: "0:42", text: "However, there are things individuals can do. Reducing energy consumption is a good start." },
      { time: "0:52", text: "Using public transport, eating less meat, and supporting renewable energy are also effective." },
    ],
    questions: [
      { q: "What is the MAIN cause of rising temperatures?", opts: ["Natural cycles", "Greenhouse gas emissions", "Solar activity", "Ocean currents"], correct: 1 },
      { q: "Which is NOT mentioned as an effect of climate change?", opts: ["Extreme weather", "Rising sea levels", "Loss of biodiversity", "Increased rainfall only"], correct: 3 },
      { q: "What is one thing individuals can do?", opts: ["Use more electricity", "Drive more often", "Reduce energy consumption", "Eat more meat"], correct: 2 },
    ],
  },
  {
    id: "lt4", level: "B2" as const, title: "Tech Innovation Podcast", duration: "4:50",
    topic: "Podcast về đổi mới công nghệ", icon: "🎙️",
    script: [
      { time: "0:00", text: "In today's episode, we explore how artificial intelligence is transforming healthcare." },
      { time: "0:12", text: "Machine learning algorithms can now detect certain cancers more accurately than human doctors." },
      { time: "0:24", text: "AI-powered tools are also being used to analyze medical images, patient records, and genetic data." },
      { time: "0:38", text: "However, ethical concerns remain. Questions about data privacy, algorithmic bias, and accountability are unresolved." },
      { time: "0:52", text: "Experts argue that AI should augment, not replace, human medical judgment." },
      { time: "1:05", text: "The technology holds enormous promise, but implementing it responsibly requires careful regulation and oversight." },
    ],
    questions: [
      { q: "AI can detect cancers compared to human doctors with:", opts: ["Lower accuracy", "Similar accuracy", "Higher accuracy", "No comparative data given"], correct: 2 },
      { q: "What is NOT listed as an ethical concern?", opts: ["Data privacy", "Algorithmic bias", "Cost of AI systems", "Accountability"], correct: 2 },
      { q: "What do experts say AI should do in medicine?", opts: ["Replace doctors", "Augment human judgment", "Work independently", "Focus on surgery only"], correct: 1 },
    ],
  },
];

export default function ListeningPage() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);

  const track = LISTENING_TRACKS[activeTrack];

  const correctCount = submitted
    ? track.questions.filter((q, i) => answers[i] === q.correct).length
    : 0;

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setShowScript(false);
  }

  function selectTrack(i: number) {
    setActiveTrack(i);
    reset();
  }

  function speakTrack() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const fullText = track.script.map(s => s.text).join(" ");
    const utt = new SpeechSynthesisUtterance(fullText);
    utt.lang = "en-US";
    utt.rate = speed;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Kỹ năng Nghe" subtitle="Từ hội thoại A1 đến podcast B2 — luyện nghe toàn diện" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">

        {/* Track selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {LISTENING_TRACKS.map((t, i) => (
            <button key={t.id} onClick={() => selectTrack(i)}
              className={cn("p-3 rounded-xl border text-left transition-all",
                activeTrack === i ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:border-gray-300"
              )}>
              <span className="text-2xl block mb-1">{t.icon}</span>
              <p className="text-xs font-semibold text-gray-800 leading-tight">{t.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <LevelBadge level={t.level} />
                <span className="text-xs text-gray-400">⏱ {t.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Player card */}
        <div className="card mb-5">
          {/* Player header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{track.icon}</span>
              <div>
                <h2 className="font-bold text-gray-900">{track.title}</h2>
                <p className="text-sm text-gray-500">{track.topic}</p>
              </div>
              <LevelBadge level={track.level} />
            </div>

            {/* Audio player UI */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="bg-gray-700 rounded-full h-1.5 mb-4 cursor-pointer">
                <div className={cn("bg-brand-500 h-1.5 rounded-full transition-all", playing ? "w-2/5" : "w-0")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Speed control */}
                  <div className="flex gap-1">
                    {[0.75, 1, 1.25, 1.5].map(s => (
                      <button key={s} onClick={() => setSpeed(s)}
                        className={cn("text-xs px-2 py-1 rounded-lg transition-all",
                          speed === s ? "bg-brand-500 text-white" : "text-gray-400 hover:text-white"
                        )}>{s}x</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={playing ? stopSpeaking : speakTrack}
                    className="w-12 h-12 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center text-white text-xl transition-all">
                    {playing ? "⏸" : "▶"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowScript(s => !s)}
                    className={cn("text-xs px-3 py-1.5 rounded-lg transition-all",
                      showScript ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
                    )}>
                    {showScript ? "Ẩn script" : "Xem script"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                🎵 Sử dụng browser TTS — kết nối audio thật qua Cloudinary sau khi có nội dung
              </p>
            </div>
          </div>

          {/* Script */}
          {showScript && (
            <div className="p-5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Script / Transcript</p>
              <div className="space-y-2">
                {track.script.map((line, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-xs text-gray-400 font-mono mt-0.5 flex-shrink-0 w-10">{line.time}</span>
                    <p className="text-gray-700 leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Câu hỏi kiểm tra ({track.questions.length} câu)</h3>
            {submitted && (
              <span className={cn("font-bold text-sm", correctCount === track.questions.length ? "text-green-600" : correctCount >= 2 ? "text-amber-600" : "text-red-500")}>
                {correctCount}/{track.questions.length} đúng
              </span>
            )}
          </div>

          {submitted && (
            <div className="mb-4">
              <Progress value={correctCount} max={track.questions.length}
                barClassName={correctCount === track.questions.length ? "bg-green-500" : correctCount >= 2 ? "bg-amber-500" : "bg-red-400"}
              />
            </div>
          )}

          <div className="space-y-5">
            {track.questions.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium text-gray-900 text-sm mb-2">{qi + 1}. {q.q}</p>
                <div className="space-y-2">
                  {q.opts.map((opt, oi) => {
                    const picked = answers[qi] === oi;
                    const isRight = oi === q.correct;
                    return (
                      <button key={oi} disabled={submitted}
                        onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                        className={cn("w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                          submitted
                            ? isRight ? "bg-green-50 border-green-300 text-green-800"
                              : picked ? "bg-red-50 border-red-300 text-red-800"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                            : picked ? "bg-brand-50 border-brand-400 text-brand-800"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        )}>
                        <span className={cn("inline-flex w-5 h-5 rounded-full border items-center justify-center text-xs mr-2",
                          submitted && isRight ? "bg-green-500 border-green-500 text-white"
                            : submitted && picked && !isRight ? "bg-red-500 border-red-500 text-white"
                            : picked ? "bg-brand-500 border-brand-500 text-white"
                            : "border-gray-300 text-gray-400"
                        )}>{String.fromCharCode(65 + oi)}</span>
                        {opt}
                        {submitted && isRight && " ✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            {!submitted ? (
              <button disabled={Object.keys(answers).length < track.questions.length}
                onClick={() => setSubmitted(true)}
                className="btn-primary flex-1 justify-center disabled:opacity-50">
                Nộp bài ({Object.keys(answers).length}/{track.questions.length})
              </button>
            ) : (
              <>
                <button onClick={reset} className="btn-secondary flex-1 justify-center">Làm lại</button>
                <button onClick={() => { selectTrack((activeTrack + 1) % LISTENING_TRACKS.length); }}
                  className="btn-primary flex-1 justify-center">Bài tiếp →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
