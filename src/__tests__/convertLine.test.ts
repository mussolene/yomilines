import { describe, expect, it } from 'vitest';
import { convertLine } from '../domain/convertLine';

describe('convertLine', () => {
  it('converts a Japanese line to kana and romaji', async () => {
    const block = await convertLine(
      '明かりの灯ったmidnight エゴと欲と未練が行き交う'
    );

    expect(block.original).toBe(
      '明かりの灯ったmidnight エゴと欲と未練が行き交う'
    );
    expect(block.kana).toContain('あかり');
    expect(block.kana).toContain('midnight');
    expect(block.kana).toContain('みれん');
    expect(block.romaji).toContain('akari');
    expect(block.romaji).toContain('midnight');
    expect(block.segments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          original: '明かり',
          kana: 'あかり',
          romaji: 'a ka ri',
          kind: 'word'
        })
      ])
    );
  });

  it('preserves mixed English and Japanese text', async () => {
    const block = await convertLine('hello 東京 2026!');

    expect(block.original).toBe('hello 東京 2026!');
    expect(block.kana).toBe('hello とうきょう 2026!');
    expect(block.romaji).toBe('hello toukyou 2026!');
  });
});
