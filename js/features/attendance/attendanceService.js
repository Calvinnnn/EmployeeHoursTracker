import {
    getAllWorkSessions
} from "../../db/repositories/workSessionRepository.js";

import {
    calculateHours
} from "../../calculations/hours.js";

/**
 * Get all attendance days with calculated hours.
 *
 * @returns {Promise<Array>}
 */
export async function getAttendanceDays() {
    const sessions = await getAllWorkSessions();

    return sessions.map((session) => ({
        ...session,
        totalHours: calculateHours(
            session.startTime,
            session.endTime
        )
    }));
}

/**
 * Calculate total hours for all attendance days.
 *
 * @returns {Promise<number>}
 */
export async function getTotalAttendanceHours() {
    const attendanceDays = await getAttendanceDays();

    return attendanceDays.reduce(
        (total, day) => total + day.totalHours,
        0
    );
}