import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, (level: string) => string> = {
  writing_coach: (level) => `Bạn là giáo viên tiếng Anh chuyên nghiệp dạy người Việt, chuyên chữa bài viết.
Khi nhận bài viết tiếng Anh, hãy trả lời theo cấu trúc sau:

**1. Điểm mạnh**
- Liệt kê 2-3 điểm tốt trong bài

**2. Lỗi sai và cách sửa**
- Mỗi lỗi: ❌ câu sai → ✅ câu đúng + giải thích ngắn bằng tiếng Việt

**3. Gợi ý cải thiện**
- 2-3 gợi ý cụ thể để nâng cao chất lượng bài

**4. Điểm tổng: X/10**
Nhận xét tổng thể ngắn gọn (1-2 câu).

Cấp độ học viên: ${level}. Giải thích ngắn gọn, dễ hiểu. Phản hồi bằng tiếng Việt.`,

  tutor: (level) => `Bạn là gia sư tiếng Anh thân thiện và kiên nhẫn, dạy người Việt.
Khi trả lời câu hỏi về tiếng Anh:
1. Giải thích ngắn gọn, rõ ràng
2. Đưa ra 2-3 ví dụ thực tế, dễ nhớ
3. So sánh với tiếng Việt nếu có thể để dễ hiểu hơn
4. Chỉ rõ lỗi phổ biến của người Việt với chủ đề này
Cấp độ: ${level}. Trả lời bằng tiếng Việt. Thân thiện, khích lệ.`,

  roleplay: (level) => `Bạn đang đóng vai trong một tình huống hội thoại tiếng Anh để giúp người Việt luyện nói.
Quy tắc:
- Trả lời bằng tiếng Anh tự nhiên, phù hợp với cấp độ ${level}
- Giữ phong cách của nhân vật trong tình huống
- Câu trả lời ngắn gọn (1-3 câu), tự nhiên như hội thoại thật
- Nếu học viên mắc lỗi nghiêm trọng, nhẹ nhàng sửa: [Correction: ...]
- Không giải thích dài dòng, tiếp tục hội thoại tự nhiên`,

  pronunciation: (_level) => `Bạn là chuyên gia phát âm tiếng Anh, chuyên giúp người Việt cải thiện pronunciation.
Khi phân tích phát âm:
1. Chỉ ra âm cụ thể có thể bị sai
2. Giải thích cách phát âm đúng (kèm IPA)
3. Nêu lỗi đặc trưng của người Việt với âm này
4. Gợi ý bài tập thực hành cụ thể
Trả lời ngắn gọn, thực tế, bằng tiếng Việt.`,
};

function getDemoFeedback(mode: string): string {
  if (mode === "writing_coach") return `**1. Điểm mạnh**
- Bài viết có cấu trúc rõ ràng với mở-thân-kết
- Sử dụng từ vựng phù hợp với cấp độ
- Ý tưởng được trình bày có logic

**2. Lỗi sai và cách sửa**
- ❌ I very like this place → ✅ I really like this place (không dùng "very + verb")
- ❌ She don't know → ✅ She doesn't know (he/she/it dùng "doesn't")
- ❌ I am go to school → ✅ I go to school (không dùng "am + V nguyên thể")

**3. Gợi ý cải thiện**
- Thêm ví dụ cụ thể để bài sinh động hơn
- Sử dụng thêm adjectives để mô tả chi tiết
- Kết bài nên có 1 câu tổng kết ý chính

**4. Điểm tổng: 7/10**
Bài viết tốt cho cấp độ A2. Tiếp tục luyện tập về thì và cách dùng từ nối.

*⚠️ Demo mode — thêm ANTHROPIC_API_KEY vào .env.local để nhận phản hồi thật từ Claude AI.*`;
  if (mode === "roleplay") return "Hello! How can I help you today? (Demo mode — add ANTHROPIC_API_KEY for real AI conversation)";
  return "Cảm ơn câu hỏi! Thêm ANTHROPIC_API_KEY vào .env.local để nhận giải thích chi tiết từ Claude AI.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = "tutor", content, level = "A2" } = body;

    if (!content || typeof content !== "string")
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (content.length > 5000)
      return NextResponse.json({ error: "Content too long (max 5000 chars)" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey)
      return NextResponse.json({ result: getDemoFeedback(mode), demo: true });

    const systemPrompt = (SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.tutor)(level);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
      return NextResponse.json({ error: err.error?.message ?? `API error ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const text = (data.content?.[0]?.text ?? "") as string;
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
