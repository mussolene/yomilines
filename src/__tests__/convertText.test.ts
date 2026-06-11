import { describe, expect, it } from 'vitest';
import { convertText } from '../domain/convertText';

describe('convertText', () => {
  it('filters empty lines and converts non-empty lines', async () => {
    const blocks = await convertText('明かり\n\n  \n夜');

    expect(blocks).toHaveLength(2);
    expect(blocks.map((block) => block.original)).toEqual(['明かり', '夜']);
    expect(blocks[0]?.kana).toBe('あかり');
  });
});
