document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const locationInput = document.getElementById('locationInput');
    const weatherDetails = document.getElementById('weatherDetails');
    let aqiElement = null; // Global variable to store reference to AQI element

    // Function to fetch weather and AQI data
    async function fetchData() {
        const location = locationInput.value.trim();
        const weatherData = await fetchWeather(location);
        const aqiData = await fetchAQI(location); // Fetch AQI data along with weather data

        // Update weather details only if both weather and AQI data are fetched successfully
        if (weatherData && aqiData) {
            displayWeather(weatherData);
            displayAQI(aqiData);
        }
    }

    // Event listener for clicking the search button
    searchBtn.addEventListener('click', fetchData);

    // Event listener for pressing Enter key in the location input field
    locationInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchData();
        }
    });

    async function fetchWeather(location) {
        const apiKey = "b74fd8d74261fcea03e710fb4fd6b31e"; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                return data; // Return weather data if fetch is successful
            } else {
                throw new Error(`${data.cod}: ${data.message}`);
            }
        } catch (error) {
            console.log('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please verify that the area name is correct and try again later.');
            return null; // Return null if fetch fails
        }
    }

    async function fetchAQI(location) {
        const apiUrl = `http://api.waqi.info/feed/${location}/?token=demo`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                return data; // Return AQI data if fetch is successful
            } else {
                throw new Error(`${data.status}: ${data.data}`);
            }
        } catch (error) {
            console.log('Error fetching AQI data:', error);
            // Do not show an alert for AQI fetch errors
            return null; // Return null if fetch fails
        }
    }

    function displayWeather(data) {
        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const chanceOfRain = data.clouds.all; // Represented as cloudiness percentage
        const weatherConditionCode = data.weather[0].id; // Get weather condition code

        let weatherHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature}°C <img src="https://openweathermap.org/img/w/${getWeatherIcon(weatherConditionCode)}.png" alt="Weather Icon"></p>
        <p>Description: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Chance of Rain: ${chanceOfRain}%</p>
    `;

        weatherDetails.innerHTML = weatherHTML;

        // Adjust footer position
        adjustFooterPosition();
    }

    function displayAQI(data) {
        const aqiValue = data.data.aqi;
        const aqiDescription = getAQIDescription(aqiValue);

        // Remove the previous AQI element, if it exists
        if (aqiElement && aqiElement.parentNode) {
            aqiElement.parentNode.removeChild(aqiElement);
        }

        // Create a new AQI element
        const newAqiElement = document.createElement('p');
        newAqiElement.textContent = `Air Quality Index: ${aqiValue} ${aqiDescription}`;

        // Append the new AQI element to the weather details
        weatherDetails.appendChild(newAqiElement);

        // Update the reference to the AQI element
        aqiElement = newAqiElement;
    }

    function getAQIDescription(aqi) {
        let description = '';
        if (aqi >= 0 && aqi <= 50) {
            description = '( Good )';
        } else if (aqi > 50 && aqi <= 100) {
            description = '( Moderate )';
        } else if (aqi > 100 && aqi <= 150) {
            description = '( Unhealthy for Sensitive Groups )';
        } else if (aqi > 150 && aqi <= 200) {
            description = '( Unhealthy )';
        } else if (aqi > 200 && aqi <= 300) {
            description = '( Very Unhealthy )';
        } else if (aqi > 300 && aqi <= 999999999) {
            description = '( Hazardous )';
        }
        return description;
    }

    function getWeatherIcon(weatherConditionCode) {
        // Define mappings from weather condition codes to icon names
        const weatherIcons = {
            200: '11d', // Thunderstorm with light rain
            201: '11d', // Thunderstorm with rain
            202: '11d', // Thunderstorm with heavy rain
            210: '11d', // Light thunderstorm
            211: '11d', // Thunderstorm
            212: '11d', // Heavy thunderstorm
            221: '11d', // Ragged thunderstorm
            230: '11d', // Thunderstorm with light drizzle
            231: '11d', // Thunderstorm with drizzle
            232: '11d', // Thunderstorm with heavy drizzle
            300: '09d', // Light intensity drizzle
            301: '09d', // Drizzle
            302: '09d', // Heavy intensity drizzle
            310: '09d', // Light intensity drizzle rain
            311: '09d', // Drizzle rain
            312: '09d', // Heavy intensity drizzle rain
            313: '09d', // Shower rain and drizzle
            314: '09d', // Heavy shower rain and drizzle
            321: '09d', // Shower drizzle
            500: '10d', // Light rain
            501: '10d', // Moderate rain
            502: '10d', // Heavy intensity rain
            503: '10d', // Very heavy rain
            504: '10d', // Extreme rain
            511: '13d', // Freezing rain
            520: '09d', // Light intensity shower rain
            521: '09d', // Shower rain
            522: '09d', // Heavy intensity shower rain
            531: '09d', // Ragged shower rain
            600: '13d', // Light snow
            601: '13d', // Snow
            602: '13d', // Heavy snow
            611: '13d', // Sleet
            612: '13d', // Light shower sleet
            613: '13d', // Shower sleet
            615: '13d', // Light rain and snow
            616: '13d', // Rain and snow
            620: '13d', // Light shower snow
            621: '13d', // Shower snow
            622: '13d', // Heavy shower snow
            701: '50d', // Mist
            711: '50d', // Smoke
            721: '50d', // Haze
            731: '50d', // Dust
            741: '50d', // Fog
            751: '50d', // Sand
            761: '50d', // Dust
            762: '50d', // Ash
            771: '50d', // Squalls
            781: '50d', // Tornado
            800: '01d', // Clear sky
            801: '02d', // Few clouds
            802: '03d', // Scattered clouds
            803: '04d', // Broken clouds
            804: '04d' // Overcast clouds
        };

        // Return the corresponding icon name for the given weather condition code
        return weatherIcons[weatherConditionCode] || '01d'; // Default to clear sky icon if code not found
    }

    // Function to adjust footer position
    function adjustFooterPosition() {
        const containerHeight = document.querySelector('.container').offsetHeight;
        const weatherDetailsHeight = document.getElementById('weatherDetails').offsetHeight;
        const windowHeight = window.innerHeight;
        const footer = document.querySelector('.footer');

        if ((containerHeight + weatherDetailsHeight) < windowHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '10px';
            footer.style.right = '10px'; // Adjust the position to bottom right
        } else {
            footer.style.position = 'relative';
            footer.style.bottom = 'auto'; // Reset bottom position
            footer.style.right = 'auto'; // Reset right position
        }
    }

    // Open LinkedIn profile in new tab
    window.openLinkedIn = function() {
        window.open('https://www.linkedin.com/in/mahashrid/', '_blank');
    };

    // Call adjustFooterPosition initially and on window resize
    window.addEventListener('resize', adjustFooterPosition);
    adjustFooterPosition();

});
