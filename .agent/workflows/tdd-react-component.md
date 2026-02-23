---
description: [TDD 的標準步驟，開發新 React 元件時的使用工作流]
---

# 開發 React 元件的 TDD 工作流程

在 `AlgorithmGuideWeb` 專案中，我們強制使用 TDD 模式開發功能與 UI 元件。請嚴格遵循以下步驟。

## 步驟 (Steps)

1. **定義規格與確認需求**
   - 釐清目前要開發的元件名稱與所需 Props。
   - 確認該元件在畫面上預期呈現的內容及使用者互動行為。

// turbo 2. **建立測試檔案 (Red)**

- 在 `src/components/__tests__/` (或對應資料夾下) 建立 `[ComponentName].test.tsx`。
- 寫入基本測試案例 (例如：元件能被渲染、特定字樣存在、按鈕點擊事件觸發等)。

// turbo-all 3. **執行測試確保失敗 (Red)**

- 執行指令：`npm run test run src/components/__tests__/[ComponentName].test.tsx`
- 觀察錯誤訊息，確保測試是因為缺少該元件或功能失敗。

4. **實作最基本功能的元件 (Green)**
   - 在對應資料夾建立 `[ComponentName].tsx`。
   - 寫出「剛好能讓測試通過」的最少程式碼。

// turbo-all 5. **再次執行測試確保通過 (Green)**

- 重新執行測試指令確保剛寫的測試圈選轉為綠燈。

6. **重構與優化樣式 (Refactor)**
   - 加入 Tailwind CSS 類別美化元件，每次存檔後確保測試維持通過。
   - **記得進行 git commit 保留變更！**
