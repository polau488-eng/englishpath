import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, lessonId, score, timeSpent } = await req.json();
    if (!userId || !lessonId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const completed = score >= 60;

    // Upsert progress
    const { error: progressError } = await supabase.from("user_progress").upsert(
      { user_id: userId, lesson_id: lessonId, completed, score, time_spent: timeSpent,
        completed_at: completed ? new Date().toISOString() : null, attempts: 1 },
      { onConflict: "user_id,lesson_id" }
    );
    if (progressError) throw progressError;

    let xpGained = 0;
    let newStreak = 0;

    if (completed) {
      const { data: lesson } = await supabase.from("lessons").select("xp_reward").eq("id", lessonId).single();
      if (lesson) {
        xpGained = lesson.xp_reward;
        const { data: newXp } = await supabase.rpc("add_xp", { p_user_id: userId, p_amount: xpGained });
        const { data: streak } = await supabase.rpc("update_streak", { p_user_id: userId });
        await supabase.rpc("check_and_award_badges", { p_user_id: userId });
        newStreak = streak ?? 0;
      }
    }

    return NextResponse.json({ success: true, completed, xpGained, newStreak });
  } catch (err) {
    console.error("Progress API:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
