/**
 * Dev 2
 * Handles employee end/leaving time.
 */

/**
 * Get the selected end time.
 *
 * @returns {string}
 * Example: "17:30"
 */
export function getEndTime() {
    const input = document.getElementById("end-time");

    if (!input) {
        throw new Error("End time input was not found.");
    }

    return input.value;
}

/**
 * Set the end time.
 *
 * @param {string} time
 */
export function setEndTime(time) {
    const input = document.getElementById("end-time");

    if (!input) {
        throw new Error("End time input was not found.");
    }

    input.value = time;
}

/**
 * Check whether an end time was selected.
 *
 * @returns {boolean}
 */
export function hasEndTime() {
    return getEndTime().trim() !== "";
}