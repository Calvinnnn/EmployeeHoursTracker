import { calculateHours } from '../../js/calculations/hours.js'

test('calculateHours returns hours', () => {
  expect(calculateHours('09:00','17:00')).toBe(8);
  expect(calculateHours('09:30','17:00')).toBe(7.5);
});
