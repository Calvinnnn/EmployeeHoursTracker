import {
    getAttendanceDays,
    getTotalAttendanceHours
} from "./attendanceService.js";

import {
    formatDateForDisplay
} from "../../calculations/dates.js";

/**
 * Initialize attendance page.
 */
export async function initializeAttendance() {
    await renderAttendanceDays();

    const totalButton = document.getElementById(
        "show-total-hours"
    );

    if (totalButton) {
        totalButton.addEventListener(
            "click",
            handleShowTotalHours
        );
    }
}

/**
 * Render attendance days into the table.
 */
async function renderAttendanceDays() {
    const tableBody = document.getElementById(
        "attendance-table-body"
    );

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
        console.error(
            "Failed to load attendance days:",
            error
        );

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

    const formattedDate =
        formatDateForDisplay(day.date);

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

    // Normalize 60 minutes -> increment hour
    if (minutes === 60) {
        minutes = 0;
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
            <td
                colspan="4"
                class="empty-state"
            >
                لا توجد أيام حضور حتى الآن
            </td>
        </tr>
    `;
}

/**
 * Show total hours.
 */
async function handleShowTotalHours() {
    const totalHoursElement =
        document.getElementById(
            "total-hours-value"
        );

    if (!totalHoursElement) {
        return;
    }

    try {
        const totalHours =
            await getTotalAttendanceHours();

        totalHoursElement.textContent =
            formatHours(totalHours);

        totalHoursElement.classList.add(
            "total-hours-visible"
        );

    } catch (error) {
        console.error(
            "Failed to calculate total hours:",
            error
        );
    }
}