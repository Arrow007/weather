const search = document.querySelector('.search');
const date = document.querySelector('.date')
const temperature = document.querySelector('.temperature');
const condition = document.querySelector('.condition');
const humidity = document.querySelector('.humidity');
const cards = document.querySelectorAll('.card');
const section = document.querySelector('section');
const searchBar = document.querySelector('#search');
const body = document.querySelector('body');
const title = document.querySelector('title');

async function getWeather(lat, long) {
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,precipitation,cloudcover&models=best_match&current_weather=true&temperature_unit=fahrenheit&timezone=auto`);

    const data = await weather.json();
    console.log(data);

    // Display Date
    const today = new Date(Date.parse(data.current_weather.time));
    const hour = today.getHours();
    date.innerText = today.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    // Display Temperature
    temperature.innerText = Math.round(data.current_weather.temperature) + "º";

    // Display Condition
    if (data.hourly.precipitation[hour] !== 0) {
        condition.innerText = 'Rainy';
        body.style.background = 'url("https://images.unsplash.com/photo-1517635954237-7c23b37adb9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")';
        body.style.backgroundSize = 'cover';
    }
    else if (data.hourly.precipitation[hour] === 0 && data.hourly.cloudcover[hour] >= 50) {
        condition.innerText = 'Cloudy';
        body.style.background = 'url("https://images.unsplash.com/photo-1483702721041-b23de737a886?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2346&q=80")';
    }
    else {
        condition.innerText = 'Clear';
        body.style.background = 'url("https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")';
        body.style.backgroundPosition = 'center';
        body.style.backgroundSize = 'cover';

    }

    // Display Humidity
    humidity.innerText = data.hourly.relativehumidity_2m[hour] + "% Humidity";
}

async function getCoordinates(location) {
    const geodata = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${location}`);

    const data = await geodata.json();
    console.log(data[0], data[0].lat, data[0].lon);
    searchBar.value = data[0].display_name;
    title.innerText = 'Weather in ' + data[0].display_name;

    getWeather(data[0].lat, data[0].lon);
}

search.addEventListener("submit", e => {
    e.preventDefault();
    getCoordinates(searchBar.value);

    section.style.display = 'block';
    searchBar.style.border = 'none';
    searchBar.style.borderRadius = '0px';
    searchBar.style.borderBottom = '1px solid #fff';
    searchBar.style.opacity = '0.5'
})