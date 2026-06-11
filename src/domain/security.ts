export function toPlainText(value: string): string {
  return value.normalize('NFC');
}

export function isUnsafeHtmlProbe(value: string): boolean {
  return /<\s*\/?\s*(script|img|iframe|object|embed|svg|math)\b/i.test(value);
}

export async function copyPlainText(text: string): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API is not available in this browser.');
  }

  await navigator.clipboard.writeText(toPlainText(text));
}
