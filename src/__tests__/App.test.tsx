import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../App';

describe('App', () => {
  it('renders and copies converted output as plain text', async () => {
    const writeText = vi
      .fn<Clipboard['writeText']>()
      .mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
    expect(await screen.findByText('a ka ri')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Copy Markdown' })
    );

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0]?.[0]).toContain('明かり');
    expect(writeText.mock.calls[0]?.[0]).toContain('akari');
  });

  it('renders script and image payloads as text only', async () => {
    render(<App />);

    const input = screen.getByLabelText('Paste multiline Japanese text');
    await userEvent.clear(input);
    await userEvent.type(
      input,
      '<script>alert(1)</script>{enter}<img src=x onerror=alert(1)>'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Convert' }));
    await userEvent.click(screen.getByRole('button', { name: 'Lines' }));

    const output = await screen.findAllByText('<script>alert(1)</script>');
    expect(output.length).toBeGreaterThan(0);
    expect(
      within(screen.getByLabelText('Text actions')).queryByText(
        '<script>alert(1)</script>'
      )
    ).toBeNull();
    expect(document.querySelector('script')).toBeNull();
    expect(document.querySelector('img')).toBeNull();
  });
});
