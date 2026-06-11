import { describe, expect, it } from 'vitest';
import { blocksToMarkdown } from '../domain/markdown';
import type { LineBlock } from '../domain/types';

describe('blocksToMarkdown', () => {
  it('exports compact three-line blocks separated by blank lines', () => {
    const blocks: LineBlock[] = [
      { original: '明かり', kana: 'あかり', romaji: 'akari' },
      { original: '夜', kana: 'よる', romaji: 'yoru' }
    ];

    expect(blocksToMarkdown(blocks)).toBe(
      '明かり\nあかり\nakari\n\n夜\nよる\nyoru'
    );
  });

  it('keeps markdown-like input as plain text', () => {
    const blocks: LineBlock[] = [
      { original: '**明かり**', kana: '**あかり**', romaji: '**akari**' }
    ];

    expect(blocksToMarkdown(blocks)).toBe('**明かり**\n**あかり**\n**akari**');
  });
});
