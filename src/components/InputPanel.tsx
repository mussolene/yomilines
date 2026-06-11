import { Toolbar } from './Toolbar';

type InputPanelProps = {
  canCopy: boolean;
  canConvert: boolean;
  canTranslate: boolean;
  input: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onConvert: () => void;
  onCopy: () => void;
  onLoadSample: () => void;
  onTranslate: () => void;
};

export function InputPanel({
  canCopy,
  canConvert,
  canTranslate,
  input,
  onChange,
  onClear,
  onConvert,
  onCopy,
  onLoadSample,
  onTranslate
}: InputPanelProps) {
  return (
    <section className="panel" aria-labelledby="input-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Input</p>
          <h2 id="input-title">Japanese text</h2>
        </div>
      </div>
      <label className="textarea-label" htmlFor="source-text">
        Paste multiline Japanese text
      </label>
      <textarea
        id="source-text"
        value={input}
        onChange={(event) => onChange(event.target.value)}
        placeholder="明かりの灯ったmidnight エゴと欲と未練が行き交う"
        spellCheck={false}
      />
      <Toolbar
        canCopy={canCopy}
        canConvert={canConvert}
        canTranslate={canTranslate}
        onClear={onClear}
        onConvert={onConvert}
        onCopy={onCopy}
        onLoadSample={onLoadSample}
        onTranslate={onTranslate}
      />
    </section>
  );
}
