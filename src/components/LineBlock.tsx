import type {
  LineBlock as LineBlockType,
  OutputMode,
  ReadingSegment
} from '../domain/types';

type LineBlockProps = {
  block: LineBlockType;
  mode: OutputMode;
};

function shouldShowReading(segment: ReadingSegment): boolean {
  return (
    segment.kind === 'word' &&
    segment.original.trim().length > 0 &&
    (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(
      segment.original
    ) ||
      segment.original !== segment.kana)
  );
}

export function LineBlock({ block, mode }: LineBlockProps) {
  if (mode === 'ruby') {
    return (
      <article className="line-block ruby-line" lang="ja">
        {block.segments.map((segment, index) =>
          segment.kind === 'space' ? (
            <span
              className="ruby-space"
              key={`${segment.original}-${index}`}
              aria-hidden="true"
            />
          ) : (
            <span
              className={`ruby-segment ruby-${segment.kind}`}
              key={`${segment.original}-${index}`}
            >
              <span className="ruby-romaji" lang="en">
                {shouldShowReading(segment) ? segment.romaji : ''}
              </span>
              <span className="ruby-original">{segment.original}</span>
              <span className="ruby-kana" lang="ja-Hira">
                {shouldShowReading(segment) ? segment.kana : ''}
              </span>
            </span>
          )
        )}
      </article>
    );
  }

  return (
    <article className="line-block">
      <p lang="ja">{block.original}</p>
      <p lang="ja-Hira">{block.kana}</p>
      <p lang="en" className="romaji">
        {block.romaji}
      </p>
    </article>
  );
}
