document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const cityButton = document.getElementById('city-button');

    let cityName = document.getElementById('city-name');
    let cityTemp = document.getElementById('city-temparature');
    let cityDesc = document.getElementById('city-description');
    let weatherInfoBox = document.getElementById('weather-info');

    let errorMessage = document.getElementById('error-message');

    const API_KEY = "689593a79ad59a3046e01ed636a219a8";

    cityButton.addEventListener('click', async () => {
        const city = cityInput.value.trim()
        if (!city) {
            return;
        }

        try {
            const data = await fetchWeatherData(city);
            if (data.cod !== 200) {
                showError();
            } else {
                displayWeatherData(data);
            }
        } catch (error) {
            showError();
        }
    });

    async function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);
        return response.json();
    }

    function displayWeatherData(weatherData) {
        console.log(weatherData)

        const { name, main, weather } = weatherData;
        cityName.innerHTML = name;
        cityTemp.innerHTML = `Temperature: ${main.temp}°C`;
        cityDesc.innerHTML = `Weather: ${weather[0].description}`

        weatherInfoBox.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        cityInput.value = '';
    }

    function showError() {
        weatherInfoBox.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
});