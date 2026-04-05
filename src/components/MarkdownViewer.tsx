import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type { Components } from "react-markdown";
import { BookOpen, Check, CheckCircle2, Copy, X } from "lucide-react";
import { useProgressStore } from "../store/progressStore";

interface MarkdownViewerProps {
  content: string;
  categoryId?: string;
}

interface ProblemSection {
  id: string;
  title: string;
  content: string;
}

const PROBLEM_HEADING_REGEX = /^(\d+)\.\s+(.+?)\s*\((Easy|Med\.|Hard)\)$/i;
const PROBLEM_BLOCK_START_REGEX = /^-\s*\*\*(?:Problem(?:\s*\(English\))?|題目(?:（中文）)?|Examples?|範例(?:（中文）)?|Constraints?|限制條件(?:（中文）)?|Conditions(?:\s*\(English\))?)\*\*[：:]/;
const PROBLEM_BODY_END_REGEX = /^-\s*\*\*(?:套路|思路)\*\*[：:]/;

const extractProblemSections = (markdown: string): Record<string, ProblemSection> => {
  const sections = markdown.split(/(?:\n|^)### /).filter(Boolean);
  const problemSections: Record<string, ProblemSection> = {};

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const firstLine = lines[0]?.trim();
    const titleMatch = firstLine?.match(PROBLEM_HEADING_REGEX);

    if (!titleMatch) continue;

    const id = titleMatch[1];
    const title = titleMatch[2];
    const bodyEndIndex = lines.findIndex((line) => PROBLEM_BODY_END_REGEX.test(line.trim()));
    const contentLines = bodyEndIndex === -1 ? lines.slice(1) : lines.slice(1, bodyEndIndex);
    const content = contentLines.join('\n').trim();

    problemSections[id] = { id, title, content };
  }

  return problemSections;
};

const stripProblemContent = (markdown: string): string => {
  const lines = markdown.split('\n');
  const filteredLines: string[] = [];
  let isInsideProblemStatement = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (PROBLEM_BLOCK_START_REGEX.test(trimmedLine)) {
      isInsideProblemStatement = true;
      continue;
    }

    if (isInsideProblemStatement) {
      if (PROBLEM_BODY_END_REGEX.test(trimmedLine)) {
        isInsideProblemStatement = false;
        if (filteredLines.at(-1)?.trim() !== '') {
          filteredLines.push('');
        }
        filteredLines.push(line);
      }
      continue;
    }

    filteredLines.push(line);
  }

  return filteredLines.join('\n').replace(/\n{3,}/g, '\n\n');
};

const ProblemModal: React.FC<{ problem: ProblemSection | null; onClose: () => void }> = ({ problem, onClose }) => {
  useEffect(() => {
    if (!problem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [problem, onClose]);

  if (!problem) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-modal-title"
        className="w-full max-w-5xl h-[88dvh] sm:h-[min(90dvh,48rem)] overflow-hidden rounded-t-3xl sm:rounded-3xl border border-slate-700/60 bg-slate-950/95 shadow-2xl shadow-black/60 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6 sm:py-5 bg-slate-950/90 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300/80 mb-2">Problem</p>
            <h3 id="problem-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {problem.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label="關閉題目視窗"
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8 custom-scrollbar">
          <article className="prose prose-invert prose-slate max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight, rehypeSlug]}
              components={{
                h1: ({ children, id }) => (
                  <h1 id={id} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 border-b border-slate-800/80 pb-4 mb-6">
                    {children}
                  </h1>
                ),
                h2: ({ children, id }) => (
                  <h2 id={id} className="text-2xl font-bold text-slate-100 mt-10 mb-5 tracking-tight">
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
                pre: ({ children }) => <PreWithCopy>{children}</PreWithCopy>,
                code: ({ children, className }) => {
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
                p: ({ children }) => (
                  <p className="text-slate-300 text-[15px] leading-relaxed mb-5">
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li className="text-slate-300 text-[15px] ml-5 mb-2 list-disc pl-1 marker:text-indigo-500">
                    {children}
                  </li>
                ),
                ul: ({ children }) => <ul className="mb-6 space-y-1">{children}</ul>,
                ol: ({ children }) => (
                  <ol className="mb-6 space-y-1 list-decimal ml-5 marker:text-indigo-500 font-medium text-slate-300">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500/50 bg-indigo-500/5 px-5 py-3 rounded-r-xl text-slate-300 italic my-6">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors"
                    target={href && !href.startsWith('#') ? '_blank' : undefined}
                    rel={href && !href.startsWith('#') ? 'noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {problem.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>,
    document.body
  );
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

const MarkdownViewer = ({ content, categoryId }: MarkdownViewerProps) => {
  const progress = useProgressStore((state) => state.progress);
  const [activeProblem, setActiveProblem] = useState<ProblemSection | null>(null);

  const problemSections = useMemo(() => extractProblemSections(content), [content]);
  const displayContent = useMemo(() => stripProblemContent(content), [content]);

  useEffect(() => {
    setActiveProblem(null);
  }, [content]);

  const components: Components = useMemo(() => ({
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
    h3: ({ children, id }) => {
      let isMastered = false;
      let problemSection: ProblemSection | null = null;
      if (categoryId) {
        const text = React.Children.toArray(children).join("");
        const titleMatch = text.match(/^(\d+)\.\s+/);
        if (titleMatch) {
          const problemId = titleMatch[1];
          problemSection = problemSections[problemId] ?? null;
          if (progress[`${categoryId}:${problemId}`] === 'mastered') {
            isMastered = true;
          }
        }
      }

      return (
        <h3 id={id} className="text-xl font-semibold text-indigo-300 mt-8 mb-4 flex flex-wrap items-center gap-3">
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span>{children}</span>
            {isMastered && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={14} />
                已掌握
              </span>
            )}
          </span>
          {problemSection && (
            <button
              type="button"
              onClick={() => setActiveProblem(problemSection)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[12px] font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-200"
              aria-label={`查看 ${problemSection.title} 題目內容`}
              title="查看題目內容"
            >
              <BookOpen size={13} />
              Problem
            </button>
          )}
        </h3>
      );
    },
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
    // 列表 — 偵測解說的列表項目，給予特殊的 callout 樣式
    li: ({ children }) => {
      const text = String(children);
      const isCallout = text.includes("思路") || text.includes("解說") || text.includes("套路");

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
  }), [categoryId, progress, problemSections]);

  return (
    <>
      <article className="prose prose-invert prose-slate max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={components}
        >
          {displayContent}
        </ReactMarkdown>
      </article>
      <ProblemModal problem={activeProblem} onClose={() => setActiveProblem(null)} />
    </>
  );
};

export default MarkdownViewer;
