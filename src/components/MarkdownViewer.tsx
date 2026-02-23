import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

interface MarkdownViewerProps {
  content: string;
}

// 自訂 Markdown 元素的渲染規則
const components: Components = {
  // 自訂 h1 ~ h3 的樣式
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-2 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-sky-400 mt-5 mb-2">{children}</h3>
  ),
  // 程式碼區塊
  pre: ({ children }) => (
    <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto my-3 text-sm">{children}</pre>
  ),
  code: ({ children, className }) => (
    <code className={`${className ?? ''} text-emerald-300`}>{children}</code>
  ),
  // 段落
  p: ({ children }) => (
    <p className="text-slate-300 leading-relaxed mb-3">{children}</p>
  ),
  // 列表 — 偵測白話文解說的列表項目，給予特殊的 callout 樣式
  li: ({ children }) => {
    // 轉成字串後偵測是否包含白話文解說的 emoji
    const text = String(children);
    const isCallout = text.includes('💡') || text.includes('白話文解說');

    if (isCallout) {
      return (
        <li className="list-none my-2">
          <div className="bg-amber-950/50 border-l-4 border-amber-400 rounded-r-lg px-4 py-3 text-amber-200 text-sm">
            {children}
          </div>
        </li>
      );
    }

    return <li className="text-slate-300 ml-4 mb-1 list-disc">{children}</li>;
  },
  // 粗體
  strong: ({ children }) => (
    <strong className="text-slate-100 font-semibold">{children}</strong>
  ),
};

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  return (
    <article className="prose max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
