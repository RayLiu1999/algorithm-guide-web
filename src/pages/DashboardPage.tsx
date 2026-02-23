// DashboardPage.tsx — 首頁儀表板：顯示整體學習進度與各分類概覽
import { Link } from 'react-router-dom';
import { CATEGORIES, TOTAL_PROBLEMS } from '../data/index';
// import { useProgressStore } from '../store/progressStore';

const DashboardPage = () => {
  // const { getStatus } = useProgressStore();

  // 計算已掌握的題數
  const masteredCount = CATEGORIES.reduce((total, _cat) => {
    // 每個分類都預設用流水號當題目 id（簡化版，之後可細化）
    return total;
  }, 0);

  // 各分類的掌握統計
  const categoryStats = CATEGORIES.map((cat) => {
    const mastered = 0; // Phase 4 再細化
    const percent = cat.count > 0 ? Math.round((mastered / cat.count) * 100) : 0;
    return { ...cat, mastered, percent };
  });

  // 難度顏色樣式
  const GRADIENT_COLORS = [
    'from-violet-600 to-purple-700',
    'from-blue-600 to-cyan-700',
    'from-cyan-600 to-teal-700',
    'from-teal-600 to-emerald-700',
    'from-emerald-600 to-green-700',
    'from-yellow-600 to-amber-700',
    'from-orange-600 to-red-700',
    'from-red-600 to-rose-700',
    'from-rose-600 to-pink-700',
    'from-pink-600 to-fuchsia-700',
    'from-fuchsia-600 to-violet-700',
    'from-sky-600 to-blue-700',
    'from-lime-600 to-green-700',
    'from-amber-600 to-orange-700',
    'from-indigo-600 to-blue-700',
    'from-slate-600 to-gray-700',
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 側邊欄（首頁不 active 任何分類） */}
      <nav className="w-72 h-screen bg-slate-900 border-r border-slate-800 overflow-y-auto flex-shrink-0 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 px-2">
          演算法分類
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((cat, i) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors group"
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-gradient-to-br ${GRADIENT_COLORS[i]} text-white flex-shrink-0`}>
                  {cat.number}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{cat.subtitle}</span>
                  <span className="block text-xs text-slate-500 truncate">{cat.title}</span>
                </span>
                <span className="text-xs tabular-nums text-slate-500">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 右側主內容 */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* 歡迎標語 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">演算法學習首頁</h1>
          <p className="text-slate-400 mt-2">
            共 {TOTAL_PROBLEMS} 道題目，涵蓋 Grind 75 + Grind 169 精選 · 依演算法分類整理
          </p>
        </div>

        {/* 整體進度卡 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5">
            <p className="text-slate-400 text-sm">總題數</p>
            <p className="text-4xl font-bold text-white mt-1">{TOTAL_PROBLEMS}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5">
            <p className="text-slate-400 text-sm">分類數</p>
            <p className="text-4xl font-bold text-violet-400 mt-1">{CATEGORIES.length}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5">
            <p className="text-slate-400 text-sm">已掌握</p>
            <p className="text-4xl font-bold text-emerald-400 mt-1">{masteredCount}</p>
          </div>
        </div>

        {/* 各分類卡片 Grid */}
        <h2 className="text-lg font-semibold text-slate-200 mb-4">全部分類</h2>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {categoryStats.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-gradient-to-br ${GRADIENT_COLORS[i]} text-white`}>
                  {cat.number}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">{cat.count} 題</span>
              </div>
              <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                {cat.subtitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{cat.title}</p>
              {/* 進度條（Phase 4 細化） */}
              <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${GRADIENT_COLORS[i]} rounded-full transition-all`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
