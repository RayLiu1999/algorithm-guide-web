---
name: AlgorithmGuide React TDD Development
description: AlgorithmGuideWeb 專案專屬的 React TDD 開發指引，涵蓋技術要求與元件測試規範。
---

# AlgorithmGuideWeb 專屬開發準則

本專案將由原來的 Markdown 教材轉換為互動式 React 網站，作為 AI 助理在此專案協作時，需嚴格遵守以下準則。

## 1. 開發流程準則 (TDD)

- 在加入任何新功能或元件之前，**必須優先建立測試檔** (位於 `__tests__` 目錄下)。
- 使用 React Testing Library 撰寫預期行為，確認跑出錯誤 (Red) 後，才進行程式實作。
- 只實作能讓測試綠燈 (Green) 的最少程式碼，後續再透過測試保護網進行樣式重構 (Refactor)。

## 2. 工具限制

- 強制使用 `vitest` 以及 `@testing-library/react`。
- 測試 DOM 查詢應站在使用者的視角（優先使用 `getByRole`, `findByText` 等）。
- 樣式開發請使用 **Tailwind CSS**。

## 3. Git 操作準則

- 在完成每一個 TDD 循環、建立新元件或重構功能後，**應該主動或提醒使用者執行 git commit** 確保階段性任務保留。
- Commit 訊息應清楚描述加入的元件或重構的測試案例。
