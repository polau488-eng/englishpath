"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Lesson } from "@/types";
import { MOCK_USER } from "./mock-data";

interface AppState {
  user: User | null;
  currentLesson: Lesson | null;
  lessonProgress: Record<string, { score: number; completed: boolean }>;
  sidebarOpen: boolean;

  setUser: (user: User | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  saveLessonResult: (lessonId: string, score: number) => void;
  addXP: (amount: number) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      currentLesson: null,
      lessonProgress: {},
      sidebarOpen: true,

      setUser: (user) => set({ user }),
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

      saveLessonResult: (lessonId, score) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: { score, completed: score >= 60 },
          },
        })),

      addXP: (amount) =>
        set((state) => ({
          user: state.user ? { ...state.user, xp: state.user.xp + amount } : null,
        })),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: "english-app-store", partialize: (s) => ({ user: s.user, lessonProgress: s.lessonProgress }) }
  )
);
