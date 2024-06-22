var weather_table = document.getElementById("forecast");
var loc_input = document.getElementById("location");
var current_loc = "cairo";
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
var directions = {
    "E": "East",
    "N": "North",
    "S": "South",
    "W": "West",
    "NNW":"North North-West",
    "WNW":"WEST North-West",
    "NW":"North-West",
    "NNE":"North North-East",
    "NE":"North East",
    "ENE":"East North-East",
    "ESE":"East South-East",
    "SE":"South-East",
    "SSE":"South South-East",
    "SSW":"South South-West",
    "SW":"South-West",
    "WSW":"West South-West"
}
loc_input.addEventListener("input", function () {
    current_loc = loc_input.value;
    getweather()

})

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function showLocation(position) {
    var city = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
    var result = await city.json()
    current_loc = await result["features"]["0"]["properties"]["geocoding"]["city"];
    console.log(current_loc)
    getweather()

}
getLocation()


async function getweather() {
    try {
        var x = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0f17dd4319de478a8d3204107242106&q=${current_loc}&days=3`)
        var data = await x.json();
        console.log(data)
        show(data);
    }
    catch (err) { console.log(err) }
}

function show(data) {
    var day1 = new Date(data["forecast"]["forecastday"][0]["date"]);
    var day2 = new Date(data["forecast"]["forecastday"][1]["date"]);
    var day3 = new Date(data["forecast"]["forecastday"][2]["date"]);

    var day = day1.getUTCDate();
    var month = day1.getUTCMonth();

    weather_table.innerHTML = `<div class="day1 col-md-4 px-0">
                    <div class="date py-2 d-flex justify-content-between px-2">
                        <div>
                            <p>${days[day1.getDay()]}</p>
                        </div>
                        <div>
                            <p>${day}${months[month]}</p>
                        </div>
                    </div>
                    <div class="px-3">
                        <h3 class="mt-4 mb-2">${data["location"]["name"]}</h3>
                        <p class="temp">${data["current"]["feelslike_c"]}&deg;C</p>
                        <img src="https:${data["current"]["condition"]["icon"]}" alt="icon">
                        <p class="status mb-3">${data["current"]["condition"]["text"]}</p>
                        <div class="mb-3">
                            <span>
                                <img src="images/icon-umberella.png" alt="humidity">
                                ${data["current"]["humidity"]}%
                            </span>
                            <span class="ms-3">
                                <img src="images/icon-wind.png" alt="wind">
                                ${data["current"]["wind_kph"]}km/h
                            </span>
                            <span class="ms-3">
                                <img src="images/icon-compass.png" alt="direction">
                                ${directions[data["current"]["wind_dir"]]}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="day2 text-center col-md-4 px-0">
                    <div class="date py-2">
                        <p>${days[day2.getDay()]}</p>
                    </div>
                    <div class="my-5">
                        <img src="https:${data["forecast"]["forecastday"]["1"]["day"]["condition"]["icon"]}" alt="icon">
                        <div class="mt-3 mb-4">
                            <p class="temp-day">${data["forecast"]["forecastday"]["1"]["day"]["maxtemp_c"]}&deg;C</p>
                            <p class="temp-night">${data["forecast"]["forecastday"]["1"]["day"]["mintemp_c"]}&deg;C</p>
                        </div>
                        <p class="status mb-3">${data["forecast"]["forecastday"]["1"]["day"]["condition"]["text"]}</p>
                    </div>
                </div>
                <div class="day3 text-center col-md-4 px-0">
                    <div class="date py-2">
                        <p>${days[day3.getDay()]}</p>
                    </div>
                    <div class="my-5">
                        <img src="https:${data["forecast"]["forecastday"]["2"]["day"]["condition"]["icon"]}" alt="icon">
                        <div class="mt-3 mb-4">
                            <p class="temp-day">${data["forecast"]["forecastday"]["2"]["day"]["maxtemp_c"]}&deg;C</p>
                            <p class="temp-night">${data["forecast"]["forecastday"]["2"]["day"]["mintemp_c"]}&deg;C</p>
                        </div>
                        <p class="status mb-3">${data["forecast"]["forecastday"]["2"]["day"]["condition"]["text"]}</p>

                    </div>
                </div>`
}