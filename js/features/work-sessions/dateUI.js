import {
    getCurrentDate,
    formatDateForDisplay
} from "../../calculations/dates.js";

/**
 * Initialize today's date in the work session form.
 */
export function initializeCurrentDate() {
    const dateInput = document.getElementById("work-date");
    const dateDisplay = document.getElementById("date-display");

    if (!dateInput) {
        throw new Error("Date input was not found.");
    }

    const today = getCurrentDate();

    // Store machine-readable date.
    dateInput.value = today;

    // Optional human-readable display.
    if (dateDisplay) {
        dateDisplay.textContent = formatDateForDisplay(today);
    }
}

/**
 * Get the current date stored in the form.
 *
 * @returns {string}
 */
export function getSelectedDate() {
    const dateInput = document.getElementById("work-date");

    if (!dateInput) {
        throw new Error("Date input was not found.");
    }

    return dateInput.value;
}