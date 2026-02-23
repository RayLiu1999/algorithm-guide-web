import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/index';

interface CategorySidebarProps {
  activeCategoryId: string | null;
}

// 學習狀態對應的顏色 Mapping - 使用高質感漸層
const CATEGORY_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-cyan-500 to-teal-500',
  'from-teal-500 to-emerald-500',
  'from-emerald-500 to-green-500',
  'from-yellow-500 to-amber-500',
  'from-orange-500 to-red-500',
  'from-red-500 to-rose-500',
  'from-rose-500 to-pink-500',
  'from-pink-500 to-fuchsia-500',
  'from-fuchsia-500 to-purple-500',
  'from-violet-500 to-indigo-500',
  'from-sky-500 to-blue-500',
  'from-lime-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-slate-600 to-slate-800',
];

const CategorySidebar = ({ activeCategoryId }: CategorySidebarProps) => {
  return (
    <nav className="w-72 h-[calc(100vh-4rem)] bg-slate-950/50 border-r border-slate-800/50 overflow-y-auto flex-shrink-0 p-4 custom-scrollbar lg:block hidden">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
        演算法分類 (Categories)
      </h2>
      <ul className="space-y-1">
        {CATEGORIES.map((cat, index) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {/* 懸停光影效果 */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-in-out" />
                )}
                
                {/* 分類序號徽章 */}
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform ${
                    isActive 
                      ? `bg-gradient-to-br ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} text-white shadow-md shadow-black/20 scale-105` 
                      : `bg-slate-800 text-slate-300 group-hover:bg-gradient-to-br group-hover:${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} group-hover:text-white group-hover:scale-110`
                  }`}
                >
                  {cat.number}
                </span>
                
                {/* 分類名稱 */}
                <span className="flex-1 min-w-0">
                  <span className={`block truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {cat.subtitle}
                  </span>
                  <span className={`block text-[11px] truncate transition-colors ${isActive ? 'text-indigo-200/70' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {cat.title}
                  </span>
                </span>
                
                {/* 題數 */}
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full tabular-nums ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategorySidebar;
