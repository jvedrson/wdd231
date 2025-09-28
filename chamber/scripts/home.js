const WEATHER_API_KEY = '1a488ef871bb2b2692e50f9db8870afe';
const CITY_ID = '3645528'; // Guayana, Venezuela
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=metric&appid=${WEATHER_API_KEY}`;

async function loadWeather() {
    try {
        const res = await fetch(WEATHER_URL);
        const data = await res.json();

        const current = data.list[0];
        const temp = Math.round(current.main.temp);
        const desc = current.weather[0].description;
        const temp_max = Math.round(current.main.temp_max);
        const temp_min = Math.round(current.main.temp_min);
        const humidity = current.main.humidity;
        // Sunrise/sunset from city object
        const sunrise = new Date(data.city.sunrise * 1000);
        const sunset = new Date(data.city.sunset * 1000);
        function formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        document.getElementById('weather-current').innerHTML = `
            <div class="weather-summary">
                <p style="font-size:1.3rem;"><strong>${temp}°C</strong></p>
                <p>${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
                <p>High: <strong>${temp_max}°C</strong></p>
                <p>Low: <strong>${temp_min}°C</strong></p>
                <p>Humidity: <strong>${humidity}%</strong></p>
                <p>Sunrise: <strong>${formatTime(sunrise)}</strong></p>
                <p>Sunset: <strong>${formatTime(sunset)}</strong></p>
            </div>
        `;

        const forecastDays = [];
        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            if (date.getHours() === 12 && forecastDays.length < 3) {
                forecastDays.push(item);
            }
        });

        document.getElementById('weather-forecast').innerHTML = forecastDays.map(day => {
            const date = new Date(day.dt_txt);
            return `<div class="forecast-day">
                <p><strong>${date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong></p>
                <p>${Math.round(day.main.temp)}°C, ${day.weather[0].description}</p>
            </div>`;
        }).join('');

    } catch (err) {
        document.getElementById('weather-current').textContent = 'Weather data unavailable.';
    }
}

function membershipLevel(level) {
    if (level === 3) return 'Gold';
    if (level === 2) return 'Silver';
    return 'Member';
}



async function loadSpotlightsMembers() {
    try {
        const res = await fetch('data/members.json');
        const members = await res.json();
        const eligible = members.filter(m => m.membership_level === 2 || m.membership_level === 3);
        const count = Math.floor(Math.random() * 2) + 2;
        const spotlights = eligible.sort(() => 0.5 - Math.random()).slice(0, count);

        document.getElementById('spotlight-cards').innerHTML = spotlights.map(member => {
            const level = membershipLevel(member.membership_level);

            return `<div class="spotlight-card">
                <img src="${member.image}" alt="${member.name} logo" class="member-logo" width="80" height="80">
                <h2>${member.name}</h2>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Link</a></p>
                <p><strong>Membership:</strong> ${membershipLevel(member.membership_level)}</p>
                <br />
                <p>${member.info}</p>
            </div>`;
        }).join('');
    } catch (err) {
        document.getElementById('spotlight-cards').textContent = 'Spotlight members unavailable.';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    loadSpotlightsMembers();
});
