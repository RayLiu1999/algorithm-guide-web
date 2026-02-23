import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getCategoryById } from '../data/index';
import { useProgressStore } from '../store/progressStore';
import FlashCard from '../components/FlashCard';
import { parseMarkdownToFlashcards, ParsedFlashcard } from '../utils/markdownParser';
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
    
    // 進入下一張 (並自動往上捲到底部或維持元件重新掛載)
    setCurrentIndex((prev) => prev + 1);
  };

  if (!category) {
    return <div className="p-8 text-center text-slate-400">找不到該分類</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* 頂部導航列 */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">🃏 Flashcard 模式</h1>
            <p className="text-sm text-slate-400">{category.subtitle} · {category.title}</p>
          </div>
        </div>
        
        {/* 進度顯示 */}
        {!loading && !error && cards.length > 0 && (
          <div className="text-sm font-medium text-slate-300 bg-slate-800 px-4 py-1.5 rounded-full">
            {Math.min(currentIndex + 1, cards.length)} / {cards.length}
          </div>
        )}
      </header>

      {/* 閃卡主要內容區 */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center relative">
        {loading && <div className="text-slate-500">載入卡片中...</div>}
        {error && <div className="text-red-400">{error}</div>}
        
        {!loading && !error && cards.length > 0 && (
          currentIndex < cards.length ? (
            // FlashCard 元件內部用了 useState 紀錄展開狀態，
            // 為了每次換卡片都能重置狀態，必須綁定 key 為卡片獨有的 ID
            <div className="w-full max-w-4xl py-12">
              <FlashCard 
                key={cards[currentIndex].id}
                title={cards[currentIndex].title}
                difficulty={cards[currentIndex].difficulty}
                explanation={cards[currentIndex].explanation}
                solution={cards[currentIndex].solution}
                onRate={handleRate}
              />
            </div>
          ) : (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">已完成本分類所有閃卡！</h2>
              <p className="text-slate-400 mb-8">真是太棒了，你的記憶力越來越強了！</p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors"
                >
                  回首頁
                </Link>
                <Link
                  to={`/category/${category.id}`}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
                >
                  閱讀分類教學
                </Link>
              </div>
            </div>
          )
        )}
        
        {!loading && !error && cards.length === 0 && (
          <div className="text-slate-400">本分類目前沒有卡片資料</div>
        )}
      </main>
    </div>
  );
};

export default FlashcardPage;
