// DashboardPage.tsx — 首頁儀表板：顯示整體學習進度與各分類概覽
import { Link } from 'react-router-dom';
import { CATEGORIES, TOTAL_PROBLEMS } from '../data/index';
// import { useProgressStore } from '../store/progressStore';
import { motion, type Variants } from 'framer-motion';

const DashboardPage = () => {
  // const { getStatus } = useProgressStore();

  // 計算已掌握的題數
  const masteredCount = CATEGORIES.reduce((total) => {
    // 每個分類都預設用流水號當題目 id（簡化版，之後可細化）
    return total;
  }, 0);

  // 各分類的掌握統計
  const categoryStats = CATEGORIES.map((cat) => {
    const mastered = 0; // Phase 4 再細化
    const percent = cat.count > 0 ? Math.round((mastered / cat.count) * 100) : 0;
    return { ...cat, mastered, percent };
  });

  // 難度顏色樣式 - 更有質感的漸層
  const GRADIENT_COLORS = [
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      {/* 側邊欄（首頁不 active 任何分類） */}
      <nav className="w-72 h-[calc(100vh-4rem)] bg-slate-950/50 border-r border-slate-800/50 overflow-y-auto flex-shrink-0 p-4 custom-scrollbar lg:block hidden">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
          演算法分類 (Categories)
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((cat, i) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-in-out" />
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} text-white flex-shrink-0 shadow-sm shadow-black/20 group-hover:scale-110 transition-transform`}>
                  {cat.number}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium">{cat.subtitle}</span>
                  <span className="block text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">{cat.title}</span>
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 tabular-nums">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 右側主內容 */}
      <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-5xl mx-auto">
          {/* 歡迎標語 */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Algorithm Mastery
            </h1>
            <p className="text-slate-400 mt-3 text-lg max-w-2xl leading-relaxed">
              系統化征服 LeetCode。涵蓋 Grind 75 與 Grind 169 精選題型，
              透過圖文解說與閃卡複習，建立堅實的演算法直覺。
            </p>
          </motion.div>

          {/* 整體進度卡 */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            <motion.div variants={itemVariants} className="relative group bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 overflow-hidden hover:border-slate-600/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">總題數 (Total)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-4xl font-bold text-white tracking-tight">{TOTAL_PROBLEMS}</p>
                <p className="text-sm text-slate-500 font-medium">/ 169 題</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative group bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 overflow-hidden hover:border-violet-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-violet-400 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">分類數 (Categories)</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mt-2 tracking-tight">{CATEGORIES.length}</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative group bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 overflow-hidden hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">已掌握 (Mastered)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">{masteredCount}</p>
                <p className="text-sm text-slate-500 font-medium">{TOTAL_PROBLEMS > 0 ? Math.round((masteredCount / TOTAL_PROBLEMS) * 100) : 0}% 達成率</p>
              </div>
            </motion.div>
          </motion.div>

          {/* 各分類卡片 Grid */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">選擇單元開始挑戰</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12"
          >
            {categoryStats.map((cat, i) => (
              <motion.div key={cat.id} variants={itemVariants} className="h-full">
                <Link
                  to={`/category/${cat.id}`}
                  className="group flex flex-col h-full bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/80 hover:border-slate-600 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} text-white shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      {cat.number}
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-full border border-slate-700/50">
                      {cat.count} 題
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                      {cat.subtitle}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {cat.title}
                    </p>
                  </div>
                  
                  {/* 進度條（Phase 4 細化） */}
                  <div className="mt-6">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1.5">
                      <span>進度</span>
                      <span>{cat.percent}%</span>
                    </div>
                    <div className="h-2 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full bg-gradient-to-r ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ width: `${cat.percent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
