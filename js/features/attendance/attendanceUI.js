import {
    getAttendanceDays,
    getTotalAttendanceHours
} from "./attendanceService.js";

import {
    formatDateForDisplay
} from "../../calculations/dates.js";

import {
    getHourlyRate,
    setHourlyRate
} from "../settings/settingsService.js";

import {
    calculateEarnings
} from "../../calculations/earnings.js";

let currentTotalHours = 0;

/**
 * Initialize attendance page.
 */
export async function initializeAttendance() {
    await renderAttendanceDays();

    // Cache the total hours initially
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

    } catch (error) {
        console.error("Failed to load attendance days:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
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
        <td>${day.startTime}</td>
        <td>${day.endTime}</td>
        <td class="hours-cell">
            ${formatHours(day.totalHours)}
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
    const wholeHours = Math.floor(hours);
    let minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 60) {
        return `${wholeHours + 1}h`;
    }

    if (minutes === 0) {
        return `${wholeHours}h`;
    }

    return `${wholeHours}h ${minutes}m`;
}

/**
 * Show empty state.
 *
 * @param {HTMLElement} tableBody
 */
function renderEmptyState(tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-state">
                لا توجد أيام حضور حتى الآن
            </td>
        </tr>
    `;
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