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

import {
    toast
} from "../../components/toast.js";

import {
    initializeAttendance
} from "../attendance/attendanceUI.js";

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

        toast("تم حفظ ساعات العمل بنجاح!", "success");

        event.target.reset();

        // Put today's date back after reset.
        initializeCurrentDate();

        // Refresh attendance logs
        await initializeAttendance();

    } catch (error) {
        console.error("Failed to save work session:", error);

        toast(error.message, "error");
    }
}