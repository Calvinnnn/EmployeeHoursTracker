import { vi, test, expect } from 'vitest';

vi.mock('../../js/db/database.js', () => ({
  db: {
    workSessions: {
      add: vi.fn(),
      orderBy: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      get: vi.fn()
    },
    drafts: {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    },
    settings: {
      get: vi.fn(),
      put: vi.fn()
    }
  }
}));

import { saveWorkSession } from '../../js/features/work-sessions/workSessionService.js';
import { draftRepository } from '../../js/db/repositories/draftRepository.js';
import { db } from '../../js/db/database.js';

test('workSessionService saveWorkSession is a function', () => {
  expect(typeof saveWorkSession).toBe('function');
});

test('draftRepository persists the active attendance session with a status marker', async () => {
  const startTime = Date.now();

  await draftRepository.save({
    date: '2026-08-30',
    startTime,
    endTime: null
  });

  expect(db.drafts.put).toHaveBeenCalledWith(expect.objectContaining({
    id: 'active-session',
    status: 'active',
    date: '2026-08-30',
    startTime,
    endTime: null
  }));
});

