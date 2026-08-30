/**
 * Calculate worked hours between two times.
 *
 * Supports legacy HH:MM strings and timestamp values saved in the database.
 *
 * @param {string|number} startTime
 * @param {string|number} endTime
 * @returns {number}
 */
export function calculateHours(startTime, endTime) {
    const startValue = Number(startTime);
    const endValue = Number(endTime);

    if (Number.isFinite(startValue) && Number.isFinite(endValue) && endValue > startValue) {
        return (endValue - startValue) / 3600000;
    }

    if (typeof startTime === "string" && typeof endTime === "string") {
        const startTimeMatch = startTime.match(/^(\d{1,2}):(\d{2})$/);
        const endTimeMatch = endTime.match(/^(\d{1,2}):(\d{2})$/);

        if (!startTimeMatch || !endTimeMatch) {
            return 0;
        }

        const startTotalMinutes = Number(startTimeMatch[1]) * 60 + Number(startTimeMatch[2]);
        const endTotalMinutes = Number(endTimeMatch[1]) * 60 + Number(endTimeMatch[2]);
        const diffMinutes = endTotalMinutes >= startTotalMinutes
            ? endTotalMinutes - startTotalMinutes
            : (24 * 60) - (startTotalMinutes - endTotalMinutes);

        return Math.max(0, diffMinutes / 60);
    }

    return 0;
}

/**
 * Calculate difference in minutes between two timestamps.
 *
 * @param {string|number} startTimestamp
 * @param {string|number} endTimestamp
 * @returns {number}
 */
export function calculateDuration(startTimestamp, endTimestamp) {
    const startValue = Number(startTimestamp);
    const endValue = Number(endTimestamp);

    if (!Number.isFinite(startValue) || !Number.isFinite(endValue) || endValue <= startValue) {
        return 0;
    }

    return Math.round((endValue - startValue) / 60000);
}

/**
 * Format a duration in minutes into a readable string.
 *
 * @param {number} totalMinutes
 * @returns {string}
 */
export function formatDuration(totalMinutes) {
    const total = Number(totalMinutes);

    if (!Number.isFinite(total) || total <= 0) {
        return "0m";
    }

    const wholeHours = Math.floor(total / 60);
    const minutes = total % 60;

    if (wholeHours > 0 && minutes > 0) {
        return `${wholeHours}h ${minutes}m`;
    }

    if (wholeHours > 0) {
        return `${wholeHours}h`;
    }

    return `${minutes}m`;
}