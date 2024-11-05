const WeatherApp = class {
    constructor(apiKey, resultBlockSelector) {
        this.apiKey = apiKey;
        this.resultBlock = document.querySelector(resultBlockSelector); // Blok, gdzie będą wyświetlane wyniki
    }

    getCurrentWeather(query) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}&units=metric`;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                this.drawWeather(data, "current"); // Wywołujemy metodę rysującą pogodę
            } else {
                console.error("Błąd przy pobieraniu bieżącej pogody:", xhr.statusText);
            }
        };
        xhr.onerror = () => console.error("Błąd sieciowy przy pobieraniu danych pogodowych.");
        xhr.send();
    }

    getForecast(query) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${this.apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Błąd sieciowy.");
                return response.json();
            })
            .then(data => this.drawWeather(data, "forecast"))
            .catch(error => console.error("Błąd przy pobieraniu prognozy pogody:", error));
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather(data, type) {
        let content = '';
    
        if (type === "current") {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const condition = data.weather[0].description;
            const feelsLike = data.main.feels_like;
    
            content += `
                <h2>Bieżąca pogoda dla ${data.name}</h2>
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; width: 80%; max-width: 600px;">
                    <p style="font-weight: bold; margin: 0;">${new Date().toLocaleString()}</p>
                    <div style="display: flex; align-items: center; margin: 10px 0;">
                        <img src="${iconUrl}" alt="Ikona pogody" style="width: 50px; height: 50px; margin-right: 10px;">
                        <p style="font-size: 24px; font-weight: bold; margin: 0;">${data.main.temp}°C</p>
                    </div>
                    <p style="margin: 0;">Odczuwalna: ${feelsLike}°C</p>
                    <p style="margin: 0; text-transform: capitalize;">${condition}</p>
                </div>
            `;
        } else if (type === "forecast") {
            content += `<h2>Prognoza pogody</h2>`;
            data.list.slice(0, 5).forEach(item => {
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                const condition = item.weather[0].description;
                const feelsLike = item.main.feels_like;
    
                content += `
                    <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; width: 80%; max-width: 600px;">
                        <p style="font-weight: bold; margin: 0;">${item.dt_txt}</p>
                        <div style="display: flex; align-items: center; margin: 10px 0;">
                            <img src="${iconUrl}" alt="Ikona pogody" style="width: 50px; height: 50px; margin-right: 10px;">
                            <p style="font-size: 24px; font-weight: bold; margin: 0;">${item.main.temp}°C</p>
                        </div>
                        <p style="margin: 0;">Odczuwalna: ${feelsLike}°C</p>
                        <p style="margin: 0; text-transform: capitalize;">${condition}</p>
                    </div>
                `;
            });
        }
    
        this.resultBlock.innerHTML = content;
        this.resultBlock.style.display = 'block';
    }
    
    
    
    
    
    
    
};

document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

function getWeather() {
    const city = document.getElementById('cityInput').value;
    document.weatherApp.getWeather(city);
}
