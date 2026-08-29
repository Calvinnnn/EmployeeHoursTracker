/**
 * Validate a work session before saving.
 *
 * @param {Object} workSession
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateWorkSession(workSession) {
    const errors = [];

    if (!workSession.date) {
        errors.push("Work date is required.");
    }

    if (!workSession.startTime) {
        errors.push("Arrival time is required.");
    }

    if (!workSession.endTime) {
        errors.push("Leaving time is required.");
    }

    if (
        workSession.startTime &&
        workSession.endTime &&
        workSession.startTime >= workSession.endTime
    ) {
        errors.push("Leaving time must be after arrival time.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}