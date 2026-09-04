/** A whole number greater than zero. */
export type PositiveInteger = number;

/** A time to live in milliseconds. Always a positive integer: `Date.now()` is integral, so a fraction buys nothing. */
export type Ttl = PositiveInteger;

export function isPositiveInteger(val: unknown): val is PositiveInteger {
  return typeof val === 'number' && Number.isInteger(val) && val > 0;
}

export function assertTtl(val: unknown): asserts val is Ttl {
  if (!isPositiveInteger(val)) {
    throw new Error('ttl must be a positive integer (milliseconds)');
  }
}
