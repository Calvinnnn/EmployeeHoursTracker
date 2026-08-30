import { defineConfig } from "vite";

// `base: "./"` emits relative asset URLs so the production build works when
// hosted under any base path (e.g. GitHub Pages at /EmployeeHoursTracker/)
// without having to hard-code the repository name.
export default defineConfig({
    base: "./",
    build: {
        assetsDir: "assets"
    }
});
