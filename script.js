const weatherApp = (function() {

  window.addEventListener('DOMContentLoaded' , loader);

  function loader() {
    document.getElementById('preloader').style.display = 'flex';
    setTimeout(() => {
      document.getElementById('preloader').style.display = 'none';
    }, 5000);
};
  const locationURL = 'https://services.grassriots.io/';

  // Initialization function
  function init(weatherData) {
    // Initialization logic using weatherData
    console.log('Initialization with weather data:', weatherData);
  }
  
  // Get location and weather data
  fetch(locationURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const location = data.data.city;
      document.getElementById("location").innerText = location;

      const latitude = data.data.lat;
      const longitude = data.data.lng;

      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code,cloud_cover,wind_speed_10m`;

      fetch(weatherURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(weatherData => {
          const temperature = weatherData.current.temperature_2m;
          const weatherCondition = weatherData.current.weather_code;
          const precipitation = weatherData.current.precipitation;
          const wind = weatherData.current.wind_speed_10m;
          const cloudCover = weatherData.current.cloud_cover;

          const weatherConditionDescription = getWeatherCodeDescription(weatherCondition);
      
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

        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          const weatherError = document.querySelector('#weatherError');
          weatherError.innerHTML = '<i class="fas fa-solid fa-poop"></i><br><br>Sorry<br><br>We were unable to find your weather forecast';
        });
    })
    .catch(error => {
      console.error('Error fetching location information:', error);

      const locationError = document.querySelector('#locationError');
      locationError.innerHTML = '<i class="fas fa-solid fa-poop"></i><br><br>Sorry<br><br>We were unable to find your location';
    });
})();
