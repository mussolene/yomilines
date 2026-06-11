type ToolbarProps = {
  canCopy: boolean;
  canConvert: boolean;
  onClear: () => void;
  onConvert: () => void;
  onCopy: () => void;
  onLoadSample: () => void;
};

export function Toolbar({
  canCopy,
  canConvert,
  onClear,
  onConvert,
  onCopy,
  onLoadSample
}: ToolbarProps) {
  return (
    <div className="toolbar" aria-label="Text actions">
      <button
        type="button"
        className="button button-primary"
        onClick={onConvert}
        disabled={!canConvert}
      >
        Convert
      </button>
      <button
        type="button"
        className="button"
        onClick={onCopy}
        disabled={!canCopy}
      >
        Copy Markdown
      </button>
      <button type="button" className="button" onClick={onLoadSample}>
        Load sample
      </button>
      <button type="button" className="button button-quiet" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
