import type { LineBlock as LineBlockType } from '../domain/types';

type LineBlockProps = {
  block: LineBlockType;
};

export function LineBlock({ block }: LineBlockProps) {
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
