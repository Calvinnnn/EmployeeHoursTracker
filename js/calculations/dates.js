/**
 * Dev 3
 * Date utilities.
 */

/**
 * Get today's date in ISO format.
 *
 * @returns {string}
 * Example: "2026-08-29"
 */
export function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Format an ISO date for display.
 *
 * @param {string} isoDate
 * @returns {string}
 *
 * Example:
 * "2026-08-29" -> "08/29/2026"
 */
export function formatDateForDisplay(isoDate) {
    const [year, month, day] = isoDate.split("-");

    return `${month}/${day}/${year}`;
}