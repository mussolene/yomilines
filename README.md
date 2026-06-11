# yomilines

yomilines is a client-only static web app for reading Japanese lyrics and text. Paste multiline Japanese text and it outputs each non-empty line as a compact block:

```text
original line
kana reading line
romaji line
```

Translation is optional and experimental. The core reading flow does not call AI or translation APIs; clicking Translate downloads a public browser model and runs it locally.

## Features

- Japanese morphological analysis in the browser with `kuromoji`.
- Kana conversion and romaji generation with `wanakana`.
- Mixed Japanese, Latin words, numbers, punctuation, emoji, and spacing are preserved where the tokenizer exposes them.
- Ruby-style preview mode groups each token with small romaji above and kana below.
- Line preview mode keeps the original three-line block view.
- Optional Japanese-to-English translation can add a fourth line using a browser-loaded Transformers.js model.
- Copy output as plain Markdown text.
- Responsive two-pane layout with light and dark color schemes.
- Static GitHub Pages deployment with no backend, cookies, sessions, or secrets.

## Limitations

- Readings depend on the bundled IPADIC dictionary used by `kuromoji`; unusual names, ateji, stylized lyrics, or slang can be wrong.
- Romaji is derived from the kana reading line, not from a separate pronunciation model.
- Empty lines are ignored for conversion, while copied blocks are separated by blank lines.
- Ruby-style romaji is split by kana mora for readability; copied Markdown still uses normal romaji words.
- Translation is Japanese-to-English only, experimental, and depends on a roughly 110 MB model download the first time it is used.
- Offline use is possible after the page and dictionary assets have been loaded by the browser, subject to browser caching behavior.

## Architecture

- `src/domain/convertText.ts`: splits input into non-empty lines and converts them.
- `src/domain/convertLine.ts`: converts one line into `{ original, kana, romaji }`.
- `src/domain/tokenizer.ts`: initializes the `kuromoji` tokenizer once and reuses it.
- `src/domain/markdown.ts`: exports line blocks as plain text Markdown.
- `src/domain/translateText.ts`: lazily loads the optional in-browser translation model.
- `src/domain/security.ts`: plain-text normalization and clipboard handling.
- `src/components/*`: presentation-focused React components.

The tokenizer dictionary is copied from `node_modules/kuromoji/dict` into the built static assets under `dict/`.

## Security Model

All user input is treated as untrusted text. The app renders React text nodes only, avoids `dangerouslySetInnerHTML`, does not use `eval` or `new Function`, and has no inline event handlers. Clipboard writes use plain text.

The optional translation feature does not use API keys or secrets. It downloads a public ONNX model from Hugging Face when the user clicks Translate, then runs inference in the browser. This path depends on ONNX Runtime Web through `@xenova/transformers`; if you deploy a strict CSP, test translation carefully because some ONNX Runtime builds require eval-like WebAssembly/bootstrap behavior.

CSRF is not applicable in v1 because there is no authentication, cookies, sessions, or state-changing backend. This is documented explicitly so future server-backed features revisit the threat model.

Recommended Content Security Policy for static hosting:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none';
```

`style-src 'unsafe-inline'` is included because Vite injects CSS through the bundled app in development and many static hosts apply one policy to all environments. Tighten it if your hosting setup emits only external CSS and can use hashes.

If you keep the experimental translation feature, `connect-src` must also allow `https://huggingface.co` for the first model download unless you self-host the model files. Depending on the runtime build, `script-src 'unsafe-eval'` may also be required for translation; avoid adding it unless translation has been tested and accepted as a deliberate tradeoff.

## Accessibility

- Semantic regions, labels, and status messages.
- Keyboard-accessible controls with visible focus states.
- Touch targets sized at least 44px.
- Contrast-oriented light and dark CSS variables.
- Status is conveyed with text, not color alone.

## Development

```bash
npm install
npm run dev
npm run test
npm run build
```

Other commands:

```bash
npm run lint
npm run typecheck
npm run test:watch
npm run format
npm run format:check
npm run preview
```

## GitHub Pages Deployment

This repository is configured for GitHub Pages using GitHub Actions.

1. Push the repository to GitHub as `yomilines`.
2. In GitHub, open Settings -> Pages.
3. Set Build and deployment -> Source to GitHub Actions.
4. Push to `main` or run the `Deploy GitHub Pages` workflow manually.

The Vite base path is:

```ts
base: process.env.GITHUB_PAGES === 'true' ? '/yomilines/' : '/';
```

If you rename the repository, update `/yomilines/` in `vite.config.ts` to match the new repository name, then rebuild and redeploy.

## Contributing

- Keep v1 client-only and deterministic.
- Keep domain logic in `src/domain`.
- Add tests for conversion, security, and UI behavior when changing behavior.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before opening a pull request.
