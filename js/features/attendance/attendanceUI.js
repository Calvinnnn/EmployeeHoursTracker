import {
    getAttendanceDays,
    getTotalAttendanceHours,
    deleteAttendanceSession,
    updateAttendanceSession
} from "./attendanceService.js";

import { getWorkSessionById } from "../../db/repositories/workSessionRepository.js";
import { validateWorkSession } from "../work-sessions/workSessionValidation.js";

import {
    formatDateForDisplay,
    formatTimeForDisplay
} from "../../calculations/dates.js";

import {
    getHourlyRate,
    setHourlyRate
} from "../settings/settingsService.js";

import {
    calculateEarnings
} from "../../calculations/earnings.js";

import { calculateDuration } from "../../calculations/hours.js";

import {
    showModal
} from "../../components/modal.js";

import {
    toast
} from "../../components/toast.js";

let currentTotalHours = 0;

/**
 * Initialize attendance page.
 */
export async function initializeAttendance() {
    await renderAttendanceDays();

    try {
        currentTotalHours = await getTotalAttendanceHours();
    } catch (e) {
        currentTotalHours = 0;
    }

    const totalButton = document.getElementById("show-total-hours");
    if (totalButton) {
        totalButton.addEventListener("click", handleShowTotalHours);
    }

    const rateInput = document.getElementById("hourly-rate-input");
    if (rateInput) {
        const rate = await getHourlyRate();
        rateInput.value = rate;

        rateInput.addEventListener("input", async (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val >= 0) {
                try {
                    await setHourlyRate(val);
                    await updateEarnings();
                } catch (err) {
                    console.error("Failed to save rate:", err);
                }
            }
        });
    }
}

/**
 * Render attendance days into the table.
 */
