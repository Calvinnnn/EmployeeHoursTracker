/**
 * Calculate worked hours between two times.
 *
 * @param {string} startTime
 * @param {string} endTime
 * @returns {number}
 */
export function calculateHours(
    startTime,
    endTime
) {
    const [startHour, startMinute] =
        startTime.split(":").map(Number);

    const [endHour, endMinute] =
        endTime.split(":").map(Number);

    const startTotalMinutes =
        startHour * 60 + startMinute;

    const endTotalMinutes =
        endHour * 60 + endMinute;

    const difference =
        endTotalMinutes - startTotalMinutes;

    return difference / 60;
}