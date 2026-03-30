# Algorithm Mastery (AlgorithmGuideWeb)

系統化征服 LeetCode。涵蓋 Grind 75 與 Grind 169 的精選題型，透過高質感的圖文解說與閃卡複習，建立堅實的演算法直覺。

## 🌟 專案簡介 (Introduction)

這是一個基於 React + Vite + TypeScript 打造的演算法刷題學習平台。擺脫傳統沉悶的刷題清單，本專案致力於提供最流暢、最現代化的學習體驗：從視覺化的進度追蹤，到互動式的翻轉閃卡，幫助開發者有效率地準備技術面試。

## ✨ 主要功能 (Features)

- **總覽儀表板 (Dashboard)**: 視覺化追蹤整體學習進度、各單元的掌握程度 (Mastered) 與狀態分佈。
- **互動式 Markdown 學習區**: 支援語法高亮 (Syntax Highlighting) 與段落錨點的高質感 Markdown 閱讀器，深入淺出解析每一道題目的底層邏輯。
- **閃卡複習系統 (Flashcards)**: 結合提示與解題思路的翻轉式卡片，支援「未開始」、「複習中」、「已掌握」等狀態評估與切換。
- **進度持久化 (Persistence)**: 基於 Zustand 與 LocalStorage，使用者的所有學習記錄與進度都會自動在本地保存，不怕重整流失。
- **全端響應式介面 (Responsive Design)**: 完美支援手機、平板與桌面裝置的使用體驗，針對行動裝置特別優化了側邊欄與漢堡選單 (Hamburger Menu) 動畫。

## 🛠️ 技術棧 (Tech Stack)

- **前端框架**: React 19 + TypeScript
- **建置工具**: Vite
- **UI 與樣式**: Tailwind CSS (v4)
- **動畫系統**: Framer Motion
- **圖示庫**: Lucide React
- **狀態管理**: Zustand + Persist Middleware
- **路由管理**: React Router DOM (v7)
- **Markdown 處理**: `react-markdown`, `rehype-highlight`, `rehype-slug`

## 🚀 本地開發與部署 (Getting Started)

### 前置作業
請確認您的環境已安裝 Node.js (建議版本 18 以上) 與 npm。

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 編譯 production 檔案
```bash
npm run build
```

## 📁 專案架構概覽 (Project Structure)

- `src/components/`: 可複用的 UI 元件 (FlashCard, Sidebar, MarkdownViewer 等)
- `src/pages/`: 頁面級別元件 (Dashboard, Category, Flashcard 頁面)
- `src/store/`: Zustand 全域狀態中心 (包含 UI State 與 Progress State)
- `src/data/`: 題庫與章節對應的靜態資料結構
- `src/utils/`: 共用工具函式 (如：將 Markdown 自動轉換為閃卡格式的 Parser)
- `public/data/`: 存放各章節真實的 Markdown 教材內容

## 🐳 Docker Deployment

如果您希望使用 Docker 進行容器化部署，可以利用專案內附的 `Dockerfile` 與 `docker-compose.yml`：

```bash
# 啟動並建立服務
docker compose up -d --build
```
