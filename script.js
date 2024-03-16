function showLoader() {
  document.getElementById("loader").style.display = "flex";
  setTimeout(showTitlePage, 5000);
}

showLoader();

function showTitlePage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("titlePage").style.display = "flex";
  setTimeout(hideTitlePage, 3000);
}

function hideTitlePage() {
  document.getElementById("titlePage").style.display = "none";
  document.getElementById("main").style.display = "block"; 
}

function showMainContent(data) {
  if (data) {
    const userLocation = data.data.city;
    document.getElementById("userLocation").innerText = userLocation;
  }
}

function showError(message) {
  document.getElementById("main").style.display = "block";
  document.getElementById("errorMessage").innerText = message;
}

const currentLocalWeatherApp = {};

currentLocalWeatherApp.getUserLocationAndWeather = function() {
  fetch('https://services.grassriots.io/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      showMainContent(data); // Display main content with location data
      const latitude = data.data.lat;
      const longitude = data.data.lng;
      const openMeteoApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code,cloud_cover,wind_speed_10m`;

      return fetch(openMeteoApiUrl); // Fetch weather data
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(openMeteoData => {
      console.log(openMeteoData);
      const temperature = openMeteoData.current.temperature_2m;
      const weatherCondition = openMeteoData.current.weather_code;
      const precipitation = openMeteoData.current.precipitation;
      const wind = openMeteoData.current.wind_speed_10m;
      const cloudCover = openMeteoData.current.cloud_cover;

    // Function to display weather data
function displayWeatherData() {
        const weatherConditionDescription = getWeatherCodeDescription(weatherCondition);

        // Print API call data to page
        const temperatureElement = document.getElementById("currentTemperature");
        temperatureElement.innerText = `${temperature}\u00B0C`;

        const weatherConditionElement = document.getElementById("currentWeather");
        weatherConditionElement.innerText = `${weatherConditionDescription}`;

        const precipitationElement = document.getElementById("currentPrecipitation");
        precipitationElement.innerText = `Precipitation: ${precipitation}mm`;

        const windElement = document.getElementById("currentWind");
        windElement.innerText = `Wind: ${wind}km/h`;

        const cloudCoverElement = document.getElementById("currentCloud");
        cloudCoverElement.innerText = `Cloud Cover: ${cloudCover}%`;
      }

      displayWeatherData(openMeteoData); // Call displayWeatherData with openMeteoData
    })
    .catch(error => {
      console.error('Error:', error);
      showError("Sorry. Couldn't find your location data.");
    });
}

// Call the function to fetch user location and weather data
currentLocalWeatherApp.getUserLocationAndWeather();

// Convert weather code to words
function getWeatherCodeDescription(code) {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
    case 2:
    case 3:
      return "Mainly clear, partly cloudy, and overcast";
    case 45:
    case 48:
      return "Fog and depositing rime fog";
    case 51:
    case 53:
    case 55:
      return "Drizzle: Light, moderate, and dense intensity";
    case 56:
    case 57:
      return "Freezing Drizzle: Light and dense intensity";
    case 61:
    case 63:
    case 65:
      return "Rain: Slight, moderate and heavy intensity";
    case 66:
    case 67:
      return "Freezing Rain: Light and heavy intensity";
    case 71:
    case 73:
    case 75:
      return "Snow fall: Slight, moderate, and heavy intensity";
    case 77:
      return "Snow grains";
    case 80:
    case 81:
    case 82:
      return "Rain showers: Slight, moderate, and violent";
    case 85:
    case 86:
      return "Snow showers slight and heavy";
    case 95:
      return "Thunderstorm: Slight or moderate";
    case 96:
    case 99:
      return "Thunderstorm with slight and heavy hail";
    default:
      return "Unknown";
  }
}