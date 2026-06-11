import { toRomaji } from 'wanakana';

export function kanaToRomaji(kana: string): string {
  return toRomaji(kana, { upcaseKatakana: false });
}
