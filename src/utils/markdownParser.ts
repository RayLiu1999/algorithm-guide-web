export interface ParsedFlashcard {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  solution: string;
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

    // 完整的區塊扣掉第一行作為 solution 內容
    const solution = lines.slice(1).join('\n').trim();

    // 提取白話文解說：找 "- **💡 白話文解說**：" 或 "- **思路**：" 的內容
    let explanation = '請參考下方程式碼解答。';
    const explanationMatch = solution.match(/-\s*\*\*(?:💡\s*)?(?:白話文解說|思路)\*\*[：:]\s*(.*)/);
    if (explanationMatch && explanationMatch[1]) {
      explanation = explanationMatch[1].trim();
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
