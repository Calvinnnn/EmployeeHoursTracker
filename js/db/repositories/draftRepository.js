import { db } from "../database.js";

export const draftRepository = {
    /**
     * Save the in-progress work session draft.
     *
     * @param {Object} draft
     * @returns {Promise<void>}
     */
    async save(draft) {
        const timestamp = Date.now();

        await db.drafts.put({
            id: "active-session",
            status: "active",
            createdAt: draft.createdAt ?? timestamp,
            updatedAt: timestamp,
            ...draft,
            id: "active-session",
            status: draft.status ?? "active"
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
