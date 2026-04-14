import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getLessons(level?: string, skill?: string) {
  let query = supabase.from("lessons").select("*").order("order");
  if (level) query = query.eq("level", level);
  if (skill) query = query.eq("skill", skill);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function saveProgress(userId: string, lessonId: string, score: number, timeSpent: number) {
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    lesson_id: lessonId,
    completed: score >= 60,
    score,
    time_spent: timeSpent,
    completed_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  const { error } = await supabase.rpc("increment_xp", { user_id: userId, amount: xpToAdd });
  if (error) throw error;
}

export async function getSRSCards(userId: string) {
  const { data, error } = await supabase
    .from("srs_cards")
    .select("*")
    .eq("user_id", userId)
    .lte("due_date", new Date().toISOString())
    .order("due_date")
    .limit(20);
  if (error) throw error;
  return data;
}
