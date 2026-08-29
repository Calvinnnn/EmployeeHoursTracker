import { test, expect } from 'vitest';
import { validateWorkSession } from '../../js/features/work-sessions/workSessionValidation.js';

test('validateWorkSession validates valid session', () => {
  const result = validateWorkSession({
    date: '2026-08-29',
    startTime: '09:00',
    endTime: '17:00'
  });
  expect(result.valid).toBe(true);
  expect(result.errors.length).toBe(0);
});

test('validateWorkSession rejects missing date', () => {
  const result = validateWorkSession({
    startTime: '09:00',
    endTime: '17:00'
  });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Work date is required.');
});

test('validateWorkSession rejects missing start time', () => {
  const result = validateWorkSession({
    date: '2026-08-29',
    endTime: '17:00'
  });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Arrival time is required.');
});

test('validateWorkSession rejects missing end time', () => {
  const result = validateWorkSession({
    date: '2026-08-29',
    startTime: '09:00'
  });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Leaving time is required.');
});

test('validateWorkSession rejects end time before start time', () => {
  const result = validateWorkSession({
    date: '2026-08-29',
    startTime: '17:00',
    endTime: '09:00'
  });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Leaving time must be after arrival time.');
});

test('validateWorkSession rejects equal start and end time', () => {
  const result = validateWorkSession({
    date: '2026-08-29',
    startTime: '09:00',
    endTime: '09:00'
  });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Leaving time must be after arrival time.');
});
