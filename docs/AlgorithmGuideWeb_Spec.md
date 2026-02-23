# AlgorithmGuide Web Application 規格與開發計畫

## 專案目標

將現有的 Markdown 演算法教學文件轉化為互動式 React 網站，加入學習進度追蹤、狀態管理、Flashcard 記憶模式等功能，並透過 TDD (Test-Driven Development) 開發模式確保程式碼品質。

## 一、技術選型

- **前端框架**: React 18 + Vite
- **路由**: React Router v6
- **狀態管理**: Zustand
- **樣式**: Tailwind CSS
- **Markdown 解析**: `react-markdown` + `rehype-highlight`
- **測試框架**: Vitest + React Testing Library (RTL)

## 二、功能規格 (Features)

### 1. 教材瀏覽與解析

- **目錄導覽**: 列出 15 大分類及所有題目。
- **Markdown 渲染**: 正確解析原始 `.md` 檔案，包含自訂的 `💡 白話文解說`、`套路` 等區塊。

### 2. 學習進度追蹤

- **狀態標記**: 每一題可手動標記狀態：`未開始`、`練習中`、`已掌握`。
- **資料持久化**: 學習紀錄存儲於瀏覽器的 `localStorage`。
- **進度儀表板**: 顯示整體完成度及各分類的掌握比例。

### 3. 專屬學習模式

- **Flashcard 模式**:
  - 隱藏題目的「核心思路」與「Python 程式碼」。
  - 僅顯示「題目名稱」與「白話文解說」。
  - 提供「顯示解答」的翻牌按鈕。

## 三、TDD 開發流程與測試計畫

採用 TDD (Red-Green-Refactor) 的方式疊代，並以**整合測試**為主。

## 四、Agent Skills 與 Workflows

- 專案專屬 Skill 位於 `.agent/skills/react-tdd-dev/SKILL.md`
- TDD 元件開發 Workflow 位於 `.agent/workflows/tdd-react-component.md`
