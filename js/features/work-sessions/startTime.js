/**
 * Dev 1
 * Handles employee start/arrival time.
 */

/**
 * Get the selected start time.
 *
 * @returns {string}
 * Example: "09:30"
 */
export function getStartTime() {
    const input = document.getElementById("start-time");

    if (!input) {
        throw new Error("Start time input was not found.");
    }

    return input.value;
}

/**
 * Set the start time.
 *
 * @param {string} time
 */
export function setStartTime(time) {
    const input = document.getElementById("start-time");

    if (!input) {
        throw new Error("Start time input was not found.");
    }

    input.value = time;
}

/**
 * Check whether a start time was selected.
 *
 * @returns {boolean}
 */
export function hasStartTime() {
    return getStartTime().trim() !== "";
}