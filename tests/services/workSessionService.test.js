import { vi, test, expect } from 'vitest';

vi.mock('../../js/db/database.js', () => ({
  db: {
    workSessions: {
      add: vi.fn(),
      orderBy: vi.fn()
    },
    settings: {
      get: vi.fn(),
      put: vi.fn()
    }
  }
}));

import { saveWorkSession } from '../../js/features/work-sessions/workSessionService.js';

test('workSessionService saveWorkSession is a function', () => {
  expect(typeof saveWorkSession).toBe('function');
});

