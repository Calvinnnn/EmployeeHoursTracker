/**
 * Validate a work session before saving.
 *
 * @param {Object} workSession
 * @returns {{valid: boolean, errors: string[]}}
 */
function normalizeComparableValue(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed) {
            return null;
        }

        if (/^\d+$/.test(trimmed)) {
            const numeric = Number(trimmed);
            return Number.isFinite(numeric) ? numeric : null;
        }

        const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) {
            return null;
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) {
            return null;
        }

        return hours * 60 + minutes;
    }

    return null;
}

export function validateWorkSession(workSession) {
    const errors = [];

    if (!workSession.date) {
        errors.push("Work date is required.");
    }

    const startValue = normalizeComparableValue(workSession.startTime);
    const endValue = normalizeComparableValue(workSession.endTime);

    if (startValue === null) {
        errors.push("Arrival time is required.");
    }

    if (endValue === null) {
        errors.push("Leaving time is required.");
    }

    if (startValue !== null && endValue !== null && endValue <= startValue) {
        errors.push("Leaving time must be after arrival time.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}