import { isPositiveInteger } from './helper';

describe('helper', () => {
  it('should return true for positive number', () => {
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(178)).toBe(true);
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(1.8)).toBe(false);
    expect(isPositiveInteger(null)).toBe(false);
    expect(isPositiveInteger(undefined)).toBe(false);
    expect(isPositiveInteger('some')).toBe(false);
    expect(isPositiveInteger('2')).toBe(false);
  });
});
