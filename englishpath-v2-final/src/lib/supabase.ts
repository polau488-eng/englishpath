import { createClient } from "@supabase/supabase-js";
import type { User, Lesson, UserProgress, SRSCard } from "@/types";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Auth ──────────────────────────────────────────────────────
export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({ provider: "google",
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` } });

export const signInWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUpWithEmail = (email: string, password: string, name: string) =>
  supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });

export const signOut = () => supabase.auth.signOut();

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// ── User profile ──────────────────────────────────────────────
export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
  if (error) return null;
  return data as User;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase.from("users").update(updates).eq("id", userId);
  if (error) throw error;
}

// ── Lessons ───────────────────────────────────────────────────
export async function getLessons(level?: string, skill?: string): Promise<Lesson[]> {
  let query = supabase.from("lessons").select("*").order("lesson_order");
  if (level) query = query.eq("level", level);
  if (skill) query = query.eq("skill", skill);
  const { data, error } = await query;
  if (error) return [];
  return data as Lesson[];
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase.from("lessons").select("*").eq("id", id).single();
  if (error) return null;
  return data as Lesson;
}

// ── Progress ──────────────────────────────────────────────────
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId);
  if (error) return [];
  return data as UserProgress[];
}

export async function saveProgress(userId: string, lessonId: string, score: number, timeSpent: number) {
  const completed = score >= 60;
  const { error } = await supabase.from("user_progress").upsert(
    { user_id: userId, lesson_id: lessonId, completed, score, time_spent: timeSpent,
      completed_at: completed ? new Date().toISOString() : null },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) throw error;
  if (completed) {
    const lesson = await getLessonById(lessonId);
    if (lesson) {
      await supabase.rpc("add_xp", { p_user_id: userId, p_amount: lesson.xp_reward });
      await supabase.rpc("update_streak", { p_user_id: userId });
      await supabase.rpc("check_and_award_badges", { p_user_id: userId });
    }
  }
}

// ── SRS (SM-2 Algorithm) ──────────────────────────────────────
export async function getDueCards(userId: string): Promise<SRSCard[]> {
  const { data } = await supabase.from("srs_cards").select("*").eq("user_id", userId)
    .lte("due_date", new Date().toISOString()).order("due_date").limit(20);
  return (data ?? []) as SRSCard[];
}

export async function getAllCards(userId: string): Promise<SRSCard[]> {
  const { data } = await supabase.from("srs_cards").select("*").eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as SRSCard[];
}

export async function reviewCard(cardId: string, quality: number) {
  const { data: card } = await supabase.from("srs_cards").select("*").eq("id", cardId).single();
  if (!card) return;
  let { ease_factor, interval, repetitions } = card;
  if (quality >= 3) {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * ease_factor);
    repetitions++;
  } else { repetitions = 0; interval = 1; }
  ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const due = new Date(); due.setDate(due.getDate() + interval);
  await supabase.from("srs_cards").update({ ease_factor, interval, repetitions,
    due_date: due.toISOString(), last_quality: quality }).eq("id", cardId);
}

export async function addCard(userId: string, word: Omit<SRSCard, "id"|"user_id"|"interval"|"ease_factor"|"due_date"|"repetitions">) {
  await supabase.from("srs_cards").insert({ user_id: userId, ...word,
    interval: 1, ease_factor: 2.5, due_date: new Date().toISOString(), repetitions: 0 });
}

// ── Writing ───────────────────────────────────────────────────
export async function saveWritingSubmission(userId: string, content: string, promptId: string, level: string, feedback: object, score: number) {
  await supabase.from("writing_submissions").insert({
    user_id: userId, prompt_id: promptId, content,
    word_count: content.trim().split(/\s+/).length,
    ai_feedback: feedback, score, level,
  });
}

export async function getWritingHistory(userId: string) {
  const { data } = await supabase.from("writing_submissions").select("*")
    .eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
  return data ?? [];
}
