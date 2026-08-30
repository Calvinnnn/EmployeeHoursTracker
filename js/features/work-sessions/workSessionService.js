import {
    createWorkSession
} from "../../db/repositories/workSessionRepository.js";

import {
    calculateDuration
} from "../../calculations/hours.js";

import {
    validateWorkSession
} from "./workSessionValidation.js";

/**
 * Create and store a work session.
 *
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function saveWorkSession(data) {
    const validation = validateWorkSession(data);

    if (!validation.valid) {
        throw new Error(validation.errors.join(" "));
    }

    const startTime = Number(data.startTime);
    const endTime = Number(data.endTime);
    const durationMinutes = Number(data.durationMinutes ?? calculateDuration(startTime, endTime));

    const workSession = {
        id: data.id ?? crypto.randomUUID(),
        date: data.date,
        startTime,
        endTime,
        durationMinutes,
        createdAt: Date.now()
    };

    await createWorkSession(workSession);

    return workSession;
}