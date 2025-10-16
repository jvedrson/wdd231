// utils.js - shared utility functions for ES module import

export function formatDate(date) {
    if (!date) return '';

    try {
        return new Date(date).toLocaleString();
    } catch (err) {
        console.error('Invalid date:', err);
        return '';
    }
}

export function safeJsonParse(str, fallback = []) {
    try {
        return JSON.parse(str || '[]');
    } catch (err) {
        console.error('JSON parse error:', err);
        return fallback;
    }
}
