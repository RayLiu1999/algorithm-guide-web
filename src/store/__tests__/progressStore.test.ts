import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../../store/progressStore';

// 在每個測試前重置 store 狀態，避免測試之間互相污染
function resetStore() {
  useProgressStore.setState({
    progress: {},
    bookmarks: [],
  });
}

describe('useProgressStore', () => {
  beforeEach(resetStore);

  it('初始狀態下，所有題目為 not_started', () => {
    const { getStatus } = useProgressStore.getState();
    // 任何未設定過的題目 ID，應回傳 not_started
    expect(getStatus('1')).toBe('not_started');
  });

  it('可以將題目狀態改為 in_progress', () => {
    const { setStatus, getStatus } = useProgressStore.getState();
    setStatus('1', 'in_progress');
    expect(getStatus('1')).toBe('in_progress');
  });

  it('可以將題目狀態切換為 mastered', () => {
    const { setStatus, getStatus } = useProgressStore.getState();
    setStatus('1', 'mastered');
    expect(getStatus('1')).toBe('mastered');
  });

  it('可以新增書籤', () => {
    const { toggleBookmark, bookmarks } = useProgressStore.getState();
    toggleBookmark('1');
    // toggleBookmark 後需要重新取得最新的 state
    expect(useProgressStore.getState().bookmarks).toContain('1');
  });

  it('再次 toggle 書籤會移除書籤', () => {
    const { toggleBookmark } = useProgressStore.getState();
    toggleBookmark('1');
    toggleBookmark('1');
    expect(useProgressStore.getState().bookmarks).not.toContain('1');
  });

  it('isBookmarked 能正確識別是否已加入書籤', () => {
    const { toggleBookmark, isBookmarked } = useProgressStore.getState();
    expect(isBookmarked('1')).toBe(false);
    toggleBookmark('1');
    expect(useProgressStore.getState().isBookmarked('1')).toBe(true);
  });
});
