import {
    createWorkSession
} from "../../db/repositories/workSessionRepository.js";

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

    const workSession = {
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        createdAt: new Date().toISOString()
    };

    const id = await createWorkSession(workSession);

    return {
        id,
        ...workSession
    };
}