const WEATHER_API_KEY = "1a488ef871bb2b2692e50f9db8870afe";
const CITY_ID = "3645528"; // Guayana, Venezuela
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=metric&appid=${WEATHER_API_KEY}`;

async function loadWeather() {
    try {
        const res = await fetch(WEATHER_URL);
        const data = await res.json();

        const currentWeather = data.list[0];
        const temp = Math.round(currentWeather.main.temp);
        const desc = currentWeather.weather[0].description;
        const temp_max = Math.round(currentWeather.main.temp_max);
        const temp_min = Math.round(currentWeather.main.temp_min);
        const humidity = currentWeather.main.humidity;

        // Sunrise/sunset from city object
        const sunrise = new Date(data.city.sunrise * 1000);
        const sunset = new Date(data.city.sunset * 1000);

        const formatTime = (date) => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        document.getElementById('weather-current').innerHTML = `
            <div class="weather-summary">
                <p class="text-line-medium"><strong>${temp}°C</strong></p>
                <p class="text-line">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
                <p class="text-line">High: <strong>${temp_max}°C</strong></p>
                <p class="text-line">Low: <strong>${temp_min}°C</strong></p>
                <p class="text-line">Humidity: <strong>${humidity}%</strong></p>
                <p class="text-line">Sunrise: <strong>${formatTime(sunrise)}</strong></p>
                <p class="text-line">Sunset: <strong>${formatTime(sunset)}</strong></p>
            </div>
        `;

        const forecastDays = [];
        data.list.forEach((item) => {
            const date = new Date(item.dt_txt);
            if (date.getHours() === 12 && forecastDays.length < 3) {
                forecastDays.push(item);
            }
        });


        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        document.getElementById("weather-forecast").innerHTML = forecastDays
            .map((day) => {
                const date = new Date(day.dt_txt);
                return `<div class="forecast-day">
                	<p class="text-line"><strong>${date.toLocaleDateString(undefined, dateOptions)}</strong></p>
                	<p class="text-line">${Math.round(day.main.temp)}°C, ${day.weather[0].description}</p>
            	</div>`;
            })
            .join('');
    } catch (err) {
        document.getElementById('weather-current').innerHTML = '<div class="weather-loading">Weather data unavailable.</div>';
        document.getElementById('weather-forecast').innerHTML = '<div class="weather-loading">Forecast unavailable.</div>';
    }
}

function membershipLevel(level) {
    if (level === 3) return 'Gold';
    if (level === 2) return 'Silver';
    return 'Member';
}

async function loadSpotlightsMembers() {
    try {
        const res = await fetch("data/members.json");
        const members = await res.json();
        const eligible = members.filter(
            (m) => m.membership_level === 2 || m.membership_level === 3
        );
        const count = Math.floor(Math.random() * 2) + 2;
        const spotlights = eligible.sort(() => 0.5 - Math.random()).slice(0, count);

        document.getElementById("spotlight-cards").innerHTML = spotlights
            .map((member) => {
                const level = membershipLevel(member.membership_level);

                return `<div class="spotlight-card">
                <img src="${member.image}" alt="${member.name} logo" class="member-logo" width="120" height="120" loading="lazy">
                <h2 class="text-line">${member.name}</h2>
                <p class="text-line"><strong>Address:</strong> ${member.address}</p>
                <p class="text-line"><strong>Phone:</strong> ${member.phone}</p>
                <p class="text-line"><strong>Website:</strong> <a href="${member.website}" target="_blank">Link</a></p>
                <p class="text-line"><strong>Membership:</strong> ${membershipLevel(member.membership_level)}</p>
                <br />
                <p class="text-line">${member.info}</p>
            </div>`;
            })
            .join("");
    } catch (err) {
        document.getElementById('spotlight-cards').innerHTML = '<div class="spotlight-loading">Member spotlights unavailable.</div>';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    loadSpotlightsMembers();
});
