import Dexie from "dexie";

export const db = new Dexie("EmployeeHoursTracker");

db.version(1).stores({
    workSessions: "++id, date, startTime, endTime",
    settings: "key",
    drafts: "++id, createdAt"
});