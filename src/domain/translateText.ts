import type { LineBlock, TranslationProgress } from './types';

type TranslationResult = {
  translation_text: string;
};

type TranslationPipeline = (
  text: string,
  options?: { max_new_tokens?: number; num_beams?: number }
) => Promise<TranslationResult[]>;

type ProgressEvent = {
  status?: string;
  file?: string;
  progress?: number;
};

const modelId = 'Xenova/opus-mt-ja-en';

let translatorPromise: Promise<TranslationPipeline> | null = null;

function progressMessage(event: ProgressEvent): TranslationProgress {
  if (event.status === 'progress') {
    return {
      message: event.file
        ? `Loading ${event.file}`
        : 'Loading translation model',
      percent: event.progress
    };
  }

  if (event.status === 'ready') {
    return { message: 'Translation model ready' };
  }

  return { message: 'Loading translation model' };
}

async function loadTranslator(
  onProgress?: (progress: TranslationProgress) => void
): Promise<TranslationPipeline> {
  translatorPromise ??= import('@xenova/transformers').then(
    async ({ pipeline }) => {
      const translator = await pipeline('translation', modelId, {
        quantized: true,
        progress_callback: (event: ProgressEvent) =>
          onProgress?.(progressMessage(event))
      });

      return translator as TranslationPipeline;
    }
  );

  return translatorPromise;
}

export async function translateBlocks(
  blocks: LineBlock[],
  onProgress?: (progress: TranslationProgress) => void
): Promise<LineBlock[]> {
  const translator = await loadTranslator(onProgress);
  const translated: LineBlock[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    onProgress?.({
      message: `Translating line ${index + 1} of ${blocks.length}`
    });

    const result = await translator(blocks[index].original, {
      max_new_tokens: 96,
      num_beams: 1
    });

    translated.push({
      ...blocks[index],
      translation: result[0]?.translation_text?.trim() || ''
    });
  }

  return translated;
}
