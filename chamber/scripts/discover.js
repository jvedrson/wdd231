const discoverCardsContainer = document.getElementById('discover-cards');
const visitMessageDiv = document.getElementById('visit-message');

function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    let message = '';

    if (!lastVisit) {
        message = 'Welcome! Let us know if you have any questions.';  // First visit
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const diffTime = now - lastVisitDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            message = 'Back so soon! Awesome!';
        } else if (diffDays === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = `You last visited ${diffDays} days ago.`;
        }
    }

    visitMessageDiv.textContent = message;

    localStorage.setItem('lastVisit', now.toString());
}

async function loadDiscoverItems() {
    try {
        const response = await fetch('data/discover-items.json');
        const items = await response.json();

        displayItems(items);
    } catch (error) {
        console.error('Error loading discover items:', error);
        discoverCardsContainer.innerHTML =
            '<p class="error">Unable to load discover items. Please try again later.</p>';
    }
}

function displayItems(items) {
    discoverCardsContainer.innerHTML = '';

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('discover-card');
        card.setAttribute('data-id', item.id);

        // Set fetchpriority and no lazy loading at the first 3 images
        const isFirstImages = index < 3;
        const imgAttributes = isFirstImages 
            ? `fetchpriority="high"` 
            : `loading="lazy"`;

        card.innerHTML = `
            <h2>${item.name}</h2>
            <figure>
                <img src="${item.image}" alt="${item.name}" width="300" height="200" ${imgAttributes}>
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button class="learn-more-btn" data-id="${item.id}">Learn More</button>
        `;

        discoverCardsContainer.appendChild(card);
    });
}

displayVisitMessage();
loadDiscoverItems();
