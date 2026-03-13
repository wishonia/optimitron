import { useState, type FC } from 'react';
import type { CheckInCardProps } from '../types.js';

const SCALE_EMOJIS = ['😢', '😐', '🙂', '😊', '😄'] as const;

export const CheckInCard: FC<CheckInCardProps> = ({ onCheckIn }) => {
  const [health, setHealth] = useState<number | null>(null);
  const [happiness, setHappiness] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (health === null || happiness === null) return;
    setSubmitted(true);
    onCheckIn(health, happiness, note);
  };

  if (submitted) {
    return (
      <div className="opto-card opto-checkin-card opto-checkin-card--confirmed">
        <div className="opto-checkin-card__confirmation">
          Health: {SCALE_EMOJIS[health! - 1]} {health}/5 &middot; Happiness: {SCALE_EMOJIS[happiness! - 1]} {happiness}/5
        </div>
        {note && <div className="opto-checkin-card__note">{note}</div>}
      </div>
    );
  }

  return (
    <div className="opto-card opto-checkin-card">
      <div className="opto-checkin-card__header">Daily Check-In</div>
      <div className="opto-checkin-card__section">
        <div className="opto-checkin-card__label">Health</div>
        <div className="opto-checkin-card__buttons">
          {SCALE_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              className={`opto-checkin-card__btn ${health === i + 1 ? 'opto-checkin-card__btn--selected' : ''}`}
              onClick={() => setHealth(i + 1)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="opto-checkin-card__section">
        <div className="opto-checkin-card__label">Happiness</div>
        <div className="opto-checkin-card__buttons">
          {SCALE_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              className={`opto-checkin-card__btn ${happiness === i + 1 ? 'opto-checkin-card__btn--selected' : ''}`}
              onClick={() => setHappiness(i + 1)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <input
        className="opto-checkin-card__input"
        type="text"
        placeholder="Optional note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        className="opto-checkin-card__submit"
        onClick={handleSubmit}
        disabled={health === null || happiness === null}
        type="button"
      >
        Submit
      </button>
    </div>
  );
};
