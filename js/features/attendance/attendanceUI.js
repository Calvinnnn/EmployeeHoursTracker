import {
    getAttendanceDays,
    getTotalAttendanceHours,
    deleteAttendanceSession
} from "./attendanceService.js";

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