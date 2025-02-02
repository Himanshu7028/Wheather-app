const apikey = "1a6b726f0569424182c70247252401";
const apiUrl = "https://api.weatherapi.com/v1/current.json?key=" + apikey + "&q=";
const searchBox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const WeatherIcon = document.querySelector(".WeatherIcon");
const tempUnitToggle = document.querySelector(".temp-unit-toggle");  

let currentUnit = 'C'; 
let currentCity = ''; 
let currentTempCelsius = null; 


function convertToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}


function convertToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}


function displayTemperature() {
    console.log('Current Temp in Celsius:', currentTempCelsius);  
    if (currentTempCelsius !== null) {
        let tempDisplay = currentTempCelsius;

        if (currentUnit === 'F') {
            tempDisplay = convertToFahrenheit(currentTempCelsius);
        }

        
        document.querySelector(".temp").innerHTML = Math.round(tempDisplay) + "°" + currentUnit;
    } else {
        
        document.querySelector(".temp").innerHTML = "N/A";
    }
}


async function checkWeatherApp(city) {
    try {
        const response = await fetch(apiUrl + city + "&aqi=no");

        
        if (!response.ok) {
            throw new Error("City not found");
        }

        let data = await response.json();
        console.log('API Data:', data); 
        
        
        if (data.current && data.current.temp_c != null) {
           
            document.querySelector(".city").innerHTML = data.location.name;
            currentCity = data.location.name; 
            currentTempCelsius = data.current.temp_c; 
            console.log('Temperature in Celsius:', currentTempCelsius); 
            displayTemperature(); 
            document.querySelector(".humidity").innerHTML = data.current.humidity + "%";
            document.querySelector(".wind").innerHTML = data.current.wind_kph + "km/h";

            
            if (data.current.condition.text == "Sunny") {
                WeatherIcon.src = "images/clear.png";
            } else if (data.current.condition.text == "Partly cloudy") {
                WeatherIcon.src = "images/clouds.png";
            } else if (data.current.condition.text == "Overcast") {
                WeatherIcon.src = "images/drizzle.png";
            } else if (data.current.condition.text == "Humidity") {
                WeatherIcon.src = "images/humidity.png";
            } else if (data.current.condition.text == "Mist") {
                WeatherIcon.src = "images/mist.png";
            } else if (data.current.condition.text == "Rain") {
                WeatherIcon.src = "images/rain.png";
            } else if (data.current.condition.text == "Light snow") {
                WeatherIcon.src = "images/snow.png";
            }
        } else {
            
            throw new Error("Temperature data not available.");
        }

    } catch (error) {
       
        document.querySelector(".city").innerHTML = "City not found!";
        document.querySelector(".temp").innerHTML = "N/A";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
        WeatherIcon.src = "";  

        alert("Error: " + error.message); 
    }
}


function getUserLocationWeather() {
    if (navigator.geolocation) {
        
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            
            const response = await fetch(`${apiUrl}${latitude},${longitude}&aqi=no`);
            if (response.ok) {
                const data = await response.json();
                checkWeatherApp(data.location.name);
            } else {
                alert("Failed to fetch weather for your location.");
            }
        }, (error) => {
            alert("Geolocation failed: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


window.addEventListener('load', getUserLocationWeather);


searchbtn.addEventListener("click", () => {
    checkWeatherApp(searchBox.value);
});

tempUnitToggle.addEventListener("click", () => {
    if (currentCity === '') {
        
        alert("Please search for a city first!");
        return; 
    }

    
    if (currentUnit === 'C') {
        currentUnit = 'F'; 
    } else {
        currentUnit = 'C'; 
    }

    displayTemperature();
});
