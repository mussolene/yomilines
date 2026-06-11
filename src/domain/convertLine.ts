import { toHiragana } from 'wanakana';
import { kanaToRomaji, kanaToSpacedRomaji } from './romaji';
import { getTokenizer, type JapaneseToken } from './tokenizer';
import type { LineBlock, ReadingSegment, ReadingSegmentKind } from './types';
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

function segmentKind(text: string): ReadingSegmentKind {
  if (/^\s+$/.test(text)) {
    return 'space';
  }

  return isPunctuation(text) ? 'punctuation' : 'word';
}

function createSegment(token: JapaneseToken): ReadingSegment {
  const kana = tokenReading(token);
  const kind = segmentKind(token.surface_form);

  return {
    original: token.surface_form,
    kana,
    romaji: kind === 'word' ? kanaToSpacedRomaji(kana) : kanaToRomaji(kana),
    kind
  };
}

function mergeAuxiliarySegments(
  segments: ReadingSegment[],
  tokens: JapaneseToken[]
): ReadingSegment[] {
  return segments.reduce<ReadingSegment[]>((merged, segment, index) => {
    const token = tokens[index];
    const previous = merged[merged.length - 1];

    if (token?.pos === '助動詞' && previous?.kind === 'word') {
      previous.original = `${previous.original}${segment.original}`;
      previous.kana = `${previous.kana}${segment.kana}`;
      previous.romaji = kanaToSpacedRomaji(previous.kana);
      return merged;
    }

    merged.push(segment);
    return merged;
  }, []);
}

function joinKana(segments: ReadingSegment[]): string {
  return segments.reduce((line, segment) => {
    if (segment.kind === 'space') {
      return line.endsWith(' ') ? line : `${line} `;
    }

    if (segment.kind === 'punctuation') {
      return `${line.trimEnd()}${segment.kana}`;
    }

    if (line.length > 0 && !line.endsWith(' ')) {
      return `${line} ${segment.kana}`;
    }

    return `${line}${segment.kana}`;
  }, '');
}

function joinRomaji(segments: ReadingSegment[]): string {
  return segments.reduce((line, segment) => {
    if (segment.kind === 'space') {
      return line.endsWith(' ') ? line : `${line} `;
    }

    if (segment.kind === 'punctuation') {
      return `${line.trimEnd()}${segment.romaji}`;
    }

    const romaji = kanaToRomaji(segment.kana);

    if (line.length > 0 && !line.endsWith(' ')) {
      return `${line} ${romaji}`;
    }

    return `${line}${romaji}`;
  }, '');
}

export async function convertLine(line: string): Promise<LineBlock> {
  const original = toPlainText(line);
  const tokenizer = await getTokenizer();
  const tokens = tokenizer.tokenize(original);
  const segments = mergeAuxiliarySegments(tokens.map(createSegment), tokens);
  const kana = joinKana(segments);

  return {
    original,
    kana,
    romaji: joinRomaji(segments),
    segments
  };
}
