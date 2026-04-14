"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const LESSONS_DATA = [
  {
    id: "s1", level: "A1", title: "Basic Greetings",
    phrases: [
      { text: "Hello! How are you?",              ipa: "/həˈloʊ haʊ ɑːr juː/",              meaning: "Xin chào! Bạn có khỏe không?" },
      { text: "Nice to meet you.",                 ipa: "/naɪs tə miːt juː/",                 meaning: "Rất vui được gặp bạn." },
      { text: "My name is ...",                    ipa: "/maɪ neɪm ɪz/",                      meaning: "Tên tôi là ..." },
      { text: "Where are you from?",               ipa: "/wɛr ɑːr juː frʌm/",                 meaning: "Bạn đến từ đâu?" },
    ],
  },
  {
    id: "s2", level: "A2", title: "Daily Conversation",
    phrases: [
      { text: "Could you repeat that, please?",   ipa: "/kʊd juː rɪˈpiːt ðæt pliːz/",       meaning: "Bạn có thể nhắc lại không?" },
      { text: "I'm not sure about that.",          ipa: "/aɪm nɒt ʃʊər əˈbaʊt ðæt/",         meaning: "Tôi không chắc về điều đó." },
      { text: "What do you think?",                ipa: "/wɒt duː juː θɪŋk/",                 meaning: "Bạn nghĩ sao?" },
      { text: "I totally agree with you.",         ipa: "/aɪ ˈtoʊtəli əˈɡriː wɪð juː/",      meaning: "Tôi hoàn toàn đồng ý với bạn." },
    ],
  },
  {
    id: "s3", level: "B1", title: "Expressing Opinions",
    phrases: [
      { text: "In my opinion, this is important.", ipa: "/ɪn maɪ əˈpɪnjən ðɪs ɪz ɪmˈpɔːrtənt/", meaning: "Theo ý kiến tôi, điều này quan trọng." },
      { text: "I see your point, but...",           ipa: "/aɪ siː jɔːr pɔɪnt bʌt/",            meaning: "Tôi hiểu ý bạn, nhưng..." },
      { text: "That's a good point.",              ipa: "/ðæts ə ɡʊd pɔɪnt/",                meaning: "Đó là một ý kiến hay." },
      { text: "Let me think about it.",            ipa: "/lɛt miː θɪŋk əˈbaʊt ɪt/",          meaning: "Để tôi nghĩ về điều đó." },
    ],
  },
  {
    id: "s4", level: "B2", title: "Debate & Discussion",
    phrases: [
      { text: "While I understand your perspective...", ipa: "/waɪl aɪ ˌʌndərˈstænd jɔːr pərˈspektɪv/", meaning: "Mặc dù tôi hiểu quan điểm của bạn..." },
      { text: "The evidence suggests that...",     ipa: "/ðə ˈevɪdəns səˈdʒɛsts ðæt/",        meaning: "Bằng chứng cho thấy rằng..." },
      { text: "I'd like to challenge that assumption.", ipa: "/aɪd laɪk tə ˈtʃælɪndʒ ðæt əˈsʌmpʃən/", meaning: "Tôi muốn phản biện giả định đó." },
    ],
  },
];

const ROLEPLAY_SCENARIOS = [
  { id: "r1", level: "A2", title: "Tại cửa hàng", icon: "🛍️",
    prompt: "Bạn muốn mua một chiếc áo nhưng không biết size. Hỏi nhân viên cửa hàng.",
    starter: "Excuse me, could you help me?" },
  { id: "r2", level: "B1", title: "Đặt bàn nhà hàng", icon: "🍽️",
    prompt: "Gọi điện đặt bàn cho 4 người vào tối thứ 6.",
    starter: "Hello, I'd like to make a reservation..." },
  { id: "r3", level: "B1", title: "Phỏng vấn xin việc", icon: "💼",
    prompt: "Trả lời câu hỏi 'Tell me about yourself' trong cuộc phỏng vấn.",
    starter: "Well, I graduated from..." },
  { id: "r4", level: "B2", title: "Thuyết trình ý tưởng", icon: "🎤",
    prompt: "Thuyết trình về một dự án khởi nghiệp trong 2 phút.",
    starter: "Good morning everyone. Today I'd like to present..." },
];

