export interface ParsedFlashcard {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  solution: string;
}

function getTopLevelBlockLabel(line: string): string | null {
  const match = line.match(/^- \*\*(.+?)\*\*[：:]/);
  return match?.[1]?.trim() ?? null;
}

function normalizeMarkdownBlock(content: string): string {
  return content.replace(/\n{3,}/g, '\n\n').trim();
}

function removeTopLevelBlocks(lines: string[], labelsToRemove: string[]): string[] {
  const filtered: string[] = [];
  let shouldSkip = false;

  for (const line of lines) {
    const label = getTopLevelBlockLabel(line);
    if (label) {
      shouldSkip = labelsToRemove.includes(label);
      if (!shouldSkip) {
        filtered.push(line);
      }
      continue;
    }

    if (!shouldSkip) {
      filtered.push(line);
    }
  }

  return filtered;
}

function extractTopLevelBlock(lines: string[], label: string): string | null {
  const startIndex = lines.findIndex((line) => line.startsWith(`- **${label}**`));
  if (startIndex === -1) return null;

  const firstLine = lines[startIndex];
  const content: string[] = [];
  const inlineMatch = firstLine.match(new RegExp(`^- \\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*[：:]\\s*(.*)$`));

  if (inlineMatch?.[1]?.trim()) {
    content.push(inlineMatch[1].trim());
  }

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith('- **')) {
      break;
    }
    content.push(line);
  }

  const block = normalizeMarkdownBlock(content.join('\n'));
  return block || null;
}

function extractFlashcardPrompt(lines: string[]): string | null {
  const solutionStartIndex = findSolutionStartIndex(lines);
  if (solutionStartIndex <= 0) return null;

  const promptLines = removeTopLevelBlocks(lines.slice(0, solutionStartIndex), ['題目（中文）', '題目']);
  const prompt = normalizeMarkdownBlock(promptLines.join('\n'));
  return prompt || null;
}

function findSolutionStartIndex(lines: string[]): number {
  const strategyIndex = lines.findIndex((line) => /^- \*\*(套路|思路|解說)\*\*/.test(line));
  if (strategyIndex !== -1) return strategyIndex;

  const fallbackIndex = lines.findIndex((line) => /^- \*\*(TC|SC|其他思路|解法比較|測試重點 \(Testing\))\*\*/.test(line));
  return fallbackIndex === -1 ? 0 : fallbackIndex;
}

export function parseMarkdownToFlashcards(markdown: string): ParsedFlashcard[] {
  // 將 markdown 用 "### " 切割（考慮到可能有 \n### ）
  // 注意，只有真正的標題才是換行後接 ###
  const sections = markdown.split(/(?:\n|^)### /).filter(Boolean);

  // 第一筆通常是 "# 一、..." 之類的檔頭，如果它不包含 "1. " 類似題號格式，直接濾除
  const cards: ParsedFlashcard[] = [];

  for (const sec of sections) {
    const lines = sec.trim().split('\n');
    const firstLine = lines[0].trim();

    // 解析第一行： "1. Two Sum (Easy)" 或 "70. Product ... (Med.)"
    const titleMatch = firstLine.match(/^(\d+)\.\s+(.+?)\s*\((Easy|Med\.|Hard)\)$/i);
    if (!titleMatch) continue; // 不符合題目標題格式就跳過

    const id = titleMatch[1];
    const rawTitle = titleMatch[2];
    const rawDiff = titleMatch[3];

    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
    if (rawDiff.toLowerCase().includes('med')) difficulty = 'Medium';
    if (rawDiff.toLowerCase().includes('hard')) difficulty = 'Hard';

    const bodyLines = lines.slice(1);
    const solutionStartIndex = findSolutionStartIndex(bodyLines);
    const solution = bodyLines.slice(solutionStartIndex).join('\n').trim();

    // 正面優先顯示英文題目敘述；若缺少則退回舊版解說/思路邏輯
    let explanation = '請參考下方程式碼解答。';
    const fullPrompt = extractFlashcardPrompt(bodyLines);
    if (fullPrompt) {
      explanation = fullPrompt;
    } else {
      const explanationBlock = extractTopLevelBlock(bodyLines, '解說') ?? extractTopLevelBlock(bodyLines, '思路');
      if (explanationBlock) {
        explanation = explanationBlock;
      }
    }

    cards.push({
      id,
      title: rawTitle,
      difficulty,
      explanation,
      solution,
    });
  }

  return cards;
}
