import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type { Components } from "react-markdown";
import { Copy, Check } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
}

// 自訂 Markdown 元素的渲染規則
const components: Components = {
  h1: ({ children, id }) => (
    <h1
      id={id}
      className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 border-b border-slate-800/80 pb-4 mb-6"
    >
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="text-2xl font-bold text-slate-100 mt-10 mb-5 tracking-tight"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="text-xl font-semibold text-indigo-300 mt-8 mb-4">
      {children}
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className="text-lg font-medium text-slate-200 mt-6 mb-3">
      {children}
    </h4>
  ),
  // 程式碼區塊 - 強化發光邊框與字體，並加入複製按鈕
  pre: ({ children }) => <PreWithCopy>{children}</PreWithCopy>,
  code: ({ children, className }) => {
    // 檢查是否為 inline code (沒有 className 表示通常是 inline)
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-indigo-500/10">
          {children}
        </code>
      );
    }
    return <code className={`${className} font-mono block`}>{children}</code>;
  },
  // 段落
  p: ({ children }) => (
    <p className="text-slate-300 text-[15px] leading-relaxed mb-5">
      {children}
    </p>
  ),
  // 列表 — 偵測白話文解說的列表項目，給予特殊的 callout 樣式
  li: ({ children }) => {
    const text = String(children);
    const isCallout = text.includes("💡") || text.includes("白話文解說");

    if (isCallout) {
      return (
        <li className="list-none my-4">
          <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl px-5 py-4 text-amber-200/90 text-[15px] shadow-sm">
            {children}
          </div>
        </li>
      );
    }

    return (
      <li className="text-slate-300 text-[15px] ml-5 mb-2 list-disc pl-1 marker:text-indigo-500">
        {children}
      </li>
    );
  },
  ul: ({ children }) => <ul className="mb-6 space-y-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-6 space-y-1 list-decimal ml-5 marker:text-indigo-500 font-medium text-slate-300">
      {children}
    </ol>
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
  a: ({ children, href, ...props }) => {
    if (href && href.startsWith("#")) {
      return (
        <a
          href={href}
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            const targetId = decodeURIComponent(href.slice(1));
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
              window.history.pushState(null, "", href);
            }
          }}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
};

// 封裝 pre 元件以支援複製按鈕
const PreWithCopy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // 嘗試從 children 中提取純文字內容
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === "string" || typeof node === "number")
        return String(node);
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return extractText(props.children);
      }
      return "";
    };

    const text = extractText(children);

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group relative my-6">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700 hover:text-white flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm"
        title="複製代碼"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-400" />
            <span className="text-emerald-400">已複製</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>複製</span>
          </>
        )}
      </button>
      <pre className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 overflow-x-auto text-[13px] leading-relaxed shadow-lg shadow-black/40 custom-scrollbar m-0">
        {children}
      </pre>
    </div>
  );
};

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
