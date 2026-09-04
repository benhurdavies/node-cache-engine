export function isPositiveInteger(value: number): value is number {
  return Number.isInteger(value) && value > 0;
}

export function assertValidTtl(ttl: number): void {
  if (!Number.isFinite(ttl) || ttl <= 0) {
    throw new Error('ttl must be a finite number greater than zero');
  }
}
