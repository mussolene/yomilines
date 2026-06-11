import { toHiragana } from 'wanakana';
import { kanaToRomaji } from './romaji';
import { getTokenizer, type JapaneseToken } from './tokenizer';
import type { LineBlock } from './types';
import { toPlainText } from './security';

function isPunctuation(text: string): boolean {
  return /^[\p{P}]+$/u.test(text);
}

function tokenReading(token: JapaneseToken): string {
  if (!token.reading || token.reading === '*') {
    return token.surface_form;
  }

  return toHiragana(token.reading, { passRomaji: true });
}

function joinReadings(tokens: JapaneseToken[]): string {
  return tokens.reduce((line, token) => {
    const reading = tokenReading(token);

    if (/^\s+$/.test(reading)) {
      return line.endsWith(' ') ? line : `${line} `;
    }

    if (isPunctuation(reading)) {
      return `${line.trimEnd()}${reading}`;
    }

    if (token.pos === '助動詞') {
      return `${line}${reading}`;
    }

    return line.length > 0 && !line.endsWith(' ')
      ? `${line} ${reading}`
      : `${line}${reading}`;
  }, '');
}

export async function convertLine(line: string): Promise<LineBlock> {
  const original = toPlainText(line);
  const tokenizer = await getTokenizer();
  const kana = joinReadings(tokenizer.tokenize(original));

  return {
    original,
    kana,
    romaji: kanaToRomaji(kana)
  };
}
