/**
 * Dev 1
 * Handles employee start/arrival time.
 */

/**
 * Get the selected start time timestamp.
 *
 * @returns {string}
 */
export function getStartTime() {
    const input = document.getElementById("start-time");

    if (!input) {
        return "";
    }

    return input.value;
}

/**
 * Set the start time timestamp.
 *
 * @param {string|number} time
 */
export function setStartTime(time) {
    const input = document.getElementById("start-time");

    if (!input) {
        throw new Error("Start time input was not found.");
    }

    input.value = time == null ? "" : String(time);
}

/**
 * Check whether a start time was selected.
 *
 * @returns {boolean}
 */
export function hasStartTime() {
    return getStartTime() !== "" && getStartTime() !== null && getStartTime() !== undefined;
}