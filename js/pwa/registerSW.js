/**
 * Register the service worker.
 */
export async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service Workers are not supported.");
        return;
    }

    try {
        const registration =
            await navigator.serviceWorker.register("./sw.js");

        console.log(
            "Service Worker registered:",
            registration.scope
        );

    } catch (error) {
        console.error(
            "Service Worker registration failed:",
            error
        );
    }
}