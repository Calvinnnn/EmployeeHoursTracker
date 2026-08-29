import { test, expect } from 'vitest';
import { calculateEarnings } from '../../js/calculations/earnings.js';

test('calculateEarnings', () => {
  expect(calculateEarnings(2, 10)).toBe(20);
});

