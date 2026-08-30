// Dexie is vendored locally (npm) so the app has no external runtime dependency
// and still works offline once the service worker has cached the app shell.
import Dexie from "dexie";

export const db = new Dexie("EmployeeHoursTracker");

db.version(3).stores({
    workSessions: "id, date, startTime, endTime, durationMinutes, createdAt",
    settings: "key",
    drafts: "id, status, createdAt, updatedAt"
});