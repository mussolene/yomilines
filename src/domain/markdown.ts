import type { LineBlock } from './types';
import { toPlainText } from './security';

export function blocksToMarkdown(blocks: LineBlock[]): string {
  return blocks
    .map((block) =>
      [block.original, block.kana, block.romaji].map(toPlainText).join('\n')
    )
    .join('\n\n');
}
