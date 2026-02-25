// 演算法分類資料索引
// 每個分類對應 public/data/ 底下的 Markdown 檔案

export type ProblemStatus = 'not_started' | 'in_progress' | 'mastered';

export interface Category {
  id: string;         // 唯一識別碼 (對應 URL slug)
  number: number;     // 分類序號
  title: string;      // 中文標題
  subtitle: string;   // 英文副標
  file: string;       // 對應的 markdown 檔案名稱
  count: number;      // 題數
}

// 16 個分類的索引資料
export const CATEGORIES: Category[] = [
  { id: 'array-hashing', number: 1, title: '陣列與雜湊表', subtitle: 'Array & Hashing', file: '01_Array_Hashing.md', count: 24 },
  { id: 'two-pointers', number: 2, title: '雙指標', subtitle: 'Two Pointers', file: '02_Two_Pointers.md', count: 9 },
  { id: 'sliding-window', number: 3, title: '滑動窗口', subtitle: 'Sliding Window', file: '03_Sliding_Window.md', count: 6 },
  { id: 'stack', number: 4, title: '堆疊', subtitle: 'Stack', file: '04_Stack.md', count: 13 },
  { id: 'binary-search', number: 5, title: '二分搜尋', subtitle: 'Binary Search', file: '05_Binary_Search.md', count: 9 },
  { id: 'linked-list', number: 6, title: '鏈結串列', subtitle: 'Linked List', file: '06_Linked_List.md', count: 15 },
  { id: 'tree', number: 7, title: '二元樹', subtitle: 'Tree', file: '07_Tree.md', count: 24 },
  { id: 'heap', number: 8, title: '堆積', subtitle: 'Heap / Priority Queue', file: '08_Heap.md', count: 8 },
  { id: 'backtracking', number: 9, title: '回溯法', subtitle: 'Backtracking', file: '09_Backtracking.md', count: 8 },
  { id: 'graph', number: 10, title: '圖論', subtitle: 'Graph', file: '10_Graph.md', count: 17 },
  { id: 'dynamic-programming', number: 11, title: '動態規劃', subtitle: 'Dynamic Programming', file: '11_Dynamic_Programming.md', count: 15 },
  { id: 'greedy', number: 12, title: '貪心法', subtitle: 'Greedy', file: '12_Greedy.md', count: 3 },
  { id: 'intervals', number: 13, title: '區間問題', subtitle: 'Intervals', file: '13_Intervals.md', count: 3 },
  { id: 'bit-manipulation', number: 14, title: '位元運算', subtitle: 'Bit Manipulation', file: '14_Bit_Manipulation.md', count: 5 },
  { id: 'design', number: 15, title: '設計題', subtitle: 'Design', file: '15_Design.md', count: 5 },
  { id: 'appendix', number: 16, title: '附錄', subtitle: 'Appendix', file: '16_Appendix.md', count: 5 },
];

// 總題數
export const TOTAL_PROBLEMS = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

// 根據 id 查詢分類
export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
