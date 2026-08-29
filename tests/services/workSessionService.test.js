import { saveWorkSession } from '../../js/features/work-sessions/workSessionService.js'

test('workSessionService saveWorkSession is a function', () => {
  expect(typeof saveWorkSession).toBe('function');
});
