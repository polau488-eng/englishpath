"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { LevelBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const VOCAB_MAP: Record<string, { ipa: string; vi: string }> = {
  routine:     { ipa: "/ruːˈtiːn/",     vi: "thói quen hàng ngày" },
  lively:      { ipa: "/ˈlaɪvli/",      vi: "sôi động, náo nhiệt" },
  community:   { ipa: "/kəˈmjuːnɪti/",  vi: "cộng đồng" },
  regularly:   { ipa: "/ˈreɡjələli/",   vi: "thường xuyên, đều đặn" },
  commute:     { ipa: "/kəˈmjuːt/",     vi: "di chuyển đi làm hàng ngày" },
  biodiversity:{ ipa: "/ˌbaɪoʊdaɪˈvɜːrsɪti/", vi: "đa dạng sinh học" },
  emission:    { ipa: "/ɪˈmɪʃən/",      vi: "khí thải" },
  renewable:   { ipa: "/rɪˈnjuːəbəl/",  vi: "tái tạo được" },
  algorithm:   { ipa: "/ˈælɡərɪðəm/",   vi: "thuật toán" },
  accountability:{ ipa: "/əˌkaʊntəˈbɪlɪti/", vi: "trách nhiệm giải trình" },
};

const ARTICLES = [
  {
    id: "r1", level: "A1" as const, title: "My Family", wordCount: 65, readTime: "1 min",
    text: `My name is Linh. I have a small family. There are four people in my family: my father, my mother, my sister, and me.\n\nMy father is a teacher. He teaches math at a high school. My mother works at a hospital. She is a nurse.\n\nMy sister is ten years old. She likes drawing and reading books. I am fifteen years old. I love playing soccer with my friends after school.`,
    questions: [
      { q: "How many people are in Linh's family?", opts: ["Three", "Four", "Five", "Six"], correct: 1 },
      { q: "What does Linh's father do?", opts: ["He is a doctor", "He is a teacher", "He is a nurse", "He is a student"], correct: 1 },
      { q: "How old is Linh's sister?", opts: ["Eight", "Ten", "Twelve", "Fifteen"], correct: 1 },
      { q: "What does Linh love doing?", opts: ["Drawing", "Reading", "Cooking", "Playing soccer"], correct: 3 },
    ],
    vocabulary: ["father", "mother", "sister", "teacher", "nurse"],
  },
  {
    id: "r2", level: "A2" as const, title: "My Neighborhood", wordCount: 145, readTime: "2 min",
    text: `I live in a small but lively neighborhood in the city center. There is a park near my house where people walk their dogs every morning. Next to the park, there is a farmers' market that opens every Saturday. I love buying fresh vegetables and homemade bread there.\n\nMy street is quiet during the week but gets quite busy on weekends. There are several small cafés and a library that I visit regularly. The best thing about my neighborhood is the sense of community — everyone knows each other, and people always say hello when they pass on the street.\n\nLast year, the community organized a festival in the park. Over five hundred people attended, and there was music, food, and games for children. It was one of the best days I can remember.`,
    questions: [
      { q: "When does the farmers' market open?", opts: ["Every day", "Every Saturday", "Every Sunday", "Every weekend"], correct: 1 },
      { q: "What does the writer like buying at the market?", opts: ["Meat and fish", "Cakes and sweets", "Fresh vegetables and bread", "Clothes and accessories"], correct: 2 },
      { q: "According to the writer, what is the BEST thing about their neighborhood?", opts: ["The park", "The cafés", "The sense of community", "The library"], correct: 2 },
      { q: "How many people attended the community festival?", opts: ["Over 100", "Over 200", "Over 500", "Over 1000"], correct: 2 },
    ],
    vocabulary: ["lively", "community", "regularly", "neighborhood"],
  },
  {
    id: "r3", level: "B1" as const, title: "The Benefits of Remote Work", wordCount: 280, readTime: "4 min",
    text: `Remote work, once considered a perk for a select few, has become mainstream following the global pandemic. Millions of workers now spend at least part of their working week at home, and many companies are reconsidering their office-first policies.\n\nProponents of remote work argue that it offers significant benefits. Employees save time and money on commuting, which can amount to several hours and hundreds of dollars each month. Without the distractions of a busy office, many workers report higher productivity and better focus.\n\nFurthermore, remote work allows people to achieve a healthier work-life balance. Parents can be more present for their children, and employees can exercise during the day or cook nutritious meals instead of relying on fast food.\n\nHowever, critics point to real drawbacks. Isolation and loneliness are common complaints among remote workers. Collaboration suffers when team members cannot interact face-to-face, and junior employees may miss out on the informal mentoring that happens naturally in an office environment.\n\nUltimately, a hybrid model — combining remote and in-office work — appears to be the preferred solution for both employers and employees. This approach balances flexibility with the social and collaborative benefits of a shared workspace.`,
    questions: [
      { q: "Remote work became mainstream mainly because of:", opts: ["New technology", "Government policy", "The global pandemic", "Employee demands"], correct: 2 },
      { q: "Which is NOT mentioned as a benefit of remote work?", opts: ["Saving commute time", "Higher productivity", "Better pay", "Healthier work-life balance"], correct: 2 },
      { q: "What concern do critics raise about remote work?", opts: ["Higher costs", "Isolation and loneliness", "Less technology", "Longer hours"], correct: 1 },
      { q: "What solution does the passage suggest?", opts: ["Full remote work", "Full office work", "A hybrid model", "Shorter working weeks"], correct: 2 },
    ],
    vocabulary: ["commute", "productivity", "collaboration", "hybrid"],
  },
  {
    id: "r4", level: "B2" as const, title: "AI Ethics: The Accountability Gap", wordCount: 340, readTime: "5 min",
    text: `Artificial intelligence systems are making increasingly consequential decisions — from approving loan applications to informing medical diagnoses and even influencing criminal sentencing. Yet a troubling gap exists between the speed of AI deployment and the development of adequate frameworks for accountability.\n\nThe core problem is algorithmic opacity. Many sophisticated AI models, particularly deep learning systems, operate as "black boxes." Even their creators cannot fully explain why the system reaches specific conclusions. This opacity creates serious problems when outcomes are discriminatory or harmful.\n\nConsider lending algorithms. Research has demonstrated that some AI systems used by financial institutions perpetuate historical biases, denying loans to creditworthy applicants from minority groups at higher rates than to comparable white applicants. When challenged, neither the bank nor the algorithm's developers can provide a satisfactory explanation.\n\nRegulators are beginning to respond. The European Union's AI Act, introduced in 2021, categorizes AI applications by risk level and imposes strict requirements on high-risk systems, including transparency obligations and mandatory human oversight. Similar legislation is being debated in other jurisdictions.\n\nCritics argue that regulation alone is insufficient. They call for "algorithmic auditing" — independent assessment of AI systems for fairness and bias before deployment. Others advocate for greater diversity in AI development teams, on the grounds that homogeneous teams are less likely to identify potential harms affecting underrepresented groups.\n\nThe challenge ahead is clear: harnessing the extraordinary potential of AI while building the institutional frameworks necessary to ensure that its benefits are distributed equitably and its harms are minimized.`,
    questions: [
      { q: "The 'black box' problem refers to:", opts: ["AI being expensive", "AI decisions being inexplicable", "AI systems being offline", "AI being too slow"], correct: 1 },
      { q: "What problem was found in lending algorithms?", opts: ["They were too slow", "They perpetuated historical biases", "They were too expensive", "They required too much data"], correct: 1 },
      { q: "The EU AI Act was introduced in:", opts: ["2019", "2020", "2021", "2022"], correct: 2 },
      { q: "What do critics say about regulation?", opts: ["It is very effective", "It is unnecessary", "It is insufficient alone", "It should be abandoned"], correct: 2 },
    ],
    vocabulary: ["algorithm", "accountability", "opacity", "bias"],
  },
];

