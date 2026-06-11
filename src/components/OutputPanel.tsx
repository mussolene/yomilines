import type { LineBlock as LineBlockType } from '../domain/types';
import { LineBlock } from './LineBlock';

type OutputPanelProps = {
  blocks: LineBlockType[];
};

export function OutputPanel({ blocks }: OutputPanelProps) {
  return (
    <section className="panel output-panel" aria-labelledby="output-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Output</p>
          <h2 id="output-title">Reading blocks</h2>
        </div>
        <span className="count">{blocks.length}</span>
      </div>
      <div className="output-scroll" aria-live="polite">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <LineBlock key={`${block.original}-${index}`} block={block} />
          ))
        ) : (
          <p className="empty-state">Converted lines will appear here.</p>
        )}
      </div>
    </section>
  );
}
