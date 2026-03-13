import type { FC } from "react";

interface MythBusterCardProps {
  finding: { myth: string; reality: string; grade: string };
}

export const MythBusterCard: FC<MythBusterCardProps> = ({ finding }) => (
  <div className="opto-card opto-myth-card">
    <div className="opto-myth-card__header">
      <span className={`opto-myth-card__grade opto-myth-card__grade--${finding.grade.toLowerCase()}`}>
        {finding.grade}
      </span>
      <span className="opto-myth-card__label">Myth vs Data</span>
    </div>
    <div className="opto-myth-card__myth">&ldquo;{finding.myth}&rdquo;</div>
    <div className="opto-myth-card__reality">{finding.reality}</div>
  </div>
);
