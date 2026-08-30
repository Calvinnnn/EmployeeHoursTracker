import { db } from "../database.js";

export const draftRepository = {
    /**
     * Save the in-progress work session draft.
     *
     * @param {Object} draft
     * @returns {Promise<void>}
     */
    async save(draft) {
        await db.drafts.put({
            id: "active-session",
            ...draft,
            updatedAt: Date.now()
        });
    },

    /**
     * Load the saved draft.
     *
     * @returns {Promise<Object|undefined>}
     */
    async load() {
        return await db.drafts.get("active-session");
    },

    /**
     * Clear the draft after successful save.
     *
     * @returns {Promise<void>}
     */
    async clear() {
        await db.drafts.delete("active-session");
    }
};
