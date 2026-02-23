import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { CheckCircle2, Eye, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProblemStatus } from '../data/index';

interface FlashCardProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  solution: string;
  onRate: (status: ProblemStatus) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const FlashCard = ({ title, difficulty, explanation, solution, onRate }: FlashCardProps) => {
  // 控制解答是否展開
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto drop-shadow-2xl">
      {/* 卡片本體 - 加入動畫與玻璃擬態 */}
      <motion.div 
        layout
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative"
      >
        {/* 頂部光暈裝飾 */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* 題目標頭 */}
        <div className="px-8 py-8 border-b border-slate-800/60 bg-slate-950/30">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${DIFFICULTY_STYLES[difficulty]}`}>
              {difficulty}
            </span>
            <span className="text-xs font-medium text-slate-500">LeetCode Flashcard</span>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight">{title}</h2>
        </div>

        {/* 白話文解說區（永遠可見） */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">💡</div>
            <p className="text-sm font-bold tracking-wider text-amber-400">
              白話文解說
            </p>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">{explanation}</p>
        </div>

        {/* 解答區與翻牌區 */}
        <AnimatePresence initial={false} mode="wait">
          {revealed ? (
            <motion.div
              key="solution"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="px-8 pb-8"
            >
              <div className="border-t border-slate-800/80 pt-8 mt-2">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-400 shadow-inner">💻</div>
                  <p className="text-sm font-bold tracking-wider text-sky-400">
                    Python 解法
                  </p>
                </div>
                
                <article className="prose prose-invert max-w-none">
                  <ReactMarkdown 
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      pre: ({ children }) => (
                        <pre className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-5 overflow-x-auto my-4 text-[13px] leading-relaxed shadow-inner custom-scrollbar">
                          {children}
                        </pre>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        if (isInline) {
                          return <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-indigo-500/10">{children}</code>;
                        }
                        return <code className={`${className} font-mono block`}>{children}</code>;
                      },
                      p: ({ children }) => (
                        <p className="text-slate-300 leading-relaxed mb-4 text-[15px]">{children}</p>
                      ),
                      li: ({ children }) => (
                        <li className="text-slate-300 mb-2 text-[15px] list-disc ml-5 marker:text-indigo-500 border-l-2 border-transparent hover:border-indigo-500/30 pl-2 transition-colors">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-white font-semibold">{children}</strong>
                      ),
                    }}
                  >
                    {solution}
                  </ReactMarkdown>
                </article>
              </div>

              {/* 評分按鈕 */}
              <div className="flex gap-4 mt-10">
                <button
                  aria-label="還不熟"
                  onClick={() => onRate('in_progress')}
                  className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 font-semibold transition-all duration-300 shadow-sm"
                >
                  <XCircle size={20} className="group-hover:scale-110 transition-transform" />
                  還不熟，需要複習
                </button>
                <button
                  aria-label="已掌握"
                  onClick={() => onRate('mastered')}
                  className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5"
                >
                  <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                  已掌握，下一題！
                </button>
              </div>
            </motion.div>
          ) : (
            /* 翻牌按鈕 */
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="px-8 pb-8 pt-4"
            >
              <button
                aria-label="顯示解答"
                onClick={() => setRevealed(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 font-bold text-lg transition-all duration-300 group"
              >
                <Eye size={22} className="group-hover:scale-110 transition-transform" />
                <span>點擊顯示解法思路</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FlashCard;
