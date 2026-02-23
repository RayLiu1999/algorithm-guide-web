import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/index';

interface CategorySidebarProps {
  activeCategoryId: string | null;
}

// 學習狀態對應的顏色 Mapping
const CATEGORY_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-cyan-500 to-teal-600',
  'from-teal-500 to-emerald-600',
  'from-emerald-500 to-green-600',
  'from-yellow-500 to-amber-600',
  'from-orange-500 to-red-600',
  'from-red-500 to-rose-600',
  'from-rose-500 to-pink-600',
  'from-pink-500 to-fuchsia-600',
  'from-fuchsia-500 to-violet-600',
  'from-sky-500 to-blue-600',
  'from-lime-500 to-green-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-slate-500 to-gray-600',
];

const CategorySidebar = ({ activeCategoryId }: CategorySidebarProps) => {
  return (
    <nav className="w-72 h-screen bg-slate-900 border-r border-slate-800 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 px-2">
          演算法分類
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((cat, index) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {/* 分類序號徽章 */}
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-gradient-to-br ${CATEGORY_COLORS[index]} text-white flex-shrink-0`}
                  >
                    {cat.number}
                  </span>
                  {/* 分類名稱 */}
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{cat.subtitle}</span>
                    <span className="block text-xs text-slate-500 truncate">{cat.title}</span>
                  </span>
                  {/* 題數 */}
                  <span className="text-xs tabular-nums text-slate-500 flex-shrink-0">
                    {cat.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default CategorySidebar;
