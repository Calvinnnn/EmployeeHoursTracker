import { db } from "../database.js";

/**
 * Save a work session to IndexedDB.
 *
 * @param {Object} workSession
 * @returns {Promise<string>}
 */
export async function createWorkSession(workSession) {
    const id = workSession.id ?? crypto.randomUUID();
    await db.workSessions.put({
        ...workSession,
        id
    });
    return id;
}

/**
 * Get all work sessions.
 *
 * @returns {Promise<Array>}
 */
export async function getAllWorkSessions() {
    const sessions = await db.workSessions
        .orderBy("date")
        .reverse()
        .toArray();

    return sessions.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
}

/**
 * Get one work session by ID.
 *
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
export async function getWorkSessionById(id) {
    return await db.workSessions.get(id);
}

/**
 * Delete a work session.
 *
 * @param {string} id
 */
export async function deleteWorkSession(id) {
    await db.workSessions.delete(id);
}

/**
 * Update a work session.
 *
 * @param {string} id
 * @param {Object} changes
 */
export async function updateWorkSession(id, changes) {
    await db.workSessions.update(id, changes);
}