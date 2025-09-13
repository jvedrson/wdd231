const membersContainer = document.getElementById('members');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

async function getMembers() {
    const response = await fetch('data/members.json');
    const members = await response.json();
    displayMembers(members);
}

function displayMembers(members) {
    membersContainer.innerHTML = '';
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <h2>${member.name}</h2>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Link</a></p>
            <p><strong>Membership:</strong> ${membershipLevel(member.membership_level)}</p>
            <br />
            <p>${member.info}</p>
            `;
        membersContainer.appendChild(card);
    });
}

function membershipLevel(level) {
    if (level === 3) return 'Gold';
    if (level === 2) return 'Silver';
    return 'Member';
}

// Toggle view
if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
        membersContainer.classList.remove('list');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });
    listBtn.addEventListener('click', () => {
        membersContainer.classList.add('list');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

getMembers();
