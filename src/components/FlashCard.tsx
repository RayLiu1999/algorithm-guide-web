import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { CheckCircle2, Eye, XCircle } from 'lucide-react';
import type { ProblemStatus } from '../data/index';

interface FlashCardProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  solution: string;
  onRate: (status: ProblemStatus) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-950',
  Medium: 'text-amber-400 bg-amber-950',
  Hard: 'text-red-400 bg-red-950',
};

const FlashCard = ({ title, difficulty, explanation, solution, onRate }: FlashCardProps) => {
  // 控制解答是否展開
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 卡片本體 */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        {/* 題目標頭 */}
        <div className="px-8 py-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${DIFFICULTY_STYLES[difficulty]}`}>
              {difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        {/* 白話文解說區（永遠可見） */}
        <div className="px-8 py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            💡 白話文解說
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">{explanation}</p>
        </div>

        {/* 解答區（翻牌後才顯示） */}
        {revealed ? (
          <div className="px-8 pb-6">
            <div className="border-t border-slate-700 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
                Python 解法
              </p>
              <div className="bg-slate-950 rounded-xl overflow-hidden">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {solution}
                </ReactMarkdown>
              </div>
            </div>

            {/* 評分按鈕 */}
            <div className="flex gap-3 mt-6">
              <button
                aria-label="還不熟"
                onClick={() => onRate('in_progress')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-medium transition-colors"
              >
                <XCircle size={18} />
                還不熟
              </button>
              <button
                aria-label="已掌握"
                onClick={() => onRate('mastered')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-medium transition-colors"
              >
                <CheckCircle2 size={18} />
                已掌握
              </button>
            </div>
          </div>
        ) : (
          /* 翻牌按鈕 */
          <div className="px-8 pb-8">
            <button
              aria-label="顯示解答"
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-colors shadow-lg shadow-violet-900/50"
            >
              <Eye size={20} />
              顯示解答
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCard;
