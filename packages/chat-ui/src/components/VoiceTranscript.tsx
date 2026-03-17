import type { FC } from 'react';

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  /** Whether this entry is still being streamed */
  partial?: boolean;
}

export interface VoiceTranscriptProps {
  entries: TranscriptEntry[];
}

/**
 * Real-time transcript display for voice conversations.
 * Shows both user and assistant speech as chat-style bubbles.
 */
export const VoiceTranscript: FC<VoiceTranscriptProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="opto-voice-transcript" role="log" aria-live="polite" aria-label="Voice transcript">
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`opto-voice-transcript__entry opto-voice-transcript__entry--${entry.role}`}
        >
          <span className="opto-voice-transcript__role">
            {entry.role === 'user' ? 'You' : 'Wishonia'}
          </span>
          <span className={`opto-voice-transcript__text ${entry.partial ? 'opto-voice-transcript__text--partial' : ''}`}>
            {entry.text}
          </span>
        </div>
      ))}
    </div>
  );
};
