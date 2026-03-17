import type { FC } from 'react';
import type { VoiceState } from '../types.js';

export interface VoiceMicButtonProps {
  state: VoiceState;
  onClick: () => void;
  disabled?: boolean;
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Talk to Wishonia',
  connecting: 'Connecting...',
  listening: 'Listening...',
  thinking: 'Thinking...',
  speaking: 'Wishonia speaking...',
  error: 'Error — tap to retry',
};

const STATE_ICONS: Record<VoiceState, string> = {
  idle: '\u{1F3A4}',       // microphone
  connecting: '\u{23F3}',  // hourglass
  listening: '\u{1F534}',  // red circle (recording)
  thinking: '\u{1F914}',   // thinking face
  speaking: '\u{1F50A}',   // speaker high volume
  error: '\u{26A0}',       // warning
};

/**
 * Mic toggle button with neobrutalist styling.
 * States: idle | connecting | listening | thinking | speaking | error
 */
export const VoiceMicButton: FC<VoiceMicButtonProps> = ({ state, onClick, disabled }) => {
  const isActive = state === 'listening' || state === 'speaking';

  return (
    <button
      className={`opto-voice-mic ${isActive ? 'opto-voice-mic--active' : ''} opto-voice-mic--${state}`}
      onClick={onClick}
      disabled={disabled || state === 'connecting' || state === 'thinking'}
      aria-label={STATE_LABELS[state]}
      title={STATE_LABELS[state]}
      type="button"
    >
      <span className="opto-voice-mic__icon">{STATE_ICONS[state]}</span>
      <span className="opto-voice-mic__label">{STATE_LABELS[state]}</span>
    </button>
  );
};
