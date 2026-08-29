import { settingsRepository } from "../../db/repositories/settingsRepository.js";

const HOURLY_RATE_KEY = "hourlyRate";
const DEFAULT_HOURLY_RATE = 100; // default value

/**
 * Get the current hourly rate setting.
 *
 * @returns {Promise<number>}
 */
export async function getHourlyRate() {
    const rate = await settingsRepository.load(HOURLY_RATE_KEY);
    return rate !== undefined ? Number(rate) : DEFAULT_HOURLY_RATE;
}

/**
 * Set the hourly rate setting.
 *
 * @param {number|string} rate
 * @returns {Promise<void>}
 */
export async function setHourlyRate(rate) {
    const parsed = Number(rate);
    if (isNaN(parsed) || parsed < 0) {
        throw new Error("Hourly rate must be a non-negative number.");
    }
    await settingsRepository.save(HOURLY_RATE_KEY, parsed);
}

