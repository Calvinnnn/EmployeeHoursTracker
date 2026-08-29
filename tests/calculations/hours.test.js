import { calculateHours } from '../../../work-hours/js/calculations/hours.js'
test('calculateHours returns hours', ()=>{
  expect(calculateHours('2020-01-01T00:00','2020-01-01T02:00')).toBe(2);
});
