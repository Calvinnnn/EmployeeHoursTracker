import {
    getAllWorkSessions,
    deleteWorkSession
} from "../../db/repositories/workSessionRepository.js";

import { updateWorkSession } from "../../db/repositories/workSessionRepository.js";

import {
    calculateDuration,
    formatDuration
} from "../../calculations/hours.js";

import {
    formatTimeForDisplay
} from "../../calculations/dates.js";

/**
 * Get all attendance days with calculated hours.
 *
 * @returns {Promise<Array>}
 */
export async function getAttendanceDays() {
    const sessions = await getAllWorkSessions();

    return sessions.map((session) => {
        const totalMinutes = Number(session.durationMinutes ?? calculateDuration(session.startTime, session.endTime));

        return {
            ...session,
            totalMinutes,
            totalHours: totalMinutes / 60,
            readableDuration: formatDuration(totalMinutes),
            startDisplay: formatTimeForDisplay(session.startTime),
            endDisplay: formatTimeForDisplay(session.endTime)
        };
    });
}

/**
 * Calculate total hours for all attendance days.
 *
 * @returns {Promise<number>}
 */
export async function getTotalAttendanceHours() {
    const attendanceDays = await getAttendanceDays();

    return attendanceDays.reduce(
        (total, day) => total + (Number(day.totalMinutes) || 0),
        0
    ) / 60;
}

/**
 * Delete a single attendance record.
 *
 * @param {string} id
 */
export async function deleteAttendanceSession(id) {
    await deleteWorkSession(id);
}

/**
 * Update an attendance/work session with partial changes.
 * Preserves other fields and only updates provided keys.
 *
 * @param {string} id
 * @param {Object} changes
 */
export async function updateAttendanceSession(id, changes) {
    await updateWorkSession(id, changes);
}