export async function renderAttendanceDays() {
    const tableBody = document.getElementById("attendance-table-body");
    if (!tableBody) {
        return;
    }

    try {
        const attendanceDays = await getAttendanceDays();
        tableBody.innerHTML = "";

        if (attendanceDays.length === 0) {
            renderEmptyState(tableBody);
            return;
        }

        attendanceDays.forEach((day) => {
            const row = createAttendanceRow(day);
            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll(".delete-session-btn").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const sessionId = event.currentTarget.dataset.sessionId;
                await handleDeleteSession(sessionId);
            });
        });

        tableBody.querySelectorAll(".edit-session-btn").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const sessionId = event.currentTarget.dataset.sessionId;
                await handleEditSession(sessionId);
            });
        });

    } catch (error) {
        console.error("Failed to load attendance days:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load attendance days.
                </td>
            </tr>
        `;
    }
}

/**
 * Create one table row.
 *
 * @param {Object} day
 * @returns {HTMLTableRowElement}
 */
function createAttendanceRow(day) {
    const row = document.createElement("tr");
    const formattedDate = formatDateForDisplay(day.date);

    row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${formatTimeForDisplay(day.startTime)}</td>
        <td>${formatTimeForDisplay(day.endTime)}</td>
        <td class="hours-cell">
            ${day.readableDuration || formatHours(day.totalHours)}
        </td>
        <td>
            <button
                type="button"
                class="edit-session-btn"
                data-session-id="${day.id}"
                aria-label="تعديل سجل الحضور"
            >
                ✏️ تعديل
            </button>
            <button
                type="button"
                class="delete-session-btn"
                data-session-id="${day.id}"
            >
                حذف
            </button>
        </td>
    `;

    return row;
}

/**
 * Format hours for display.
 *
 * @param {number} hours
 * @returns {string}
 */
function formatHours(hours) {
    const totalMinutes = Math.round((Number(hours) || 0) * 60);
    const wholeHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (wholeHours > 0 && minutes > 0) {
        return `${wholeHours}h ${minutes}m`;
    }

    if (wholeHours > 0) {
        return `${wholeHours}h`;
    }

    return `${minutes}m`;
}

/**
 * Show empty state.
 *
 * @param {HTMLElement} tableBody
 */
function renderEmptyState(tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="empty-state">
                لا توجد أيام حضور حتى الآن
            </td>
        </tr>
    `;
}

async function handleDeleteSession(sessionId) {
    if (!sessionId) {
        return;
    }

    const modal = showModal(
        '<div><p>هل أنت متأكد من حذف سجل العمل هذا؟</p></div>',
        {
            confirmText: "حذف",
            cancelText: "إلغاء",
            onConfirm: async () => {
                await deleteAttendanceSession(sessionId);
                await renderAttendanceDays();
                currentTotalHours = await getTotalAttendanceHours();
                await updateEarnings();
                toast("تم حذف سجل العمل بنجاح.", "success");
                modal.remove();
            },
            onCancel: () => {
                modal.remove();
            }
        }
    );
}

/**
 * Update the estimated earnings display.
 */
async function updateEarnings() {
    const earningsElement = document.getElementById("estimated-earnings-value");
    if (!earningsElement) {
        return;
    }

    try {
        const rate = await getHourlyRate();
        const earnings = calculateEarnings(currentTotalHours, rate);
        earningsElement.textContent = `${earnings.toFixed(2)} ج.م`;
    } catch (error) {
        console.error("Failed to update earnings display:", error);
        earningsElement.textContent = "—";
    }
}

/**
 * Show total hours and calculate earnings.
 */
async function handleShowTotalHours() {
    const totalHoursElement = document.getElementById("total-hours-value");
    if (!totalHoursElement) {
        return;
    }

    try {
        const totalHours = await getTotalAttendanceHours();
        totalHoursElement.textContent = formatHours(totalHours);
        totalHoursElement.classList.add("total-hours-visible");

        currentTotalHours = totalHours;
        await updateEarnings();

    } catch (error) {
        console.error("Failed to calculate total hours:", error);
    }
}

/**
 * Convert a stored value (timestamp or HH:MM) into an input-friendly HH:MM string.
 */
function toTimeInputValue(value) {
    if (!value && value !== 0) return "";

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
            const parts = trimmed.split(":");
            return `${String(parts[0]).padStart(2, "0")}:${String(parts[1]).padStart(2, "0")}`;
        }
        const ts = Number(trimmed);
        if (Number.isFinite(ts)) value = ts;
    }

    const ts = Number(value);
    if (!Number.isFinite(ts)) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Convert a date (ISO) and HH:MM input value into a timestamp (ms).
 */
function inputValueToTimestamp(dateIso, timeValue) {
    if (!timeValue) return null;
    // Create local datetime
    const iso = `${dateIso}T${timeValue}:00`;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.getTime();
}

/**
 * Open edit modal for a session id.
 */
async function handleEditSession(sessionId) {
    if (!sessionId) return;

    const session = await getWorkSessionById(sessionId);
    if (!session) {
        toast("سجل العمل غير موجود.", "error");
        return;
    }

    const startInputVal = toTimeInputValue(session.startTime);
    const endInputVal = toTimeInputValue(session.endTime);

    const modalContent = `
        <div style="min-width:280px; max-width:520px;">
            <h3 style="margin:0 0 8px 0;">تعديل سجل الحضور</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <label>وقت الحضور
                    <input id="edit-start-time" type="time" value="${startInputVal}" />
                </label>
                <label>وقت الانصراف
                    <input id="edit-end-time" type="time" value="${endInputVal}" />
                </label>
                <div id="edit-duration" style="margin-top:6px;color:var(--color-text, #111)">مدة العمل: —</div>
            </div>
        </div>
    `;

    const modal = showModal(modalContent, {
        confirmText: "حفظ التعديل",
        cancelText: "إلغاء",
        onConfirm: async () => {
            const startVal = document.getElementById("edit-start-time").value;
            const endVal = document.getElementById("edit-end-time").value;

            const newStartTs = inputValueToTimestamp(session.date, startVal);
            const newEndTs = inputValueToTimestamp(session.date, endVal);

            const validation = (function(){
                try {
                    return validateWorkSession({ date: session.date, startTime: newStartTs, endTime: newEndTs });
                } catch (e) {
                    return { valid: false, errors: [e.message] };
                }
            })();

            if (!validation.valid) {
                toast(validation.errors.join(" "), "error");
                return;
            }

            const durationMinutes = calculateDuration(newStartTs, newEndTs);

            try {
                await updateAttendanceSession(sessionId, {
                    startTime: newStartTs,
                    endTime: newEndTs,
                    durationMinutes
                });

                await renderAttendanceDays();
                currentTotalHours = await getTotalAttendanceHours();
                await updateEarnings();
                toast("✓ تم تحديث سجل الحضور بنجاح", "success");
                modal.remove();
            } catch (err) {
                console.error("Failed to update session:", err);
                toast("حدث خطأ أثناء تحديث السجل. حاول مرة أخرى.", "error");
            }
        },
        onCancel: () => {
            modal.remove();
        }
    });

    // live updates: recalc duration when inputs change
    const startEl = modal.querySelector("#edit-start-time");
    const endEl = modal.querySelector("#edit-end-time");
    const durationEl = modal.querySelector("#edit-duration");

    function recalc() {
        const s = startEl.value;
        const e = endEl.value;
        const sTs = inputValueToTimestamp(session.date, s);
        const eTs = inputValueToTimestamp(session.date, e);
        const mins = calculateDuration(sTs, eTs);
        if (mins && mins > 0) {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            durationEl.textContent = `مدة العمل: ${h > 0 ? h + "س " : ""}${m}د`;
            // update earnings preview if present
            const rateEl = document.getElementById("hourly-rate-input");
            if (rateEl) {
                const rate = parseFloat(rateEl.value) || 0;
                const earnings = calculateEarnings(mins / 60, rate);
                const earningsEl = document.getElementById("estimated-earnings-value");
                if (earningsEl) earningsEl.textContent = `${earnings.toFixed(2)} ج.م`;
            }
        } else {
            durationEl.textContent = "مدة العمل: غير صالحة";
        }
    }

    if (startEl) startEl.addEventListener("input", recalc);
    if (endEl) endEl.addEventListener("input", recalc);
    recalc();
}