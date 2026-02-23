// CategoryPage.tsx — 分類閱讀頁：左圖表列表 + 右側 Markdown 詳解
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import MarkdownViewer from '../components/MarkdownViewer';
import { getCategoryById } from '../data/index';
// import { useProgressStore } from '../store/progressStore';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = categoryId ? getCategoryById(categoryId) : null;
  // const { setStatus, getStatus, toggleBookmark, isBookmarked } = useProgressStore();

  // 當分類改變時，動態載入對應的 Markdown 檔案
  useEffect(() => {
    if (!category) return;

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
        找不到該分類
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 左側導覽欄 */}
      <CategorySidebar activeCategoryId={categoryId ?? null} />

      {/* 右側主內容區 */}
      <main className="flex-1 overflow-y-auto">
        {/* 分類標題區 */}
        <div className="border-b border-slate-800 px-8 py-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{category.subtitle}</h2>
              <p className="text-slate-400 mt-1">{category.title} · {category.count} 題</p>
            </div>
            <a
              href={`/flashcard/${categoryId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              🃏 Flashcard 模式
            </a>
          </div>
        </div>

        {/* 教學內容 */}
        <div className="px-8 py-6">
          {loading && (
            <div className="text-slate-500 text-center py-16">載入中...</div>
          )}
          {error && (
            <div className="text-red-400 text-center py-16">{error}</div>
          )}
          {!loading && !error && (
            <MarkdownViewer content={markdownContent} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
