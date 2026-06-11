export type LineBlock = {
  original: string;
  kana: string;
  romaji: string;
};

export type AppStatus = 'ready' | 'loading' | 'error' | 'copied';
