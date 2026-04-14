"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { MOCK_LESSONS } from "@/lib/mock-data";
import { SKILL_CONFIG, cn } from "@/lib/utils";
import { LevelBadge, SkillBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import type { Exercise } from "@/types";
import toast from "react-hot-toast";

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = MOCK_LESSONS.find((l) => l.id === params.id) ?? MOCK_LESSONS[0];
  const { addXP, saveLessonResult } = useAppStore();

  const [step, setStep] = useState<"intro" | "content" | "exercises" | "result">("intro");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [fillAnswer, setFillAnswer] = useState("");
  const startTime = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setTimeSpent(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const allExercises: Exercise[] = lesson.content.sections.flatMap((s) => s.exercises ?? []);
  const currentEx = allExercises[exerciseIndex];
  const skillCfg = SKILL_CONFIG[lesson.skill];

  function handleAnswer(exerciseId: string, answer: string, correct: string | string[]) {
    if (answers[exerciseId] !== undefined) return;
    const isCorrect = Array.isArray(correct) ? correct.includes(answer) : answer === correct;
    setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
    setShowExplanation((prev) => ({ ...prev, [exerciseId]: true }));
    if (isCorrect) toast.success("Chính xác! 🎉", { duration: 1500 });
    else toast.error("Chưa đúng, xem giải thích bên dưới", { duration: 2000 });
  }

  function nextExercise() {
    if (exerciseIndex < allExercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
      setFillAnswer("");
    } else {
      // Calculate score
      let correct = 0;
      allExercises.forEach((ex) => {
        const ans = answers[ex.id];
        if (!ans) return;
        const isCorrect = Array.isArray(ex.correct_answer)
          ? ex.correct_answer.includes(ans)
          : ans === ex.correct_answer;
        if (isCorrect) correct++;
      });
      const finalScore = Math.round((correct / Math.max(allExercises.length, 1)) * 100);
      setScore(finalScore);
      saveLessonResult(lesson.id, finalScore);
      if (finalScore >= 60) addXP(lesson.xp_reward);
      setStep("result");
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── INTRO ──
  if (step === "intro") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <Link href="/dashboard/lessons" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Quay lại danh sách
        </Link>

        <div className="card p-8">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5", skillCfg.bg)}>
            {skillCfg.icon}
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <LevelBadge level={lesson.level} />
            <SkillBadge skill={lesson.skill} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-600 mb-6">{lesson.description}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Thời gian", value: `${lesson.duration_minutes} phút`, icon: "⏱" },
              { label: "Phần thưởng", value: `+${lesson.xp_reward} XP`, icon: "⚡" },
              { label: "Bài tập", value: `${allExercises.length} câu`, icon: "📝" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl mb-0.5">{s.icon}</p>
                <p className="font-bold text-gray-900 text-sm">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Vocabulary preview */}
          {lesson.content.vocabulary && lesson.content.vocabulary.length > 0 && (
            <div className="bg-brand-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-brand-800 mb-2">📚 Từ vựng trong bài ({lesson.content.vocabulary.length} từ)</p>
              <div className="flex flex-wrap gap-2">
                {lesson.content.vocabulary.map((w) => (
                  <span key={w.word} className="px-2.5 py-1 bg-white rounded-lg text-sm text-brand-700 border border-brand-200 font-medium">
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grammar note preview */}
          {lesson.content.grammar_note && (
            <div className="bg-amber-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-amber-800">📐 Ngữ pháp: {lesson.content.grammar_note.point}</p>
            </div>
          )}

          <button onClick={() => setStep("content")} className="btn-primary w-full justify-center text-base py-3">
            Bắt đầu học →
          </button>
        </div>
      </div>
    </div>
  );

  // ── CONTENT ──
  if (step === "content") return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
        <button onClick={() => setStep("intro")} className="text-gray-400 hover:text-gray-700 text-lg">←</button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{lesson.title}</p>
          <Progress value={33} size="sm" className="mt-1" />
        </div>
        <span className="text-sm text-gray-400 font-mono">{formatTime(timeSpent)}</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Intro text */}
        {lesson.content.intro && (
          <div className="card p-6">
            <p className="text-sm font-semibold text-gray-500 mb-2">GIỚI THIỆU</p>
            <p className="text-gray-800 leading-relaxed">{lesson.content.intro}</p>
          </div>
        )}

        {/* Content sections */}
        {lesson.content.sections.map((section, i) => (
          <div key={i} className="card p-6">
            {section.type === "audio" && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  🎧 NGHE
                </p>
                <p className="text-gray-700 mb-4">{section.content}</p>
                {/* Audio player mock */}
                <div className="bg-gray-900 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">{lesson.title}</p>
                      <p className="text-xs text-gray-400">Audio bài học · 1:45</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {["0.75x", "1x", "1.25x", "1.5x"].map((spd) => (
                        <button key={spd} className={cn(
                          "text-xs px-2 py-0.5 rounded-full transition-all",
                          spd === "1x" ? "bg-brand-500 text-white" : "text-gray-400 hover:text-white"
                        )}>{spd}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-full h-1.5 mb-3">
                    <div className="bg-brand-500 h-1.5 rounded-full w-1/3" />
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <button className="text-gray-400 hover:text-white text-xl">⏮</button>
                    <button className="w-12 h-12 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center text-xl transition-all">
                      ▶
                    </button>
                    <button className="text-gray-400 hover:text-white text-xl">⏭</button>
                  </div>
                </div>
              </>
            )}

            {section.type === "text" && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-3">📖 NỘI DUNG</p>
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Vocabulary */}
        {lesson.content.vocabulary && lesson.content.vocabulary.length > 0 && (
          <div className="card p-6">
            <p className="text-sm font-semibold text-gray-500 mb-4">📚 TỪ VỰNG TRONG BÀI</p>
            <div className="space-y-3">
              {lesson.content.vocabulary.map((w) => (
                <div key={w.word} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-sm font-bold text-brand-700 flex-shrink-0">
                    {w.word.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">{w.word}</span>
                      <span className="text-sm text-gray-400 font-mono">{w.ipa}</span>
                    </div>
                    <p className="text-sm text-brand-700 font-medium">{w.meaning_vi}</p>
                    <p className="text-xs text-gray-500 italic mt-0.5">"{w.example}"</p>
                  </div>
                  <button className="text-2xl hover:scale-110 transition-transform flex-shrink-0" title="Nghe phát âm">🔊</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grammar note */}
        {lesson.content.grammar_note && (
          <div className="card p-6 border-l-4 border-amber-400">
            <p className="text-sm font-semibold text-amber-700 mb-2">📐 GHI CHÚ NGỮ PHÁP</p>
            <h3 className="font-bold text-gray-900 mb-2">{lesson.content.grammar_note.point}</h3>
            <p className="text-sm text-gray-700 mb-3">{lesson.content.grammar_note.explanation}</p>
            <div className="space-y-1.5 mb-3">
              {lesson.content.grammar_note.examples.map((ex, i) => (
                <p key={i} className="text-sm text-brand-700 flex gap-2">
                  <span className="text-brand-400">→</span>{ex}
                </p>
              ))}
            </div>
            {lesson.content.grammar_note.common_mistakes.length > 0 && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Lỗi thường gặp:</p>
                {lesson.content.grammar_note.common_mistakes.map((m, i) => (
                  <p key={i} className="text-xs text-red-600">{m}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={() => setStep("exercises")} className="btn-primary w-full justify-center text-base py-3">
          {allExercises.length > 0 ? "Vào bài tập →" : "Hoàn thành →"}
        </button>
      </div>
    </div>
  );

  // ── EXERCISES ──
  if (step === "exercises" && currentEx) {
    const picked = answers[currentEx.id];
    const showExp = showExplanation[currentEx.id];
    const isCorrect = picked !== undefined && picked !== null && (
      Array.isArray(currentEx.correct_answer)
        ? currentEx.correct_answer.includes(picked)
        : picked === currentEx.correct_answer
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <button onClick={() => setStep("content")} className="text-gray-400 hover:text-gray-700">←</button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Câu {exerciseIndex + 1}/{allExercises.length}</span>
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
            <Progress value={exerciseIndex + 1} max={allExercises.length} size="sm" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-gray-100 text-gray-600 capitalize">{currentEx.type.replace("_", " ")}</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-5">{currentEx.question}</h2>

            {/* Multiple choice */}
            {currentEx.type === "multiple_choice" && (
              <div className="space-y-3">
                {currentEx.options?.map((opt) => {
                  const isPicked = picked === opt;
                  const isRight = opt === currentEx.correct_answer;
                  return (
                    <button
                      key={opt}
                      disabled={picked !== undefined}
                      onClick={() => handleAnswer(currentEx.id, opt, currentEx.correct_answer)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all",
                        picked === undefined
                          ? "bg-white border-gray-200 hover:border-brand-400 hover:bg-brand-50 text-gray-800"
                          : isRight
                            ? "bg-green-50 border-green-400 text-green-800"
                            : isPicked
                              ? "bg-red-50 border-red-400 text-red-800"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                      )}
                    >
                      <span className="mr-2">{isRight && picked !== undefined ? "✅" : isPicked && !isRight ? "❌" : "○"}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False */}
            {currentEx.type === "true_false" && (
              <div className="flex gap-3">
                {(currentEx.options ?? ["True", "False", "Not Given"]).map((opt) => {
                  const isPicked = picked === opt;
                  const isRight = opt === currentEx.correct_answer;
                  return (
                    <button
                      key={opt}
                      disabled={picked !== undefined}
                      onClick={() => handleAnswer(currentEx.id, opt, currentEx.correct_answer)}
                      className={cn(
                        "flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all",
                        picked === undefined
                          ? "bg-white border-gray-200 hover:border-brand-400 text-gray-700"
                          : isRight ? "bg-green-50 border-green-400 text-green-800"
                            : isPicked ? "bg-red-50 border-red-400 text-red-800"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                      )}
                    >{opt}</button>
                  );
                })}
              </div>
            )}

            {/* Fill blank */}
            {currentEx.type === "fill_blank" && (
              <div>
                {currentEx.hint && (
                  <p className="text-xs text-amber-600 mb-3 bg-amber-50 p-2 rounded-lg">💡 Gợi ý: {currentEx.hint}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fillAnswer}
                    onChange={(e) => setFillAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && picked === undefined && handleAnswer(currentEx.id, fillAnswer, currentEx.correct_answer)}
                    disabled={picked !== undefined}
                    placeholder="Nhập câu trả lời..."
                    className="input-field flex-1"
                  />
                  {picked === undefined && (
                    <button
                      onClick={() => handleAnswer(currentEx.id, fillAnswer, currentEx.correct_answer)}
                      className="btn-primary px-5"
                    >Kiểm tra</button>
                  )}
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExp && (
              <div className={cn(
                "mt-4 p-4 rounded-xl border",
                isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-green-800" : "text-red-800")}>
                  {isCorrect ? "🎉 Chính xác!" : `❌ Đáp án đúng: ${currentEx.correct_answer}`}
                </p>
                <p className="text-sm text-gray-700">{currentEx.explanation}</p>
              </div>
            )}
          </div>

          {showExp && (
            <button onClick={nextExercise} className="btn-primary w-full justify-center py-3">
              {exerciseIndex < allExercises.length - 1 ? "Câu tiếp theo →" : "Hoàn thành bài học 🎓"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (step === "result") {
    const passed = score >= 60;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full card p-8 text-center space-y-5">
          <div className="text-6xl">{passed ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-900">
            {passed ? "Tuyệt vời!" : "Cố lên nhé!"}
          </h2>
          <div className="flex items-center justify-center gap-8 py-4">
            <div>
              <p className={cn("text-4xl font-bold", passed ? "text-brand-600" : "text-amber-600")}>{score}%</p>
              <p className="text-sm text-gray-500 mt-1">Điểm số</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-700">{formatTime(timeSpent)}</p>
              <p className="text-sm text-gray-500 mt-1">Thời gian</p>
            </div>
            {passed && (
              <div>
                <p className="text-4xl font-bold text-amber-500">+{lesson.xp_reward}</p>
                <p className="text-sm text-gray-500 mt-1">XP</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/lessons" className="btn-secondary flex-1 justify-center">
              ← Bài học
            </Link>
            <button
              onClick={() => { setStep("exercises"); setExerciseIndex(0); setAnswers({}); setShowExplanation({}); setFillAnswer(""); }}
              className="btn-primary flex-1 justify-center"
            >
              {passed ? "Học bài mới →" : "Làm lại 🔄"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
