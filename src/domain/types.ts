export type ReadingSegmentKind = 'word' | 'space' | 'punctuation';

export type ReadingSegment = {
  original: string;
  kana: string;
  romaji: string;
  kind: ReadingSegmentKind;
};

export type LineBlock = {
  original: string;
  kana: string;
  romaji: string;
  translation?: string;
  segments: ReadingSegment[];
};

export type AppStatus =
  | 'ready'
  | 'loading'
  | 'translating'
  | 'error'
  | 'copied';

export type OutputMode = 'ruby' | 'lines';

export type TranslationProgress = {
  message: string;
  percent?: number;
};
