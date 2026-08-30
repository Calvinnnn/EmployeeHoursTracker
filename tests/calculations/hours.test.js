import { test, expect } from 'vitest';
import {
  calculateHours,
  calculateDuration,
  formatDuration
} from '../../js/calculations/hours.js';
import { formatTimeForDisplay } from '../../js/calculations/dates.js';

test('calculateHours returns hours', () => {
  expect(calculateHours('09:00','17:00')).toBe(8);
  expect(calculateHours('09:30','17:00')).toBe(7.5);
});

test('calculateHours supports overnight times', () => {
  expect(calculateHours('22:00','02:00')).toBe(4);
  expect(calculateHours('23:30','00:15')).toBe(0.75);
});

test('calculateDuration supports timestamp-based attendance records', () => {
  const start = new Date('2026-08-29T12:02:00').getTime();
  const end = new Date('2026-08-29T14:06:00').getTime();

  expect(calculateDuration(start, end)).toBe(124);
  expect(calculateHours(start, end)).toBeCloseTo(2.0666666667, 10);
});

test('formatTimeForDisplay converts 24-hour values to 12-hour display', () => {
  expect(formatTimeForDisplay('22:13')).toBe('10:13');
  expect(formatTimeForDisplay('00:05')).toBe('12:05');
  expect(formatTimeForDisplay('13:00')).toBe('1:00');
});

test('formatDuration formats hours and minutes correctly', () => {
  expect(formatDuration(124)).toBe('2h 4m');
  expect(formatDuration(61)).toBe('1h 1m');
  expect(formatDuration(180)).toBe('3h');
  expect(formatDuration(45)).toBe('45m');
  expect(formatDuration(30)).toBe('30m');
  expect(formatDuration(1)).toBe('1m');
});

