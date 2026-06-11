import { toRomaji } from 'wanakana';

export function kanaToRomaji(kana: string): string {
  return toRomaji(kana, { upcaseKatakana: false });
}

const smallKana = new Set([
  'ゃ',
  'ゅ',
  'ょ',
  'ぁ',
  'ぃ',
  'ぅ',
  'ぇ',
  'ぉ',
  'ゎ',
  'ャ',
  'ュ',
  'ョ',
  'ァ',
  'ィ',
  'ゥ',
  'ェ',
  'ォ',
  'ヮ'
]);

function isSmallTsu(char: string): boolean {
  return char === 'っ' || char === 'ッ';
}

function doubleInitialConsonant(romaji: string): string {
  const first = romaji.match(/[bcdfghjklmnpqrstvwxyz]/i)?.[0];
  return first ? `${first.toLowerCase()}${romaji}` : romaji;
}

export function kanaToSpacedRomaji(kana: string): string {
  const morae: string[] = [];

  for (const char of kana) {
    if (smallKana.has(char) && morae.length > 0) {
      morae[morae.length - 1] = `${morae[morae.length - 1]}${char}`;
      continue;
    }

    if (isSmallTsu(char) && morae.length > 0) {
      morae[morae.length - 1] = `${morae[morae.length - 1]}${char}`;
      continue;
    }

    morae.push(char);
  }

  return morae
    .map((mora, index) => {
      if (mora.endsWith('っ') || mora.endsWith('ッ')) {
        const base = mora.slice(0, -1);
        const next = morae[index + 1];
        const nextRomaji = next ? kanaToRomaji(next) : '';
        return `${kanaToRomaji(base)}${doubleInitialConsonant(nextRomaji).charAt(0)}`;
      }

      return kanaToRomaji(mora);
    })
    .filter(Boolean)
    .join(' ');
}
