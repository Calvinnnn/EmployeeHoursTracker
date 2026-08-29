import {
    initializeWorkSessionForm
} from "./features/work-sessions/workSessionUI.js";

import {
    initializeAttendance
} from "./features/attendance/attendanceUI.js";

import {
    setupNavigation
} from "./components/navbar.js";

import {
    registerServiceWorker
} from "./pwa/registerSW.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeWorkSessionForm();

        await initializeAttendance();

        setupNavigation();

        registerServiceWorker();

    }
);