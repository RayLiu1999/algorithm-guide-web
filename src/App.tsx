import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage";
import FlashcardPage from "./pages/FlashcardPage";
import { useUiStore } from "./store/uiStore";

function App() {
  const location = useLocation();
  const { toggleMobileMenu, isMobileMenuOpen } = useUiStore();
  const showMenuButton = !location.pathname.startsWith('/flashcard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* 頂部導航列：使用玻璃擬態 (Glassmorphism) */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {showMenuButton && (
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 mr-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
            </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AlgorithmGuide
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* 主要內容區塊 */}
      <main className="flex flex-1 mx-auto w-full max-w-7xl overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/flashcard/:categoryId" element={<FlashcardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
