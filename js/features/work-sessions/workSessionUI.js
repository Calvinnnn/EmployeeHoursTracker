import {
    getStartTime,
    setStartTime,
    hasStartTime
} from "./startTime.js";

import {
    getEndTime,
    setEndTime,
    hasEndTime
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

import {
    formatTimeForDisplay
} from "../../calculations/dates.js";

import {
    calculateDuration
} from "../../calculations/hours.js";

import {
    draftRepository
} from "../../db/repositories/draftRepository.js";

/**
 * Initialize work session form.
 */
export async function initializeWorkSessionForm() {
    initializeCurrentDate();

    const form = document.getElementById("work-session-form");

    if (!form) {
        throw new Error("Work session form was not found.");
    }

    bindAttendanceButtons();
    updateSessionControls();

    form.addEventListener("submit", handleSubmit);

    const draft = await draftRepository.load();
    if (draft && draft.date) {
        const dateInput = document.getElementById("work-date");
        if (dateInput) {
            dateInput.value = draft.date;
        }

        if (draft.startTime) {
            setStartTime(draft.startTime);
            document.getElementById("start-time-display").textContent = formatTimeForDisplay(draft.startTime);
        }

        if (draft.endTime) {
            setEndTime(draft.endTime);
            document.getElementById("end-time-display").textContent = formatTimeForDisplay(draft.endTime);
        }

        updateSessionControls();
    }
}

function bindAttendanceButtons() {
    const startButton = document.getElementById("record-start-time");
    const endButton = document.getElementById("record-end-time");

    if (startButton) {
        startButton.addEventListener("click", () => handleRecordTime("start"));
    }

    if (endButton) {
        endButton.addEventListener("click", () => handleRecordTime("end"));
    }
}

function handleRecordTime(type) {
    const now = new Date();
    const timestamp = now.getTime();

    if (type === "start") {
        setStartTime(timestamp);
        document.getElementById("start-time-display").textContent = formatTimeForDisplay(timestamp);
        document.getElementById("record-start-time").textContent = "تم تسجيل وقت الحضور ✓";
        document.getElementById("record-start-time").disabled = true;
        updateDraft();
        updateSessionControls();
        return;
    }

    if (!hasStartTime()) {
        toast("يجب تسجيل وقت الحضور أولاً.", "error");
        return;
    }

    setEndTime(timestamp);
    document.getElementById("end-time-display").textContent = formatTimeForDisplay(timestamp);
    document.getElementById("record-end-time").textContent = "تم تسجيل وقت الانصراف ✓";
    document.getElementById("record-end-time").disabled = true;
    updateDraft();
    updateSessionControls();
}

function updateDraft() {
    draftRepository.save({
        id: "active-session",
        date: getSelectedDate(),
        startTime: getStartTime(),
        endTime: getEndTime(),
        updatedAt: Date.now()
    });
}

function updateSessionControls() {
    const startRecorded = hasStartTime();
    const endRecorded = hasEndTime();
    const startButton = document.getElementById("record-start-time");
    const endButton = document.getElementById("record-end-time");
    const saveButton = document.getElementById("submit-work-session");
    const durationDisplay = document.getElementById("session-duration-display");

    if (startRecorded) {
        if (startButton) {
            startButton.textContent = "تم تسجيل وقت الحضور ✓";
            startButton.disabled = true;
        }
    } else if (startButton) {
        startButton.textContent = "تسجيل وقت الحضور";
        startButton.disabled = false;
    }

    if (!startRecorded) {
        if (endButton) {
            endButton.disabled = true;
            endButton.textContent = "تسجيل وقت الانصراف";
        }
    } else if (endRecorded) {
        if (endButton) {
            endButton.textContent = "تم تسجيل وقت الانصراف ✓";
            endButton.disabled = true;
        }
    } else if (endButton) {
        endButton.disabled = false;
        endButton.textContent = "تسجيل وقت الانصراف";
    }

    if (saveButton) {
        saveButton.disabled = !(startRecorded && endRecorded);
    }

    if (durationDisplay) {
        if (startRecorded && endRecorded) {
            const minutes = calculateDuration(getStartTime(), getEndTime());
            durationDisplay.textContent = `إجمالي الساعات: ${minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`}`;
        } else {
            durationDisplay.textContent = "إجمالي الساعات: لم يتم الحساب";
        }
    }
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
        endTime,
        durationMinutes: calculateDuration(startTime, endTime)
    };

    try {
        const savedSession = await saveWorkSession(workSession);

        console.log("Work session saved:", savedSession);

        toast("تم حفظ ساعات العمل بنجاح!", "success");

        event.target.reset();
        setStartTime("");
        setEndTime("");
        document.getElementById("start-time-display").textContent = "لم يتم التسجيل";
        document.getElementById("end-time-display").textContent = "لم يتم التسجيل";
        draftRepository.clear();
        initializeCurrentDate();
        updateSessionControls();
        await initializeAttendance();

    } catch (error) {
        console.error("Failed to save work session:", error);
        toast(error.message, "error");
    }
}