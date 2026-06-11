import { useMemo, useState } from 'react';
import { ErrorView } from './components/ErrorView';
import { InputPanel } from './components/InputPanel';
import { LoadingView } from './components/LoadingView';
import { OutputPanel } from './components/OutputPanel';
import { blocksToMarkdown } from './domain/markdown';
import { copyPlainText } from './domain/security';
import { convertText } from './domain/convertText';
import type { AppStatus, LineBlock, OutputMode } from './domain/types';

const sampleText = `明かりの灯ったmidnight エゴと欲と未練が行き交う
静かな夜に君を探してる`;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export function App() {
  const [input, setInput] = useState(sampleText);
  const [blocks, setBlocks] = useState<LineBlock[]>([]);
  const [status, setStatus] = useState<AppStatus>('ready');
  const [outputMode, setOutputMode] = useState<OutputMode>('ruby');
  const [error, setError] = useState<string>('');
  const markdown = useMemo(() => blocksToMarkdown(blocks), [blocks]);
  const isLoading = status === 'loading';

  async function handleConvert() {
    setStatus('loading');
    setError('');

    try {
      const converted = await convertText(input);
      setBlocks(converted);
      setStatus('ready');
    } catch (caught) {
      setError(errorMessage(caught));
      setStatus('error');
    }
  }

  async function handleCopy() {
    try {
      await copyPlainText(markdown);
      setStatus('copied');
      setError('');
    } catch (caught) {
      setError(errorMessage(caught));
      setStatus('error');
    }
  }

  function handleClear() {
    setInput('');
    setBlocks([]);
    setError('');
    setStatus('ready');
  }

  function handleLoadSample() {
    setInput(sampleText);
    setError('');
    setStatus('ready');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Client-only reader</p>
          <h1>yomilines</h1>
        </div>
        <p className="header-copy">
          Original, kana, and romaji blocks for Japanese lyrics and text.
        </p>
      </header>

      <div className="workspace">
        <InputPanel
          canCopy={blocks.length > 0 && !isLoading}
          canConvert={input.trim().length > 0 && !isLoading}
          input={input}
          onChange={setInput}
          onClear={handleClear}
          onConvert={handleConvert}
          onCopy={handleCopy}
          onLoadSample={handleLoadSample}
        />
        <OutputPanel
          blocks={blocks}
          mode={outputMode}
          onModeChange={setOutputMode}
        />
      </div>

      <footer className="app-footer">
        {isLoading ? <LoadingView /> : null}
        {status === 'copied' ? (
          <p className="status" role="status">
            Copied Markdown to clipboard.
          </p>
        ) : null}
        {status === 'ready' ? (
          <p className="status" role="status">
            Ready. No translation, tracking, or external API calls.
          </p>
        ) : null}
        {status === 'error' ? <ErrorView message={error} /> : null}
      </footer>
    </main>
  );
}
