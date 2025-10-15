
let allTools = [];
let filteredTools = [];

// Load tools from JSON file
async function loadTools() {
    try {
        const response = await fetch('data/tools.json');
        allTools = await response.json();
        filteredTools = allTools;
    } catch (error) {
        console.error('Error loading tools:', error);
        document.getElementById('tools-container').innerHTML = '<p>Error loading tools</p>';
    }
}

// Check URL parameters for category filtering
function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    if (category) {
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.value = category;
        applyFilters();
    }
}

// Display tools on page
function displayTools(tools) {
    const container = document.getElementById('tools-container');
    
    if (tools.length === 0) {
        container.innerHTML = '<p class="no-results">No tools found</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFav = favorites.includes(tool.id);
        
        html += `
            <div class="tool-card">
                <div class="tool-image">
                    <img src="${tool.image}" alt="${tool.name}" onerror="this.src='images/backend-icon.svg'">
                </div>
                <div class="tool-content">
                    <div class="tool-header">
                        <h3>${tool.name}</h3>
                        <button class="favorite-btn ${isFav ? 'favorite' : ''}" data-id="${tool.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                            <img src="images/${isFav ? 'heart-fill' : 'heart'}.svg" alt="${isFav ? 'Filled heart' : 'Empty heart'}" width="20" height="20">
                        </button>
                    </div>
                    <p class="tool-description">${tool.description}</p>
                    <div class="tool-meta">
                        <span class="tool-language">${tool.language}</span>
                        <span class="tool-category">${tool.category}</span>
                        <span class="tool-difficulty">${tool.difficulty}</span>
                    </div>
                    <div class="tool-actions">
                        <a href="${tool.url}" class="btn" target="_blank" rel="noopener">Visit Site</a>
                        <button class="btn btn-secondary details-btn" data-name="${tool.name}">Details</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolId = parseInt(this.dataset.id);
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const imgElement = this.querySelector('img');
            
            if (favorites.includes(toolId)) {
                const index = favorites.indexOf(toolId);
                favorites.splice(index, 1);
                imgElement.src = 'images/heart.svg';
                imgElement.alt = 'Empty heart';
                this.classList.remove('favorite');
                this.setAttribute('aria-label', 'Add to favorites');
            } else {
                favorites.push(toolId);
                imgElement.src = 'images/heart-fill.svg';
                imgElement.alt = 'Filled heart';
                this.classList.add('favorite');
                this.setAttribute('aria-label', 'Remove from favorites');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateStats();
        });
    });
    
    // Add event listeners to details buttons
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolName = this.dataset.name;
            showDetails(toolName);
        });
    });
}

// Show tool details in modal
function showDetails(toolName) {
    const tool = allTools.find(t => t.name === toolName);
    if (!tool) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = favorites.includes(tool.id);
    
    const modal = document.createElement('dialog');
    modal.className = 'tool-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h2>${tool.name}</h2>
            <button class="modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
            <p>${tool.description}</p>
            <div class="tool-meta-grid">
                <div class="meta-item">
                    <strong>Language</strong>
                    <p>${tool.language}</p>
                </div>
                <div class="meta-item">
                    <strong>Category</strong>
                    <p>${tool.category}</p>
                </div>
                <div class="meta-item">
                    <strong>Difficulty</strong>
                    <p>${tool.difficulty}</p>
                </div>
                <div class="meta-item">
                    <strong>License</strong>
                    <p>${tool.license}</p>
                </div>
            </div>
            <div class="tool-actions">
                <a href="${tool.url}" class="btn" target="_blank" rel="noopener">Visit ${tool.name}</a>
                <button class="btn btn-secondary favorite-btn ${isFav ? 'favorite' : ''}" data-id="${tool.id}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                    <img src="images/${isFav ? 'heart-fill' : 'heart'}.svg" alt="${isFav ? 'Filled heart' : 'Empty heart'}" width="20" height="20">
                    ${isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.showModal();
    
    // Add event listener to favorite button in modal
    const favBtn = modal.querySelector('.favorite-btn');
    favBtn.addEventListener('click', function() {
        const toolId = parseInt(this.dataset.id);
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const imgElement = this.querySelector('img');
        
        if (favorites.includes(toolId)) {
            const index = favorites.indexOf(toolId);
            favorites.splice(index, 1);
            imgElement.src = 'images/heart.svg';
            this.classList.remove('favorite');
            this.innerHTML = '<img src="images/heart.svg" alt="Empty heart" width="20" height="20"> Add to Favorites';
        } else {
            favorites.push(toolId);
            imgElement.src = 'images/heart-fill.svg';
            this.classList.add('favorite');
            this.innerHTML = '<img src="images/heart-fill.svg" alt="Filled heart" width="20" height="20"> Remove from Favorites';
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateStats();
        displayTools(filteredTools);
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.close();
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
            modal.remove();
        }
    });
}

// Update statistics
function updateStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    const totalTools = allTools.length;
    const languages = new Set(allTools.map(t => t.language)).size;
    const categories = new Set(allTools.map(t => t.category)).size;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]').length;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${totalTools}</div>
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
}

// Setup filter functionality
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const languageFilter = document.getElementById('language-filter');
    const categoryFilter = document.getElementById('category-filter');
    const clearBtn = document.getElementById('clear-filters');
    
    // Populate filter dropdowns
    const languages = [...new Set(allTools.map(t => t.language))].sort();
    const categories = [...new Set(allTools.map(t => t.category))].sort();
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageFilter.appendChild(option);
    });
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    
    // Search functionality
    searchInput.addEventListener('input', applyFilters);
    languageFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        languageFilter.value = '';
        categoryFilter.value = '';
        applyFilters();
    });
}

// Apply all filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const language = document.getElementById('language-filter').value;
    const category = document.getElementById('category-filter').value;
    
    filteredTools = allTools.filter(tool => {
        const matchesSearch = searchTerm === '' || 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm);
        
        const matchesLanguage = language === '' || tool.language === language;
        const matchesCategory = category === '' || tool.category === category;
        
        return matchesSearch && matchesLanguage && matchesCategory;
    });
    
    displayTools(filteredTools);
}

// Load tools when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadTools();
    setupFilters();
    checkURLParams();
    updateStats();
    displayTools(filteredTools);
});