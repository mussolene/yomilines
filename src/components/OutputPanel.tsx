import type { LineBlock as LineBlockType, OutputMode } from '../domain/types';
import { LineBlock } from './LineBlock';

type OutputPanelProps = {
  blocks: LineBlockType[];
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
};

export function OutputPanel({ blocks, mode, onModeChange }: OutputPanelProps) {
  return (
    <section className="panel output-panel" aria-labelledby="output-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Output</p>
          <h2 id="output-title">Reading blocks</h2>
        </div>
        <div className="output-tools">
          <div className="segmented-control" aria-label="Output display mode">
            <button
              type="button"
              aria-pressed={mode === 'ruby'}
              onClick={() => onModeChange('ruby')}
            >
              Ruby
            </button>
            <button
              type="button"
              aria-pressed={mode === 'lines'}
              onClick={() => onModeChange('lines')}
            >
              Lines
            </button>
          </div>
          <span className="count">{blocks.length}</span>
        </div>
      </div>
      <div className="output-scroll" aria-live="polite">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <LineBlock
              key={`${block.original}-${index}`}
              block={block}
              mode={mode}
            />
          ))
        ) : (
          <p className="empty-state">Converted lines will appear here.</p>
        )}
      </div>
    </section>
  );
}
