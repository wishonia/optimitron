/** Convert ISO 3166-1 alpha-2 to flag emoji. Falls back to alpha-2 code. */
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return code;

  const offset = 0x1F1E6 - 65; // 'A' = 65
  const first = code.charCodeAt(0);
  const second = code.charCodeAt(1);

  if (first < 65 || first > 90 || second < 65 || second > 90) return code;

  return String.fromCodePoint(first + offset, second + offset);
}
