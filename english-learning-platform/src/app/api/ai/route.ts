import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mode, content, level } = await req.json();

    const systemPrompts: Record<string, string> = {
      writing_coach: `Bạn là giáo viên tiếng Anh chuyên nghiệp dạy người Việt. 
Khi nhận được bài viết tiếng Anh, hãy:
1. Chỉ ra LỖI SAI cụ thể (ngữ pháp, từ vựng, cấu trúc)
2. Đưa ra BẢN SỬA cho từng lỗi
3. Giải thích LÝ DO bằng tiếng Việt ngắn gọn
4. Cho điểm tổng thể 1-10 kèm nhận xét
5. Gợi ý 1-2 cải thiện quan trọng nhất
Cấp độ học viên: ${level ?? "A2"}. Phản hồi bằng tiếng Việt.`,

      tutor: `Bạn là gia sư tiếng Anh thân thiện dạy người Việt. 
Trả lời câu hỏi về tiếng Anh một cách rõ ràng, kèm ví dụ thực tế.
Luôn so sánh với tiếng Việt khi giải thích ngữ pháp để học viên dễ hiểu.
Cấp độ học viên: ${level ?? "A2"}. Ngắn gọn, dễ hiểu.`,

      pronunciation: `Phân tích phát âm tiếng Anh của người Việt.
Chỉ ra: 1) Âm cụ thể bị sai, 2) Cách phát âm đúng (kèm IPA), 3) Lỗi phổ biến của người Việt với âm này.`,
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompts[mode] ?? systemPrompts.tutor,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message ?? "API error" }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
