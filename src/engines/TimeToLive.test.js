import { getTimeIndex } from './TimeToLive';

describe('TimeToLive (TTL) : getTimeIndex', () => {
  it('should index time to next upcoming interval', () => {
    const toMinute = val => val * 60 * 1000;

    const date1 = new Date('2020-06-14T03:23:34');
    expect(getTimeIndex({ time: date1.getTime(), interval: toMinute(5) })).toBe(
      new Date('2020-06-14T03:25:00').getTime(),
    );

    const date2 = new Date('2020-06-14T03:43:36');
    expect(getTimeIndex({ time: date2.getTime(), interval: toMinute(10) })).toBe(
      new Date('2020-06-14T03:50:00').getTime(),
    );

    const date3 = new Date('2020-06-14T03:43:36');
    expect(getTimeIndex({ time: date3.getTime(), interval: toMinute(3) })).toBe(
      new Date('2020-06-14T03:45:00').getTime(),
    );
  });
});
