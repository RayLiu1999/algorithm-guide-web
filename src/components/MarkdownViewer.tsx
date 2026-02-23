import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

interface MarkdownViewerProps {
  content: string;
}

// 自訂 Markdown 元素的渲染規則
const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 border-b border-slate-800/80 pb-4 mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-slate-100 mt-10 mb-5 tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-indigo-300 mt-8 mb-4">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-medium text-slate-200 mt-6 mb-3">{children}</h4>
  ),
  // 程式碼區塊 - 強化發光邊框與字體
  pre: ({ children }) => (
    <pre className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 overflow-x-auto my-6 text-[13px] leading-relaxed shadow-lg shadow-black/40 custom-scrollbar">{children}</pre>
  ),
  code: ({ children, className }) => {
    // 檢查是否為 inline code (沒有 className 表示通常是 inline)
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-indigo-500/10">{children}</code>
      );
    }
    return <code className={`${className} font-mono block`}>{children}</code>;
  },
  // 段落
  p: ({ children }) => (
    <p className="text-slate-300 text-[15px] leading-relaxed mb-5">{children}</p>
  ),
  // 列表 — 偵測白話文解說的列表項目，給予特殊的 callout 樣式
  li: ({ children }) => {
    const text = String(children);
    const isCallout = text.includes('💡') || text.includes('白話文解說');

    if (isCallout) {
      return (
        <li className="list-none my-4">
          <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl px-5 py-4 text-amber-200/90 text-[15px] shadow-sm">
            {children}
          </div>
        </li>
      );
    }

    return <li className="text-slate-300 text-[15px] ml-5 mb-2 list-disc pl-1 marker:text-indigo-500">{children}</li>;
  },
  ul: ({ children }) => (
    <ul className="mb-6 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 space-y-1 list-decimal ml-5 marker:text-indigo-500 font-medium text-slate-300">{children}</ol>
  ),
  // 粗體
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  // 引用
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500/50 bg-indigo-500/5 px-5 py-3 rounded-r-xl text-slate-300 italic my-6">
      {children}
    </blockquote>
  ),
  // 連結
  a: ({ children, href }) => (
    <a href={href} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
