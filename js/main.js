import {
    initializeWorkSessionForm
} from "./features/work-sessions/workSessionUI.js";

import {
    registerServiceWorker
} from "./pwa/registerSW.js";

document.addEventListener("DOMContentLoaded", () => {

    initializeWorkSessionForm();

    registerServiceWorker();

});