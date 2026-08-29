/**
 * Display a visual toast notification.
 *
 * @param {string} message
 * @param {"success"|"error"|"info"} type
 */
export function toast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.position = "fixed";
        container.style.top = "1.5rem";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "99999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "0.75rem";
        container.style.width = "90%";
        container.style.maxWidth = "400px";
        document.body.appendChild(container);
    }

    const el = document.createElement("div");
    el.className = `toast-message ${type}`;
    el.textContent = message;

    // Toast styles
    el.style.padding = "1rem 1.25rem";
    el.style.borderRadius = "12px";
    el.style.color = "#ffffff";
    el.style.fontSize = "0.95rem";
    el.style.fontWeight = "600";
    el.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.textAlign = "center";

    // Set background color based on type
    if (type === "success") {
        el.style.backgroundColor = "var(--color-success, #10b981)";
    } else if (type === "error") {
        el.style.backgroundColor = "var(--color-error, #ef4444)";
    } else {
        el.style.backgroundColor = "var(--color-primary, #4f46e5)";
    }

    container.appendChild(el);

    // Animate in
    setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
    }, 10);

    // Animate out & remove
    setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(-10px)";
        setTimeout(() => {
            el.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}
