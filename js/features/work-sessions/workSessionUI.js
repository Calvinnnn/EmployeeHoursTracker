import {
    getStartTime
} from "./startTime.js";

import {
    getEndTime
} from "./endTime.js";

import {
    initializeCurrentDate,
    getSelectedDate
} from "./dateUI.js";

import {
    saveWorkSession
} from "./workSessionService.js";

/**
 * Initialize work session form.
 */
export function initializeWorkSessionForm() {
    initializeCurrentDate();

    const form = document.getElementById("work-session-form");

    if (!form) {
        throw new Error("Work session form was not found.");
    }

    form.addEventListener("submit", handleSubmit);
}

/**
 * Handle form submission.
 *
 * @param {SubmitEvent} event
 */
async function handleSubmit(event) {
    event.preventDefault();

    const startTime = getStartTime();
    const endTime = getEndTime();
    const date = getSelectedDate();

    const workSession = {
        date,
        startTime,
        endTime
    };

    try {
        const savedSession = await saveWorkSession(workSession);

        console.log("Work session saved:", savedSession);

        alert("Work session saved successfully!");

        event.target.reset();

        // Put today's date back after reset.
        initializeCurrentDate();

    } catch (error) {
        console.error("Failed to save work session:", error);

        alert(error.message);
    }
}