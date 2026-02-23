import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProblemStatus } from '../data/index';

interface ProgressState {
  // 紀錄每題 (Key = 題號字串) 的學習狀態
  progress: Record<string, ProblemStatus>;
  // 書籤清單
  bookmarks: string[];

  // 讀取某題的狀態，若尚未設定則回傳 not_started
  getStatus: (problemId: string) => ProblemStatus;
  // 設定某題的狀態
  setStatus: (problemId: string, status: ProblemStatus) => void;
  // 切換書籤 (加入或移除)
  toggleBookmark: (problemId: string) => void;
  // 判斷某題是否已加入書籤
  isBookmarked: (problemId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      bookmarks: [],

      getStatus: (problemId) => {
        return get().progress[problemId] ?? 'not_started';
      },

      setStatus: (problemId, status) => {
        set((state) => ({
          progress: { ...state.progress, [problemId]: status },
        }));
      },

      toggleBookmark: (problemId) => {
        set((state) => {
          const isAlreadyBookmarked = state.bookmarks.includes(problemId);
          return {
            bookmarks: isAlreadyBookmarked
              ? state.bookmarks.filter((id) => id !== problemId)
              : [...state.bookmarks, problemId],
          };
        });
      },

      isBookmarked: (problemId) => {
        return get().bookmarks.includes(problemId);
      },
    }),
    {
      // 將狀態持久化至 localStorage，使用者的進度不會因重新整理而消失
      name: 'algorithm-guide-progress',
    }
  )
);
