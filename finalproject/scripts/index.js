import { safeJsonParse } from './utils.js';

document.addEventListener('DOMContentLoaded', loadHomeStats);

async function loadHomeStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    try {
        const response = await fetch('data/tools.json');
        const tools = await response.json();

        const languages = new Set(tools.map(t => t.language)).size;
        const categories = new Set(tools.map(t => t.category)).size;
        const favorites = safeJsonParse(localStorage.getItem('favorites')).length;

        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${tools.length}</div>
                <div class="stat-label">Total Tools</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${languages}</div>
                <div class="stat-label">Languages</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${categories}</div>
                <div class="stat-label">Categories</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${favorites}</div>
                <div class="stat-label">Favorites</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

