"use strict";
const apiKey = "5b2768ac7c4bd59a53d94ac43c0f0787";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherResult = document.getElementById("weatherResult");
const error = document.getElementById("error");
function setBackground(bg) {
    const overlay = document.getElementById("bgOverlay");
    // fade out
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.style.background = bg;
        // fade in
        overlay.style.opacity = "1";
    }, 300);
}
// 🔹 Fetch Weather
async function getWeather(city) {
    try {
        error.textContent = "Loading...";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${apiKey}&units=metric`);
        if (!response.ok)
            throw new Error("City not found");
        const data = await response.json();
        const currentTime = data.dt; // current time
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;
        const isDay = currentTime > sunrise && currentTime < sunset;
        const condition = data.weather[0].main;
        clearAnimation();
        // 🌙 Night stars
        if (!isDay) {
            createStars();
        }
        if (condition === "Rain") {
            createRain();
        }
        const animation = document.getElementById("weatherAnimation");
        // reset classes
        animation.className = "";
        if (condition === "Rain") {
            animation.classList.add("rain");
        }
        else if (condition === "Clouds") {
            animation.classList.add("clouds");
        }
        else if (condition === "Clear") {
            animation.classList.add("clear");
        }
        if (condition === "Clear") {
            if (isDay) {
                setBackground("linear-gradient(135deg, #56ccf2, #2f80ed)");
            }
            else {
                setBackground("linear-gradient(135deg, #0f2027, #203a43, #2c5364)");
            }
        }
        else if (condition === "Clouds") {
            if (isDay) {
                setBackground("linear-gradient(135deg, #bdc3c7, #2c3e50)");
            }
            else {
                setBackground("linear-gradient(135deg, #232526, #414345)");
            }
        }
        else if (condition === "Rain") {
            setBackground("linear-gradient(135deg, #4b79a1, #283e51)");
        }
        else if (condition === "Haze" || condition === "Mist") {
            setBackground("linear-gradient(135deg, #757f9a, #d7dde8)");
        }
        else {
            setBackground("linear-gradient(135deg, #1d2b64, #f8cdda)");
        }
        // ✅ DATA IS CREATED HERE
        // ✅ ADD ICON CODE HERE (AFTER data)
        const weatherIcon = document.getElementById("weatherIcon");
        if (condition === "Clear") {
            if (isDay) {
                // ☀️ Day → Sun
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
            }
            else {
                // 🌙 Night → Moon
                weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/581/581601.png";
            }
        }
        else if (condition === "Clouds") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414825.png";
        }
        else if (condition === "Rain") {
            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
        }
        else if (condition === "Haze" || condition === "Mist") {
            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/1197/1197102.png";
        }
        else {
            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";
        }
        // existing code
        cityName.textContent = data.name;
        getForecast(data.name);
        temp.textContent = data.main.temp;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;
        weatherResult.classList.remove("hidden");
        error.textContent = "";
    }
    catch (err) {
        weatherResult.classList.add("hidden");
        error.textContent = "❌ City not found!";
    }
}
async function getForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    // take 1 data per day (every 8th item)
    for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
        });
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const card = `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" />
        <p>${temp}°C</p>
      </div>
    `;
        forecastContainer.innerHTML += card;
    }
    document.getElementById("forecast").classList.remove("hidden");
}
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                error.textContent = "Getting location...";
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                // 🔁 reuse same logic
                getWeather(data.name);
            }
            catch (err) {
                error.textContent = "❌ Location not found!";
            }
        });
    }
    else {
        error.textContent = "Geolocation not supported";
    }
}
// 🔹 Event: Button Click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city)
        getWeather(city);
});
// 🔹 Event: Enter Key
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city)
            getWeather(city);
    }
});
window.onload = () => {
    getWeatherByLocation();
};
function clearAnimation() {
    const container = document.getElementById("weatherAnimation");
    container.innerHTML = "";
}
function createStars() {
    const container = document.getElementById("weatherAnimation");
    container.innerHTML = "";
    for (let i = 0; i < 120; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = Math.random() * 100 + "vh";
        star.style.left = Math.random() * 100 + "vw";
        star.style.animationDuration = 1 + Math.random() * 2 + "s";
        container.appendChild(star);
    }
}
function createLightning() {
    const overlay = document.getElementById("bgOverlay");
    overlay.style.transition = "none";
    overlay.style.background = "white";
    setTimeout(() => {
        overlay.style.background = "";
        overlay.style.transition = "opacity 0.8s ease";
    }, 100);
}
function triggerLightning() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            createLightning();
        }
    }, 3000);
}
function createRain() {
    const container = document.getElementById("weatherAnimation");
    container.innerHTML = "";
    for (let i = 0; i < 120; i++) {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = 0.5 + Math.random() + "s";
        drop.style.opacity = Math.random().toString();
        container.appendChild(drop);
    }
}
// navbar scroll effect
const header = document.querySelector(".app-header");
if (header) {
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    });
}
