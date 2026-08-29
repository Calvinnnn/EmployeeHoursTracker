import { calculateEarnings } from '../../../work-hours/js/calculations/earnings.js'
test('calculateEarnings', ()=>{
  expect(calculateEarnings(2,10)).toBe(20);
});
