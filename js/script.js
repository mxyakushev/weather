const selectedPlace = document.querySelector('.selected');
const card = document.querySelector('.card');
const todayTemperature = document.querySelector('.upper-part__temperature');
const todayTemperatureFeels = document.querySelector('.upper-part__feels-like');
const todayDescription = document.querySelector('.upper-part__description');
const city = document.querySelector('.upper-part__city');
const todayImage = document.querySelector('.upper-part__image');

const loader = document.querySelector('.loader');
const clearButton = document.querySelector('.clear');
const input = document.querySelector('.input');

const itemDays = document.querySelectorAll('.bottom-part__day');
const itemDescription = document.querySelectorAll('.bottom-part__description');
const itemMaxTemperature = document.querySelectorAll('.bottom-part__max-temperature');
const itemMinTemperature = document.querySelectorAll('.bottom-part__min-temperature');
const itemImages = document.querySelectorAll('.bottom-part__image');

const error = document.querySelector('.error');

const apiKey = '22e39bd78a4e36045fe9f0954297caa5';
const apiUrl = 'https://api.openweathermap.org/data/2.5';
let place;
const allDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// LISTENERS

document.addEventListener('keyup', (e) => {
    if(e.key == 'Enter' && input.value.trim() != ''){
        selectedPlace.innerHTML = `<span>Selected:</span> <span>${input.value}</span>`;
        getCoords(input.value);
        card.classList.add('hide');
        error.classList.add('hide');
        loader.classList.remove('hide');
    }
});

clearButton.addEventListener('click', () => {
    clearAll();
});

// FUNCTIONS

function getCoords(city){
    fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        if(data.cod == 404){
            onError();
        } else {
            place = `${data.name}, ${data.sys.country}`;
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            getWeather(lon, lat);
        }
    })
}

function getWeather(lon, lat){
    fetch(`${apiUrl}/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => weatherDetails(data))
}

function weatherDetails(weather){
    showWeather(weather);
    loader.classList.add('hide');
    error.classList.add('hide');
    card.classList.remove('hide');
}

function showWeather(weather){
    let counter = 0;

    todayTemperature.innerText = `${Math.floor(weather.current.temp)}°C`;
    todayTemperatureFeels.innerText = `Feels like ${Math.floor(weather.current.feels_like)}°C`;
    todayDescription.innerText = weather.current.weather[0].main;
    todayImage.src = weatherIcon(weather.current.weather[0].id);
    city.innerText = place;
    weather.daily.forEach((el, index) => {
        if(index != 0 && index <= 5){
            let day = new Date(el.dt * 1000);
            let dayName = allDays[day.getDay()];
            let description = el.weather[0].main;
            let maxTemp = Math.floor(el.temp.max);
            let minTemp = Math.floor(el.temp.min);
            let image = weatherIcon(el.weather[0].id);
            itemDays[counter].innerText = dayName;
            itemDescription[counter].innerText = description;
            itemMaxTemperature[counter].innerText = `${maxTemp}°C`;
            itemMinTemperature[counter].innerText = `${minTemp}°C`;
            itemImages[counter].src = image;
            counter++;
        }
    })
}

function weatherIcon(id){
    if(id >= 200 && id <= 232){
        return './img/thunderstorm.png'
    } else if(id >= 300 && id <= 321){
        return './img/drizzle.png'
    } else if (id >= 500 && id <= 531) {
        return './img/rain.png'
    } else if (id >= 600 && id <= 622) {
        return './img/snow.png'
    } else if (id >= 701 && id <= 781) {
        return './img/atmosphere.png'
    } else if (id == 800) {
        return './img/clear.png'
    } else {
        return './img/clouds.png'
    }
}

function onError(){
    loader.classList.add('hide');
    card.classList.add('hide');
    error.classList.remove('hide');
}

function clearAll(){
    input.value = '';
    selectedPlace.innerHTML = '';
    card.classList.add('hide');
    loader.classList.add('hide');
    error.classList.add('hide');
}
