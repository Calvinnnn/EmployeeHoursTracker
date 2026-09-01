import { vi, test, expect } from 'vitest';

vi.mock('../../js/db/database.js', () => ({
  db: {
    workSessions: {
      update: vi.fn(),
      get: vi.fn()
    }
  }
}));

import { updateAttendanceSession } from '../../js/features/attendance/attendanceService.js';
import { db } from '../../js/db/database.js';

test('updateAttendanceSession calls repository update with id and changes', async () => {
  await updateAttendanceSession('abc-123', { startTime: 1, endTime: 2, durationMinutes: 60 });

  expect(db.workSessions.update).toHaveBeenCalledWith('abc-123', { startTime: 1, endTime: 2, durationMinutes: 60 });
});