export default function ReadingPage() {
  const [activeArticle, setActiveArticle] = useState(0);
  const [selectedWord, setSelectedWord] = useState<{ word: string; data: { ipa: string; vi: string } } | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [highlights, setHighlights] = useState<Set<string>>(new Set());

  const article = ARTICLES[activeArticle];
  const correctCount = submitted ? article.questions.filter((q, i) => answers[i] === q.correct).length : 0;

  function handleWordClick(word: string) {
    const clean = word.toLowerCase().replace(/[^a-z]/g, "");
    const data = VOCAB_MAP[clean];
    if (data) setSelectedWord({ word: clean, data });
    else setSelectedWord(null);
  }

  function toggleHighlight(word: string) {
    setHighlights(h => { const n = new Set(h); n.has(word) ? n.delete(word) : n.add(word); return n; });
  }

  function reset() { setAnswers({}); setSubmitted(false); }

  function renderText(text: string) {
    return text.split("\n\n").map((para, pi) => (
      <p key={pi} className="mb-4 leading-relaxed text-gray-800">
        {para.split(" ").map((word, wi) => {
          const clean = word.toLowerCase().replace(/[^a-z]/g, "");
          const hasVocab = !!VOCAB_MAP[clean];
          const isHighlighted = highlights.has(word);
          return (
            <span key={wi}>
              <span
                onClick={() => { handleWordClick(word); toggleHighlight(word); }}
                className={cn("cursor-pointer rounded px-0.5 transition-all select-text",
                  isHighlighted ? "bg-yellow-200" : hasVocab ? "hover:bg-blue-100 hover:text-blue-700" : "hover:bg-gray-100"
                )}
                title={hasVocab ? "Click để xem nghĩa" : undefined}>
                {word}
              </span>{" "}
            </span>
          );
        })}
      </p>
    ));
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Kỹ năng Đọc" subtitle="Click vào từ bất kỳ để tra nghĩa ngay · True/False/Not Given · Skimming & Scanning" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">

        {/* Article selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {ARTICLES.map((a, i) => (
            <button key={a.id} onClick={() => { setActiveArticle(i); reset(); setSelectedWord(null); setHighlights(new Set()); }}
              className={cn("p-3 rounded-xl border text-left transition-all",
                activeArticle === i ? "bg-emerald-50 border-emerald-300" : "bg-white border-gray-200 hover:border-gray-300"
              )}>
              <LevelBadge level={a.level} />
              <p className="text-xs font-semibold text-gray-800 mt-1 leading-tight">{a.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.wordCount} từ · {a.readTime}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Article */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{article.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <LevelBadge level={article.level} />
                    <span className="text-xs text-gray-400">{article.wordCount} words · {article.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm lg:text-base">
                {renderText(article.text)}
              </div>
              <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
                💡 Click vào từ để tra nghĩa · Từ được gạch chân nhẹ có trong từ điển · Màu vàng = đã highlight
              </p>
            </div>

            {/* Questions */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Câu hỏi đọc hiểu</h3>
                {submitted && (
                  <span className={cn("font-bold text-sm", correctCount === article.questions.length ? "text-green-600" : "text-amber-600")}>
                    {correctCount}/{article.questions.length} đúng
                  </span>
                )}
              </div>
              {submitted && <div className="mb-4"><Progress value={correctCount} max={article.questions.length} barClassName={correctCount >= article.questions.length * 0.75 ? "bg-green-500" : "bg-amber-500"} /></div>}

              <div className="space-y-4">
                {article.questions.map((q, qi) => (
                  <div key={qi}>
                    <p className="font-medium text-gray-900 text-sm mb-2">{qi + 1}. {q.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.opts.map((opt, oi) => {
                        const picked = answers[qi] === oi;
                        const isRight = oi === q.correct;
                        return (
                          <button key={oi} disabled={submitted}
                            onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                            className={cn("text-left px-3 py-2 rounded-xl border text-sm transition-all",
                              submitted ? isRight ? "bg-green-50 border-green-300 text-green-800"
                                : picked ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                                : picked ? "bg-brand-50 border-brand-400 text-brand-800"
                                : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                            )}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                            {submitted && isRight && " ✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                {!submitted ? (
                  <button disabled={Object.keys(answers).length < article.questions.length}
                    onClick={() => setSubmitted(true)}
                    className="btn-primary flex-1 justify-center disabled:opacity-50">
                    Nộp bài ({Object.keys(answers).length}/{article.questions.length})
                  </button>
                ) : (
                  <>
                    <button onClick={reset} className="btn-secondary flex-1 justify-center">Làm lại</button>
                    <button onClick={() => { setActiveArticle(a => (a + 1) % ARTICLES.length); reset(); setSelectedWord(null); setHighlights(new Set()); }}
                      className="btn-primary flex-1 justify-center">Bài tiếp →</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right panel — vocab lookup + tips */}
          <div className="space-y-5">
            {/* Word lookup */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Tra từ</p>
              {selectedWord ? (
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-0.5">{selectedWord.word}</p>
                  <p className="text-sm font-mono text-gray-500 mb-2">{selectedWord.data.ipa}</p>
                  <p className="text-brand-700 font-medium">{selectedWord.data.vi}</p>
                  <button onClick={() => {
                    const u = new SpeechSynthesisUtterance(selectedWord.word);
                    u.lang = "en-US";
                    window.speechSynthesis?.speak(u);
                  }} className="mt-3 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    🔊 Nghe phát âm
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-3xl mb-2">👆</p>
                  <p className="text-sm">Click vào từ trong bài để tra nghĩa</p>
                </div>
              )}
            </div>

            {/* Key vocab */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Từ vựng chính</p>
              <div className="space-y-2">
                {article.vocabulary.map(w => {
                  const data = VOCAB_MAP[w.toLowerCase()];
                  return (
                    <button key={w} onClick={() => data && setSelectedWord({ word: w, data })}
                      className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-brand-50 transition-all group">
                      <span className="font-medium text-gray-800 text-sm group-hover:text-brand-700">{w}</span>
                      {data && <span className="text-xs text-gray-400 ml-2">{data.vi}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading strategies */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Kỹ thuật đọc</p>
              <div className="space-y-3 text-xs text-gray-600">
                <div><p className="font-semibold text-gray-700">Skimming</p><p>Đọc nhanh tiêu đề, câu mở đầu mỗi đoạn để nắm ý chính trong 30 giây.</p></div>
                <div><p className="font-semibold text-gray-700">Scanning</p><p>Tìm kiếm thông tin cụ thể (con số, tên riêng) mà không cần đọc toàn bộ.</p></div>
                <div><p className="font-semibold text-gray-700">True/False/Not Given</p><p>Not Given = bài không đề cập, khác với False (bài phủ nhận trực tiếp).</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
