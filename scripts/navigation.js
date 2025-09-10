const hamButton = document.getElementById('ham-btn');
const navBar = document.getElementById('nav-bar');

hamButton.addEventListener('click', () => {
    hamButton.classList.toggle('show');
    navBar.classList.toggle('open');
});
