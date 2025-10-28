const API_KEY = "19f4e8dde52603779f91b44abc23dae3"; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const ctx = document.getElementById("weatherChart").getContext("2d");

let weatherChart;

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      weatherInfo.innerHTML = `<p style="color:red;">❌ City not found. Please try again.</p>`;
      return;
    }

    displayWeather(data);
    updateChart(data);

  } catch (error) {
    console.error("Error fetching data:", error);
    weatherInfo.innerHTML = `<p style="color:red;">⚠️ Error fetching weather data.</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;

  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <p>🌡️ Temperature: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
    <p>🌬️ Wind Speed: ${wind.speed} km/h</p>
    <p>☁️ Condition: ${weather[0].main}</p>
  `;
}

function updateChart(data) {
  const temp = data.main.temp;
  const humidity = data.main.humidity;

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Temperature (°C)", "Humidity (%)"],
      datasets: [{
        label: "Weather Data",
        data: [temp, humidity],
        backgroundColor: ["#4CAF50", "#2196F3"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
  else alert("Please enter a city name.");
});
