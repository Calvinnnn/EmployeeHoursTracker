/**
 * Setup navigation for SPA hash routing.
 */
export function setupNavigation() {
    const homeSection = document.getElementById("home");
    const attendanceSection = document.getElementById("attendance");
    const navLinks = document.querySelectorAll(".navbar a");

    function navigate() {
        const hash = window.location.hash || "#home";

        if (hash === "#attendance") {
            if (homeSection) homeSection.style.display = "none";
            if (attendanceSection) attendanceSection.style.display = "block";
        } else {
            if (homeSection) homeSection.style.display = "block";
            if (attendanceSection) attendanceSection.style.display = "none";
        }

        navLinks.forEach((link) => {
            if (link.getAttribute("href") === hash) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    window.addEventListener("hashchange", navigate);
    navigate(); // Run initially
}

