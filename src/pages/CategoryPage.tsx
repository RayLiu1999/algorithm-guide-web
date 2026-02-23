import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySidebar from '../components/CategorySidebar';
import MarkdownViewer from '../components/MarkdownViewer';
import { getCategoryById } from '../data/index';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = categoryId ? getCategoryById(categoryId) : null;

  // 當分類改變時，動態載入對應的 Markdown 檔案
  useEffect(() => {
    if (!category) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(`/data/${category.file}`)
      .then((res) => {
        if (!res.ok) throw new Error('無法載入教材');
        return res.text();
      })
      .then((text) => {
        setMarkdownContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category]);

  if (!category) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">找不到該分類</p>
          <Link to="/" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      {/* 左側導覽欄 */}
      <CategorySidebar activeCategoryId={categoryId ?? null} />

      {/* 右側主內容區 */}
      <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar relative">
        {/* 背景裝飾 */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="max-w-4xl mx-auto pb-20">
          {/* 分類標題區 - 毛玻璃效果 */}
          <div className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50 px-6 py-6 md:px-10">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={category.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                    {category.number}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{category.subtitle}</h2>
                </div>
                <p className="text-slate-400 font-medium ml-11">{category.title} <span className="mx-2 text-slate-700">•</span> {category.count} 題</p>
              </div>
              
              <Link
                to={`/flashcard/${categoryId}`}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 group-hover:-mt-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>進入閃卡測驗</span>
              </Link>
            </motion.div>
          </div>

          {/* 教學內容 */}
          <div className="px-6 py-8 md:px-10">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-32"
                >
                  <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-indigo-400 font-medium">載入教材中...</p>
                </motion.div>
              )}
              
              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto mt-12"
                >
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-red-200 mb-1">載入失敗</h3>
                  <p className="text-red-300/80">{error}</p>
                </motion.div>
              )}
              
              {!loading && !error && (
                <motion.div
                  key={`content-${category.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-xl shadow-black/10"
                >
                  <MarkdownViewer content={markdownContent} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
