export function getWishoniaBodyHeight(size: number): number {
  return Math.round(size * 0.57);
}

export function getWishoniaBodyOffsetX(size: number): number {
  return Math.max(2, Math.round(size * 0.03));
}
