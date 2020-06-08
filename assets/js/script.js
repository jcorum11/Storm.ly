var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));

// handlers
// main card
var cityCardHandler = function (weatherData, uvData) {
    // generate elements upon search
    var searchTerm = $("#search").val();
    var cityCard = $("<div>").attr("id", "cityCard").addClass("card bg-dark text-light ");
    var cityEl = $("<div>").attr("id", "city").addClass("card-body");
    var cityTopEl = $("<div>").addClass("cityTop d-inline-flex").insertBefore("#5-day").html("");;
    var cityName = $("<h2>").attr("id", "cityName").addClass("my-2").text(searchTerm);
    var weatherDate = $("<h2>").addClass("m-2").text(moment(weatherData.list[0].dt_txt).format("L"));
    var weatherImg = $("<img>").addClass("m-2").attr("src", `http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`);
    var cityWeatherSpecsEl = $("<div>").attr("id", "cityWeatherSpecsEl").html("");
    var cityTempEl = $("<h3>").text(`Temp: ${Math.round(weatherData.list[0].main.temp)}\xB0F`);
    var cityHumidityEl = $("<h3>").text(`Humidity: ${weatherData.list[0].main.humidity}%`);
    var cityWindSpeedEl = $("<h3>").text(`Wind Speed: ${weatherData.list[0].wind.speed} mph`);
    var cityUvIndexEl = $("<h3>").text(`UV Index: ${uvData[0].value}`);
    // append new elements to containers
    cityTopEl.append(cityName);
    cityTopEl.append(weatherDate);
    cityTopEl.append(weatherImg);
    cityEl.append(cityTopEl);
    cityEl.append(cityWeatherSpecsEl);
    cityCard.append(cityEl);
    cityCard.insertBefore("#5-day");
    cityWeatherSpecsEl.append(cityTempEl);
    cityWeatherSpecsEl.append(cityHumidityEl)
    cityWeatherSpecsEl.append(cityWindSpeedEl);
    // add uv data color depending on uv index
    if (uvData[0].value < 3) {
        cityUvIndexEl.addClass("bg-success");
    }
    else if (uvData[0].value > 2 && uvData[0].value < 6) {
        cityUvIndexEl.addClass("bg-warning");
    }
    else if (uvData[0].value > 5 && uvData[0].value < 8) {
        cityUvIndexEl.addClass("bg-orange");
    }
    else if (uvData[0].value > 7 && uvData[0].value < 11) {
        cityUvIndexEl.addClass("bg-danger");
    }
    else if (uvData[0].value > 11) {
        cityUvIndexEl.addClass("bg-purple")
    }
    // append final card element to DOM
    cityWeatherSpecsEl.append(cityUvIndexEl);
}

// 5 day forecast cards
var weatherCardHandler = function (weatherResult) {
    var fiveDay = $("#5-day").addClass("d-flex justify-content-between my-4").html("");
    for (var i = 0; i < 5; i++) {
        //create new elements
        var weatherCard = $("<div>").addClass("card bg-dark text-light ").attr("style", "width: 8rem");
        var weatherCardDate = $("<div>").text(moment(weatherResult.list[i].dt_txt).format("L"));
        var weatherCardImg = $("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherResult.list[i].weather[0].icon}.png`);
        var weatherCardTemp = $("<div>").text(`Temp: ${Math.round(weatherResult.list[i].main.temp)}\xB0F`);
        var weatherCardHumidity = $("<div>").text(`Humidity: ${weatherResult.list[i].main.humidity}%`);
        var weatherText = $("<div>").addClass("m-2");
        // append new elements to containers then to DOM
        weatherText.append([weatherCardDate, weatherCardImg, weatherCardTemp, weatherCardHumidity]);
        weatherCard.append(weatherText);
        fiveDay.append(weatherCard);
    }
}

// api data
var weatherDataHandler = function () {
    var searchTerm = $("#search").val();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&cnt=6&units=imperial&appid=${apiKey}`;
    // api call for 6 day weather data
    fetch(url).then(function (response) {
        // if call is successful then run historyHandler and hand off response to weatherCardHandler
        // then run another call for uv index data and hand both response objects to cityCardHandler
        if (response.ok) {
            response.json().then(function (weatherResult) {
                historyHandler();
                weatherCardHandler(weatherResult);
                // api call for 6 day uv index data
                var url = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${weatherResult.city.coord.lat}&lon=${weatherResult.city.coord.lon}&cnt=5`
                fetch(url).then(function (response) {
                    response.json().then(function(uvResult) {
                        cityCardHandler(weatherResult, uvResult);
                    })
                })
            });
        }
        else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function (error) {
        alert("unable to connect to openweathermap.org (status 200-299)");
    })
}

// previously searched items upon being clicked
var historyHandler = function () {
    var searchTerm = $("#search").val();
    var historyEl = $("#history").html("");

    if (!historyList) {
        historyList = [];
    }
    // if history exists will generate cards displaying search history
    else {
        historyList.forEach(city => {
            historyCard = $("<div>").addClass("card m-1 cityHistoryItem bg-dark text-light ");
            historyCityNameEl = $("<h4>").addClass("card-body mx-1").text(city.name);
            historyCard.append(historyCityNameEl);
            historyEl.append(historyCard);
        });
    }
    // boolean to check for matching search history items
    var inHistoryList = false;
    for (i = 0; i < historyList.length; i++) {
        if (searchTerm.toLowerCase() === historyList[i].name.toLowerCase()) {
            inHistoryList = true
        }
    }

    if (!inHistoryList) {
        historyList.push({ name: searchTerm });
        localStorage.setItem("historyList", JSON.stringify(historyList));
        
    }
}
// call historyHandler upon running script
historyHandler();

// click events
// search button
$("#form").submit(function () {
    if ($("#search").val()) {
        weatherDataHandler();
    }
    else {
        alert("Enter a valid city name");
    }
});

// history list
$(".cityHistoryItem").click(function () {
    $("#search").val($(this).text());
    weatherDataHandler();
})