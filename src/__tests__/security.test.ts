import { describe, expect, it, vi } from 'vitest';
import { blocksToMarkdown } from '../domain/markdown';
import {
  copyPlainText,
  isUnsafeHtmlProbe,
  toPlainText
} from '../domain/security';

describe('security helpers', () => {
  it('does not escape into HTML; input remains plain text for React text nodes', () => {
    const payload = '<script>alert(1)</script><img src=x onerror=alert(1)>';

    expect(toPlainText(payload)).toBe(payload);
    expect(isUnsafeHtmlProbe(payload)).toBe(true);
  });

  it('copies HTML-looking and markdown-looking content as plain text', async () => {
    const writeText = vi
      .fn<Clipboard['writeText']>()
      .mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    const text = blocksToMarkdown([
      {
        original: '<img src=x onerror=alert(1)>',
        kana: '<script>alert(1)</script>',
        romaji: '[x](javascript:alert(1))',
        segments: [
          {
            original: '<img src=x onerror=alert(1)>',
            kana: '<script>alert(1)</script>',
            romaji: '[x](javascript:alert(1))',
            kind: 'word'
          }
        ]
      }
    ]);

    await copyPlainText(text);

    expect(writeText).toHaveBeenCalledWith(
      '<img src=x onerror=alert(1)>\n<script>alert(1)</script>\n[x](javascript:alert(1))'
    );
  });
});
