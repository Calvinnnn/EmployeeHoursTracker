/**
 * Dev 2
 * Handles employee end/leaving time.
 */

/**
 * Get the selected end time timestamp.
 *
 * @returns {string}
 */
export function getEndTime() {
    const input = document.getElementById("end-time");

    if (!input) {
        return "";
    }

    return input.value;
}

/**
 * Set the end time timestamp.
 *
 * @param {string|number} time
 */
export function setEndTime(time) {
    const input = document.getElementById("end-time");

    if (!input) {
        throw new Error("End time input was not found.");
    }

    input.value = time == null ? "" : String(time);
}

/**
 * Check whether an end time was selected.
 *
 * @returns {boolean}
 */
export function hasEndTime() {
    return getEndTime() !== "" && getEndTime() !== null && getEndTime() !== undefined;
}