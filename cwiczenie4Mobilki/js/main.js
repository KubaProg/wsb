const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");

const API_KEY = "0c934d59eb34f93e8d98237351e3df74"; 

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  weatherResult.textContent = "Ładowanie...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error("Nie znaleziono miasta");

    const data = await response.json();

    weatherResult.innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.weather[0].description}</p>
      <p>Temperatura: ${data.main.temp}°C</p>
    `;
  } catch (err) {
    weatherResult.textContent = "Błąd: " + err.message;
  }
});
