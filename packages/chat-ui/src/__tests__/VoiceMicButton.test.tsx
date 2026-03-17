import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VoiceMicButton } from '../components/VoiceMicButton.js';
import type { VoiceState } from '../types.js';

describe('VoiceMicButton', () => {
  it('renders with idle state', () => {
    render(<VoiceMicButton state="idle" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Talk to Wishonia');
  });

  it('shows correct label for each state', () => {
    const states: VoiceState[] = ['idle', 'connecting', 'listening', 'thinking', 'speaking', 'error'];
    const labels = [
      'Talk to Wishonia',
      'Connecting...',
      'Listening...',
      'Thinking...',
      'Wishonia speaking...',
      'Error — tap to retry',
    ];

    states.forEach((state, i) => {
      const { unmount } = render(<VoiceMicButton state={state} onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', labels[i]);
      unmount();
    });
  });

  it('calls onClick when clicked in idle state', () => {
    const onClick = vi.fn();
    render(<VoiceMicButton state="idle" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled during connecting state', () => {
    render(<VoiceMicButton state="connecting" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled during thinking state', () => {
    render(<VoiceMicButton state="thinking" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is not disabled during listening state', () => {
    render(<VoiceMicButton state="listening" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('adds active class for listening and speaking', () => {
    const { unmount } = render(<VoiceMicButton state="listening" onClick={vi.fn()} />);
    expect(screen.getByRole('button').className).toContain('opto-voice-mic--active');
    unmount();

    render(<VoiceMicButton state="speaking" onClick={vi.fn()} />);
    expect(screen.getByRole('button').className).toContain('opto-voice-mic--active');
  });

  it('respects disabled prop', () => {
    render(<VoiceMicButton state="idle" onClick={vi.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
