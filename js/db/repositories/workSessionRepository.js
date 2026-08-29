import { db } from "../database.js";

/**
 * Save a work session to IndexedDB.
 *
 * @param {Object} workSession
 * @returns {Promise<number>}
 */
export async function createWorkSession(workSession) {
    return await db.workSessions.add(workSession);
}

/**
 * Get all work sessions.
 *
 * @returns {Promise<Array>}
 */
export async function getAllWorkSessions() {
    return await db.workSessions
        .orderBy("date")
        .reverse()
        .toArray();
}

/**
 * Get one work session by ID.
 *
 * @param {number} id
 * @returns {Promise<Object|undefined>}
 */
export async function getWorkSessionById(id) {
    return await db.workSessions.get(id);
}

/**
 * Delete a work session.
 *
 * @param {number} id
 */
export async function deleteWorkSession(id) {
    await db.workSessions.delete(id);
}

/**
 * Update a work session.
 *
 * @param {number} id
 * @param {Object} changes
 */
export async function updateWorkSession(id, changes) {
    await db.workSessions.update(id, changes);
}