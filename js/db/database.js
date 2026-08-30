// Use browser-compatible ES module build of Dexie from CDN
import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.mjs";

export const db = new Dexie("EmployeeHoursTracker");

db.version(2).stores({
    workSessions: "id, date, startTime, endTime, durationMinutes, createdAt",
    settings: "key",
    drafts: "id, createdAt, updatedAt"
});