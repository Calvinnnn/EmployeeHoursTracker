import { db } from "../database.js";

export const settingsRepository = {
    /**
     * Load a setting value.
     *
     * @param {string} key
     * @returns {Promise<any>}
     */
    async load(key) {
        const item = await db.settings.get(key);
        return item ? item.value : undefined;
    },

    /**
     * Save a setting value.
     *
     * @param {string} key
     * @param {any} value
     * @returns {Promise<void>}
     */
    async save(key, value) {
        await db.settings.put({ key, value });
    }
};

