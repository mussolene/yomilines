import type {
  IpadicFeatures,
  Tokenizer,
  TokenizerBuilderOption
} from 'kuromoji';

export type JapaneseTokenizer = Tokenizer<IpadicFeatures>;
export type JapaneseToken = IpadicFeatures;

type KuromojiModule = {
  builder(option: TokenizerBuilderOption): {
    build(
      callback: (error: Error | null, tokenizer: JapaneseTokenizer) => void
    ): void;
  };
};

let tokenizerPromise: Promise<JapaneseTokenizer> | null = null;

async function loadKuromoji(): Promise<KuromojiModule> {
  if (typeof window === 'undefined' || import.meta.env.MODE === 'test') {
    const packageName = 'kuro' + 'moji';
    return import(/* @vite-ignore */ packageName) as Promise<KuromojiModule>;
  }

  const module = await import('kuromoji/build/kuromoji.js');
  return module.default;
}

function getDictionaryPath(): string {
  if (typeof window === 'undefined' || import.meta.env.MODE === 'test') {
    return 'node_modules/kuromoji/dict';
  }

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${base}dict`;
}

export function getTokenizer(): Promise<JapaneseTokenizer> {
  tokenizerPromise ??= loadKuromoji().then(
    (kuromoji) =>
      new Promise((resolve, reject) => {
        kuromoji
          .builder({ dicPath: getDictionaryPath() })
          .build((error, tokenizer) => {
            if (error || !tokenizer) {
              reject(
                error instanceof Error
                  ? error
                  : new Error('Failed to initialize tokenizer.')
              );
              return;
            }

            resolve(tokenizer);
          });
      })
  );

  return tokenizerPromise;
}

export function resetTokenizerForTests(): void {
  tokenizerPromise = null;
}