type TabType = "shadowing" | "pronunciation" | "roleplay";

export default function SpeakingPage() {
  const [tab, setTab] = useState<TabType>("shadowing");
  const [activeLesson, setActiveLesson] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [roleplayMsg, setRoleplayMsg] = useState("");
  const [roleplayHistory, setRoleplayHistory] = useState<{ role: "user"|"ai"; text: string }[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const lesson  = LESSONS_DATA[activeLesson];
  const phrase  = lesson.phrases[phraseIdx];
  const scenario = ROLEPLAY_SCENARIOS[activeScenario];

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
  }, []);

  function speakText(text: string) {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.85;
    setPlaying(true);
    utt.onend = () => setPlaying(false);
    synthRef.current.speak(utt);
  }

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Trình duyệt không hỗ trợ. Dùng Chrome/Edge."); return; }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(t);
    };
    rec.onend = () => {
      setRecording(false);
      if (transcript) scoreRecording(transcript);
    };
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
    setTranscript("");
    setScore(null);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  function scoreRecording(spoken: string) {
    const target = phrase.text.toLowerCase().replace(/[^a-z\s]/g, "");
    const spokenClean = spoken.toLowerCase().replace(/[^a-z\s]/g, "");
    const targetWords = target.split(" ");
    const spokenWords = spokenClean.split(" ");
    const matches = targetWords.filter(w => spokenWords.some(sw => sw.includes(w) || w.includes(sw)));
    const pct = Math.min(100, Math.round((matches.length / targetWords.length) * 100));
    setScore(pct);
    if (pct >= 80) toast.success(`Xuất sắc! ${pct}% chính xác 🎉`);
    else if (pct >= 60) toast("Khá tốt! Thử lại để cải thiện 💪", { icon: "👍" });
    else toast.error("Cần luyện thêm. Nghe mẫu rồi thử lại!");
  }

  async function sendRoleplay() {
    if (!roleplayMsg.trim()) return;
    const userMsg = roleplayMsg.trim();
    setRoleplayHistory(h => [...h, { role: "user", text: userMsg }]);
    setRoleplayMsg("");
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "roleplay",
          content: `Scenario: ${scenario.prompt}\n\nConversation so far:\n${roleplayHistory.map(m => `${m.role === "user" ? "Student" : "AI"}: ${m.text}`).join("\n")}\nStudent: ${userMsg}`,
          level: scenario.level,
        }),
      });
      const data = await res.json();
      const aiReply = data.result ?? "I'm sorry, I didn't understand that. Could you try again?";
      setRoleplayHistory(h => [...h, { role: "ai", text: aiReply }]);
      speakText(aiReply);
    } catch {
      toast.error("Lỗi kết nối AI");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Kỹ năng Nói" subtitle="Shadowing · Phát âm · Role-play với AI" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {([
            { key: "shadowing",    icon: "🎵", label: "Shadowing"  },
            { key: "pronunciation",icon: "🎯", label: "Phát âm"    },
            { key: "roleplay",     icon: "🎭", label: "Role-play"  },
          ] as { key: TabType; icon: string; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── SHADOWING ── */}
        {tab === "shadowing" && (
          <div className="space-y-5">
            {/* Lesson selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {LESSONS_DATA.map((l, i) => (
                <button key={l.id} onClick={() => { setActiveLesson(i); setPhraseIdx(0); setScore(null); setTranscript(""); }}
                  className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                    activeLesson === i ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  )}>
                  {l.level} · {l.title}
                </button>
              ))}
            </div>

            {/* Main shadowing card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase">Câu {phraseIdx + 1}/{lesson.phrases.length}</span>
                <Progress value={phraseIdx + 1} max={lesson.phrases.length} className="w-32" size="sm" />
              </div>

              {/* Phrase display */}
              <div className="bg-gray-900 rounded-2xl p-6 mb-5 text-center">
                <p className="text-xl font-semibold text-white mb-2 leading-relaxed">{phrase.text}</p>
                <p className="text-sm text-gray-400 font-mono mb-1">{phrase.ipa}</p>
                <p className="text-sm text-brand-400">{phrase.meaning}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-5">
                <button onClick={() => speakText(phrase.text)} disabled={playing}
                  className={cn("flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all",
                    playing ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}>
                  {playing ? "🔊 Đang phát..." : "🔊 Nghe mẫu"}
                </button>
                <button onClick={() => speakText(phrase.text.replace(/\s/g, " ... "))} disabled={playing}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-green-50 text-green-700 hover:bg-green-100 transition-all">
                  🐢 Chậm
                </button>
                <button onClick={recording ? stopRecording : startRecording}
                  className={cn("flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all",
                    recording ? "bg-red-500 text-white animate-pulse" : "bg-red-50 text-red-700 hover:bg-red-100"
                  )}>
                  {recording ? "⏹ Dừng" : "🎤 Ghi âm"}
                </button>
              </div>

              {/* Transcript */}
              {(transcript || score !== null) && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  {transcript && <p className="text-sm text-gray-700 mb-2">📝 Bạn nói: <span className="font-medium">{transcript}</span></p>}
                  {score !== null && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Độ chính xác</span>
                          <span className={cn("font-bold", score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-500")}>{score}%</span>
                        </div>
                        <Progress value={score} size="md" barClassName={score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-400"} />
                      </div>
                      <span className="text-2xl">{score >= 80 ? "🌟" : score >= 60 ? "👍" : "💪"}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <button disabled={phraseIdx === 0} onClick={() => { setPhraseIdx(p => p - 1); setScore(null); setTranscript(""); }}
                  className="btn-secondary flex-1 justify-center disabled:opacity-40">← Trước</button>
                <button disabled={phraseIdx === lesson.phrases.length - 1}
                  onClick={() => { setPhraseIdx(p => p + 1); setScore(null); setTranscript(""); }}
                  className="btn-primary flex-1 justify-center disabled:opacity-40">Tiếp →</button>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-4 bg-amber-50 border-amber-100">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Kỹ thuật Shadowing</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>1. Nghe toàn bộ câu một lần</li>
                <li>2. Nghe lại và nhắc lại ngay sau khi nghe (không dừng)</li>
                <li>3. Chú ý intonation (ngữ điệu) và connected speech</li>
                <li>4. Luyện ≥ 5 lần mỗi câu để phát âm tự nhiên</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── PRONUNCIATION ── */}
        {tab === "pronunciation" && (
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Bảng âm tiếng Anh (IPA) — Phổ biến nhất</h3>
              {[
                { group: "Nguyên âm ngắn",  items: ["ɪ (bit)", "e (bet)", "æ (bat)", "ʌ (but)", "ɒ (bot)", "ʊ (book)", "ə (about)"] },
                { group: "Nguyên âm dài",   items: ["iː (bee)", "ɑː (bar)", "ɔː (bore)", "uː (boo)", "ɜː (bird)"] },
                { group: "Đôi nguyên âm",   items: ["eɪ (bay)", "aɪ (buy)", "ɔɪ (boy)", "əʊ (go)", "aʊ (now)", "ɪə (ear)", "eə (air)"] },
                { group: "Phụ âm khó",      items: ["θ (think)", "ð (this)", "ʃ (she)", "ʒ (measure)", "tʃ (church)", "dʒ (judge)", "ŋ (sing)", "r (red)"] },
              ].map(({ group, items }) => (
                <div key={group} className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => {
                      const [symbol, word] = item.split(" (");
                      return (
                        <button key={item} onClick={() => speakText(word?.replace(")", "") ?? symbol)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm transition-all group">
                          <span className="font-mono text-blue-700 font-bold">{symbol}</span>
                          {word && <span className="text-gray-500 ml-1 text-xs group-hover:text-blue-600">({word}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">👆 Click vào từng âm để nghe phát âm mẫu</p>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Lỗi phát âm phổ biến của người Việt</h3>
              {[
                { wrong: "Không phân biệt l/r",      eg: "lock vs rock, lake vs rake",       fix: "Lưỡi uốn vào giữa cho /r/, chạm răng cửa cho /l/" },
                { wrong: "Phụ âm cuối bị bỏ",        eg: "cat → ca, book → boo",             fix: "Phát âm đủ phụ âm cuối, nhất là -t, -d, -k, -p" },
                { wrong: "th → d hoặc t",             eg: "this → dis, think → tink",         fix: "Đặt lưỡi giữa hai hàm răng, thổi hơi" },
                { wrong: "Ngữ điệu như tiếng Việt",  eg: "Nói đều đều không nhấn trọng âm",  fix: "Content words (noun/verb) được nhấn mạnh, function words đọc nhẹ" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">⚠</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.wrong}</p>
                    <p className="text-xs text-gray-500 italic mb-1">{item.eg}</p>
                    <p className="text-xs text-green-700">✅ {item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ROLE-PLAY ── */}
        {tab === "roleplay" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ROLEPLAY_SCENARIOS.map((s, i) => (
                <button key={s.id} onClick={() => { setActiveScenario(i); setRoleplayHistory([]); setRoleplayMsg(""); }}
                  className={cn("p-3 rounded-xl border text-left transition-all",
                    activeScenario === i ? "bg-brand-50 border-brand-300" : "bg-white border-gray-200 hover:border-gray-300"
                  )}>
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <p className="text-xs font-semibold text-gray-700">{s.title}</p>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", s.level === "B2" ? "bg-orange-100 text-orange-700" : s.level === "B1" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700")}>{s.level}</span>
                </button>
              ))}
            </div>

            <div className="card overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{scenario.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{scenario.title}</p>
                    <p className="text-xs text-gray-500">{scenario.prompt}</p>
                  </div>
                </div>
              </div>

              {/* Chat history */}
              <div className="p-5 space-y-3 min-h-[240px]">
                {roleplayHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-3xl mb-2">🎭</p>
                    <p className="text-sm">Bắt đầu hội thoại bằng cách nhập câu mở đầu gợi ý bên dưới</p>
                    <button onClick={() => setRoleplayMsg(scenario.starter)}
                      className="mt-3 text-xs text-brand-600 underline hover:no-underline">
                      &quot;{scenario.starter}&quot;
                    </button>
                  </div>
                )}
                {roleplayHistory.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "user" ? "bg-brand-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    )}>
                      {msg.text}
                      {msg.role === "ai" && (
                        <button onClick={() => speakText(msg.text)} className="ml-2 text-gray-500 hover:text-gray-700 text-xs">🔊</button>
                      )}
                    </div>
                  </div>
                ))}
                {loadingAI && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4 flex gap-2">
                <input value={roleplayMsg} onChange={e => setRoleplayMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendRoleplay()}
                  placeholder="Nhập tiếng Anh..." className="input-field flex-1 py-2" />
                <button onClick={recording ? stopRecording : startRecording}
                  className={cn("px-3 py-2 rounded-xl text-lg transition-all",
                    recording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 hover:bg-gray-200"
                  )}>
                  🎤
                </button>
                <button onClick={sendRoleplay} disabled={!roleplayMsg.trim() || loadingAI}
                  className="btn-primary px-4 py-2 disabled:opacity-50">
                  Gửi
                </button>
              </div>
            </div>
            {roleplayHistory.length > 0 && (
              <button onClick={() => setRoleplayHistory([])} className="btn-ghost text-sm text-gray-500 w-full justify-center">
                🔄 Bắt đầu lại cuộc hội thoại
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
