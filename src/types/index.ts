export type Level = "A1" | "A2" | "B1" | "B2";
export type Skill = "listening" | "speaking" | "reading" | "writing" | "grammar";
export type LessonStatus = "locked" | "available" | "in_progress" | "completed";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  current_level: Level;
  xp: number;
  streak: number;
  streak_shield: number;
  created_at: string;
  last_active: string;
  is_premium: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: Level;
  skill: Skill;
  duration_minutes: number;
  xp_reward: number;
  order: number;
  status: LessonStatus;
  thumbnail?: string;
  audio_url?: string;
  content: LessonContent;
}

export interface LessonContent {
  intro?: string;
  sections: LessonSection[];
  vocabulary?: VocabWord[];
  grammar_note?: GrammarNote;
}

export interface LessonSection {
  type: "text" | "audio" | "video" | "exercise";
  content: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type: "multiple_choice" | "fill_blank" | "true_false" | "reorder" | "matching";
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation: string;
  hint?: string;
}

export interface VocabWord {
  word: string;
  ipa: string;
  meaning_vi: string;
  example: string;
  audio_url?: string;
}

export interface GrammarNote {
  point: string;
  explanation: string;
  examples: string[];
  common_mistakes: string[];
}

export interface UserProgress {
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  time_spent: number;
  completed_at?: string;
}

export interface SRSCard {
  id: string;
  user_id: string;
  word: string;
  ipa: string;
  meaning_vi: string;
  example: string;
  interval: number;
  ease_factor: number;
  due_date: string;
  repetitions: number;
}

export interface DashboardStats {
  total_xp: number;
  current_streak: number;
  lessons_completed: number;
  words_learned: number;
  weekly_progress: WeeklyProgress[];
  skill_breakdown: SkillBreakdown[];
  recent_lessons: RecentLesson[];
  badges: Badge[];
  level_progress: LevelProgress;
}

export interface WeeklyProgress {
  day: string;
  xp: number;
  lessons: number;
}

export interface SkillBreakdown {
  skill: Skill;
  score: number;
  total: number;
}

export interface RecentLesson {
  id: string;
  title: string;
  skill: Skill;
  level: Level;
  completed_at: string;
  score: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export interface LevelProgress {
  level: Level;
  lessons_completed: number;
  lessons_total: number;
  percentage: number;
}

export interface PlacementQuestion {
  id: number;
  skill: Skill;
  level: Level;
  question: string;
  options: string[];
  correct: number;
  audio_url?: string;
}
