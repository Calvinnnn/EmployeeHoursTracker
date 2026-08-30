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
    const draft = await draftRepository.load();

    if (draft && draft.status === "active") {
        const dateInput = document.getElementById("work-date");
        if (dateInput) {
            dateInput.value = draft.date || getSelectedDate();
        }

        if (draft.startTime) {
            setStartTime(draft.startTime);
            const startDisplay = document.getElementById("start-time-display");
            if (startDisplay) {
                startDisplay.textContent = formatTimeForDisplay(draft.startTime);
            }
        }

        if (draft.endTime) {
            setEndTime(draft.endTime);
            const endDisplay = document.getElementById("end-time-display");
            if (endDisplay) {
                endDisplay.textContent = formatTimeForDisplay(draft.endTime);
            }
        }
    }

    updateSessionControls();
    form.addEventListener("submit", handleSubmit);
}

function bindAttendanceButtons() {
    const startButton = document.getElementById("record-start-time");
    const endButton = document.getElementById("record-end-time");

    if (startButton) {
        startButton.addEventListener("click", async () => {
            await handleRecordTime("start");
        });
    }

    if (endButton) {
        endButton.addEventListener("click", async () => {
            await handleRecordTime("end");
        });
    }
}

async function handleRecordTime(type) {
    const now = new Date();
    const timestamp = now.getTime();

    if (type === "start") {
        if (hasStartTime()) {
            toast("وقت الحضور مسجل بالفعل في الجلسة النشطة.", "info");
            updateSessionControls();
            return;
        }

        setStartTime(timestamp);
        const startDisplay = document.getElementById("start-time-display");
        if (startDisplay) {
            startDisplay.textContent = formatTimeForDisplay(timestamp);
        }

        try {
            await updateDraft();
            updateSessionControls();
            toast("تم تسجيل وقت الحضور بنجاح.", "success");
        } catch (error) {
            console.error("Failed to persist active session start time:", error);
            toast("فشل حفظ وقت الحضور، حاول مرة أخرى.", "error");
        }
        return;
    }

    if (!hasStartTime()) {
        toast("يجب تسجيل وقت الحضور أولاً.", "error");
        return;
    }

    setEndTime(timestamp);
    const endDisplay = document.getElementById("end-time-display");
    if (endDisplay) {
        endDisplay.textContent = formatTimeForDisplay(timestamp);
    }

    try {
        await updateDraft();
        updateSessionControls();
        toast("تم تسجيل وقت الانصراف بنجاح.", "success");
    } catch (error) {
        console.error("Failed to persist active session end time:", error);
        toast("فشل حفظ وقت الانصراف، حاول مرة أخرى.", "error");
    }
}

async function updateDraft() {
    const payload = {
        id: "active-session",
        date: getSelectedDate(),
        startTime: getStartTime() || null,
        endTime: getEndTime() || null,
        status: "active",
        updatedAt: Date.now()
    };

    await draftRepository.save(payload);
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
        const startDisplay = document.getElementById("start-time-display");
        const endDisplay = document.getElementById("end-time-display");
        if (startDisplay) startDisplay.textContent = "لم يتم التسجيل";
        if (endDisplay) endDisplay.textContent = "لم يتم التسجيل";
        await draftRepository.clear();
        initializeCurrentDate();
        updateSessionControls();
        await initializeAttendance();

    } catch (error) {
        console.error("Failed to save work session:", error);
        toast(error.message, "error");
    }
}