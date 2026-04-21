/**
 * Save current form settings to localStorage.
 */
function saveSettings(settings) {
    try {
        localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        // localStorage unavailable or full — silently ignore
    }
}

/**
 * Load previously saved settings from localStorage.
 * Returns null if nothing is stored or on error.
 */
function loadSavedSettings() {
    try {
        var data = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}
