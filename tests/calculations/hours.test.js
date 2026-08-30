import { test, expect } from 'vitest';
import {
  calculateHours,
  calculateDuration,
  formatDuration
} from '../../js/calculations/hours.js';

test('calculateHours returns hours', () => {
  expect(calculateHours('09:00','17:00')).toBe(8);
  expect(calculateHours('09:30','17:00')).toBe(7.5);
});

test('calculateDuration supports timestamp-based attendance records', () => {
  const start = new Date('2026-08-29T12:02:00').getTime();
  const end = new Date('2026-08-29T14:06:00').getTime();

  expect(calculateDuration(start, end)).toBe(124);
  expect(calculateHours(start, end)).toBeCloseTo(2.0666666667, 10);
});

test('formatDuration formats hours and minutes correctly', () => {
  expect(formatDuration(124)).toBe('2h 4m');
  expect(formatDuration(61)).toBe('1h 1m');
  expect(formatDuration(180)).toBe('3h');
});

