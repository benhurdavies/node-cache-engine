export function isPositiveInteger(value: number): value is number {
  return Number.isInteger(value) && value > 0;
}
