import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { ProblemStatus } from '../data/index';

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: ProblemStatus;
  isBookmarked: boolean;
  onStatusChange: (id: string, status: ProblemStatus) => void;
  onBookmarkToggle: (id: string) => void;
}

// 難度對應的樣式
const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-950',
  Medium: 'text-amber-400 bg-amber-950',
  Hard: 'text-red-400 bg-red-950',
};

// 學習狀態對應的標籤與樣式
const STATUS_CONFIG: Record<ProblemStatus, { label: string; icon: React.ReactNode; style: string }> = {
  not_started: {
    label: '未開始',
    icon: <Circle size={14} />,
    style: 'text-slate-500 bg-slate-800',
  },
  in_progress: {
    label: '練習中',
    icon: <Clock size={14} />,
    style: 'text-amber-400 bg-amber-950',
  },
  mastered: {
    label: '已掌握',
    icon: <CheckCircle2 size={14} />,
    style: 'text-emerald-400 bg-emerald-950',
  },
};

const ProblemCard = ({
  id,
  title,
  difficulty,
  status,
  isBookmarked,
  onStatusChange,
  onBookmarkToggle,
}: ProblemCardProps) => {
  const statusCfg = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all group">
      {/* 題目名稱與難度 */}
      <div className="flex-1 min-w-0">
        <span className="text-slate-200 font-medium text-sm truncate block">{title}</span>
        <div className="flex items-center gap-2 mt-1">
          {/* 難度標籤 */}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[difficulty]}`}>
            {difficulty}
          </span>
          {/* 學習狀態 */}
          <span className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full ${statusCfg.style}`}>
            {statusCfg.icon}
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* 操作按鈕區 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 書籤按鈕 */}
        <button
          aria-label="書籤"
          onClick={() => onBookmarkToggle(id)}
          className={`p-1.5 rounded-lg transition-colors ${
            isBookmarked
              ? 'text-amber-400 bg-amber-950'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>

        {/* 標示為已掌握按鈕 */}
        {status !== 'mastered' && (
          <button
            aria-label="標示為已掌握"
            onClick={() => onStatusChange(id, 'mastered')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-950 transition-colors"
          >
            <CheckCircle2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;
