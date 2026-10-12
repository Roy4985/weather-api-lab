const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const errorText = document.getElementById("error");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  getWeather(city);
});

async function getWeather(city) {
  result.classList.add("hidden");
  errorText.classList.add("hidden");
  loading.classList.remove("hidden");

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&units=metric&appid=" + API_KEY;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error("City not found. Check the spelling and try again.");
    } else if (response.status === 401) {
      throw new Error("Invalid API key. Check your config.js file.");
    } else if (response.status === 429) {
      throw new Error("Too many requests. Please wait a bit and try again.");
    } else if (!response.ok) {
      throw new Error("Something went wrong (error " + response.status + ").");
    }

    const data = await response.json();
    showWeather(data);
  } catch (error) {
    if (error instanceof TypeError) {
      showError("Network error. Check your internet connection.");
    } else {
      showError(error.message);
    }
  } finally {
    loading.classList.add("hidden");
  }
}

function showWeather(data) {
  document.getElementById("city-name").textContent = data.name + ", " + data.sys.country;
  document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("feels-like").textContent = Math.round(data.main.feels_like) + "°C";
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";

  const icon = document.getElementById("icon");
  icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
  icon.alt = data.weather[0].description;

  result.classList.remove("hidden");
}

function showError(message) {
  errorText.textContent = message;
  errorText.classList.remove("hidden");
  result.classList.add("hidden");
}
