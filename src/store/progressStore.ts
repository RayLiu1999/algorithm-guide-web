import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProblemStatus } from '../data/index';

export const createProgressKey = (categoryId: string, problemId: string) => `${categoryId}:${problemId}`;

interface ProgressState {
  // 紀錄每題 (Key = 題號字串) 的學習狀態
  progress: Record<string, ProblemStatus>;
  // 書籤清單
  bookmarks: string[];

  // 讀取某題的狀態，若尚未設定則回傳 not_started
  getStatus: (problemKey: string) => ProblemStatus;
  // 設定某題的狀態
  setStatus: (problemKey: string, status: ProblemStatus) => void;
  // 切換書籤 (加入或移除)
  toggleBookmark: (problemKey: string) => void;
  // 判斷某題是否已加入書籤
  isBookmarked: (problemKey: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      bookmarks: [],

      getStatus: (problemKey) => {
        return get().progress[problemKey] ?? 'not_started';
      },

      setStatus: (problemKey, status) => {
        set((state) => ({
          progress: { ...state.progress, [problemKey]: status },
        }));
      },

      toggleBookmark: (problemKey) => {
        set((state) => {
          const isAlreadyBookmarked = state.bookmarks.includes(problemKey);
          return {
            bookmarks: isAlreadyBookmarked
              ? state.bookmarks.filter((id) => id !== problemKey)
              : [...state.bookmarks, problemKey],
          };
        });
      },

      isBookmarked: (problemKey) => {
        return get().bookmarks.includes(problemKey);
      },
    }),
    {
      // 將狀態持久化至 localStorage，使用者的進度不會因重新整理而消失
      name: 'algorithm-guide-progress',
    }
  )
);
