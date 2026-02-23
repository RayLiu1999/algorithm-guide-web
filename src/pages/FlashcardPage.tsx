import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../data/index';
import { useProgressStore } from '../store/progressStore';
import FlashCard from '../components/FlashCard';
import { parseMarkdownToFlashcards } from '../utils/markdownParser';
import type { ParsedFlashcard } from '../utils/markdownParser';
import type { ProblemStatus } from '../data/index';

const FlashcardPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState<ParsedFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = categoryId ? getCategoryById(categoryId) : null;
  const { setStatus } = useProgressStore();

  // 抓取 Markdown 資料並透過 parser 轉成 flashcards
  useEffect(() => {
    if (!category) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/data/${category.file}`)
      .then((res) => {
        if (!res.ok) throw new Error('無法載入教材');
        return res.text();
      })
      .then((text) => {
        const parsed = parseMarkdownToFlashcards(text);
        setCards(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category]);

  const handleRate = (status: ProblemStatus) => {
    if (!cards[currentIndex]) return;
    
    // 儲存狀態進 Zustand store
    setStatus(cards[currentIndex].id, status);
    
    // 進入下一張
    setCurrentIndex((prev) => prev + 1);
  };

  if (!category) {
    return (
      <div className="flex-1 flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        找不到該分類
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      {/* 背景裝飾 */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 -z-10 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      {/* 頂部導航列 */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 md:px-10 border-b border-slate-800/50 bg-slate-950/40 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/20 shadow-sm gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group p-2.5 -ml-2.5 text-slate-400 hover:text-white bg-slate-800/30 hover:bg-slate-800/80 rounded-xl transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 shadow-sm"
          >
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 flex items-center gap-2 tracking-tight">
              <span className="text-xl">🃏</span> Flashcard
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">{category.subtitle} · {category.title}</p>
          </div>
        </div>
        
        {/* 進度與跳轉控制 */}
        <AnimatePresence>
          {!loading && !error && cards.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-2 py-1.5 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-inner w-full sm:w-auto"
            >
              <button 
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0 || currentIndex >= cards.length}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                aria-label="上一題"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center justify-center min-w-[4rem] text-sm font-bold tabular-nums">
                {currentIndex < cards.length ? (
                  <select 
                    value={currentIndex}
                    onChange={(e) => setCurrentIndex(Number(e.target.value))}
                    className="bg-transparent appearance-none outline-none cursor-pointer text-indigo-300 hover:text-indigo-200 text-center text-sm font-bold text-center"
                    style={{ textAlignLast: 'center' }}
                  >
                    {cards.map((_, i) => (
                      <option key={i} value={i} className="bg-slate-900 text-slate-200">
                        {i + 1}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-indigo-300">{Math.min(currentIndex + 1, cards.length)}</span>
                )}
                <span className="text-slate-500 font-medium ml-1">/ {cards.length}</span>
              </div>

              <button 
                onClick={() => setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1))}
                disabled={currentIndex >= cards.length - 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                aria-label="下一題/跳過"
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 閃卡主要內容區 */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 flex items-center justify-center relative custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8"
            >
              <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4 shadow-lg shadow-violet-500/20" />
              <p className="text-violet-400 font-medium tracking-wide">洗牌中...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl"
            >
              <svg className="w-16 h-16 text-red-500/80 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-red-100 mb-2">無法載入閃卡</h3>
              <p className="text-red-300/80 mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-colors font-medium border border-red-500/30">重新嘗試</button>
            </motion.div>
          )}
          
          {!loading && !error && cards.length > 0 && (
            currentIndex < cards.length ? (
              <motion.div
                key={cards[currentIndex].id}
                initial={{ opacity: 0, x: 100, scale: 0.95, rotate: 2 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.95, rotate: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full max-w-4xl py-6 md:py-12"
              >
                <FlashCard 
                  title={cards[currentIndex].title}
                  difficulty={cards[currentIndex].difficulty}
                  explanation={cards[currentIndex].explanation}
                  solution={cards[currentIndex].solution}
                  onRate={handleRate}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 md:p-16 max-w-xl mx-auto shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
                <motion.div 
                  initial={{ rotate: -15, scale: 0 }} 
                  animate={{ rotate: 0, scale: 1 }} 
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-8xl mb-8 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-3 tracking-tight">已完成所有閃卡！</h2>
                <p className="text-slate-400 mb-10 text-lg">你已經複習完了這個單元所有的重點，繼續保持！</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                  <Link
                    to="/"
                    className="group px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl transition-all duration-300 border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    返回課程列表
                  </Link>
                  <Link
                    to={`/category/${category.id}`}
                    className="px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                  >
                    閱讀完整解說
                  </Link>
                </div>
              </motion.div>
            )
          )}
          
          {!loading && !error && cards.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-slate-400 bg-slate-900/50 backdrop-blur-md px-8 py-6 rounded-2xl border border-slate-800"
            >
              本分類目前沒有題庫資料
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FlashcardPage;
