import { describe, expect, it } from 'vitest';
import { blocksToMarkdown } from '../domain/markdown';
import type { LineBlock } from '../domain/types';

function block(original: string, kana: string, romaji: string): LineBlock {
  return {
    original,
    kana,
    romaji,
    segments: [{ original, kana, romaji, kind: 'word' }]
  };
}

describe('blocksToMarkdown', () => {
  it('exports compact three-line blocks separated by blank lines', () => {
    const blocks: LineBlock[] = [
      block('明かり', 'あかり', 'akari'),
      block('夜', 'よる', 'yoru')
    ];

    expect(blocksToMarkdown(blocks)).toBe(
      '明かり\nあかり\nakari\n\n夜\nよる\nyoru'
    );
  });

  it('keeps markdown-like input as plain text', () => {
    const blocks: LineBlock[] = [
      block('**明かり**', '**あかり**', '**akari**')
    ];

    expect(blocksToMarkdown(blocks)).toBe('**明かり**\n**あかり**\n**akari**');
  });

  it('includes translation as an optional fourth line', () => {
    const translated = block('明かり', 'あかり', 'akari');
    translated.translation = 'light';

    expect(blocksToMarkdown([translated])).toBe('明かり\nあかり\nakari\nlight');
  });
});
