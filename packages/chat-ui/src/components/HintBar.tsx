import type { FC } from 'react';
import type { HintBarProps } from '../types.js';

export const HintBar: FC<HintBarProps> = ({ buttons, onHintClick }) => (
  <div className="opto-hint-bar">
    {buttons.map((btn) => (
      <button
        key={btn.action}
        className="opto-hint-bar__chip"
        onClick={() => onHintClick(btn.action)}
        type="button"
      >
        {btn.label}
      </button>
    ))}
  </div>
);
