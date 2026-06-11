import { convertLine } from './convertLine';
import type { LineBlock } from './types';

export async function convertText(input: string): Promise<LineBlock[]> {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return Promise.all(lines.map(convertLine));
}
