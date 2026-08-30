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

/**
 * Format a stored timestamp or HH:MM value for time display.
 *
 * @param {string|number} value
 * @returns {string}
 */
export function formatTimeForDisplay(value) {
    if (value === null || value === undefined || value === "") {
        return "لم يتم التسجيل";
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed) {
            return "لم يتم التسجيل";
        }

        if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
            return trimmed;
        }

        const timestamp = Number(trimmed);
        if (!Number.isFinite(timestamp)) {
            return "لم يتم التسجيل";
        }

        value = timestamp;
    }

    const timestamp = Number(value);
    if (!Number.isFinite(timestamp)) {
        return "لم يتم التسجيل";
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return "لم يتم التسجيل";
    }

    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}