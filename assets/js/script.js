var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));

// change string to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// handlers
// main card
var cityCardHandler = function (weatherData, uvData) {
    // generate elements upon search
    var searchTerm = toTitleCase($("#search").val());
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
    var cityUvIndexEl = $("<h3>").text(`UV Index:`);
    var uvDataSpan = $("<span>").text(uvData[0].value).addClass("mx-1 px-1");
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
        uvDataSpan.addClass("bg-success");
    }
    else if (uvData[0].value > 2 && uvData[0].value < 6) {
        uvDataSpan.addClass("bg-warning");
    }
    else if (uvData[0].value > 5 && uvData[0].value < 8) {
        uvDataSpan.addClass("bg-orange");
    }
    else if (uvData[0].value > 7 && uvData[0].value < 11) {
        uvDataSpan.addClass("bg-danger");
    }
    else if (uvData[0].value > 11) {
        uvDataSpan.addClass("bg-purple");
    }
    // append final card element to DOM
    cityUvIndexEl.append(uvDataSpan);
    cityWeatherSpecsEl.append(cityUvIndexEl);
}

// 5 day forecast cards
var weatherCardHandler = function (weatherResult) {
    var fiveDay = $("#5-day").addClass("d-flex justify-content-between my-4").html("");
    for (var i = 0; i < 40; i+=8) {
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
    var searchTerm = toTitleCase($("#search").val().trim());
    $("#cityCard").remove();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&units=imperial&appid=${apiKey}`;
    // api call for 6 day weather data
    fetch(url).then(function (response) {
        // if call is successful then run historyHandler and hand off response to weatherCardHandler
        // then run another call for uv index data and hand both response objects to cityCardHandler
        if (response.ok) {
            response.json().then(function (weatherResult) {
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
        alert("unable to connect to openweathermap.org (status not 200-299)");
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
            if (city.name !== "") {
                historyCard = $("<div>").addClass("card m-1 cityHistoryItem bg-dark text-light ");
                historyCityNameEl = $("<h4>").addClass("card-body mx-1").text(city.name);
                historyCard.append(historyCityNameEl);
                historyEl.append(historyCard);
            }
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
    $(".cityHistoryItem").click(function (event) {
        event.preventDefault()
        $("#search").val($(this).text());
        weatherDataHandler();
    })
}
// call historyHandler upon running script
historyHandler();

// click events
// search button
$("#form").submit(function (event) {
    event.preventDefault()
    if ($("#search").val()) {
        historyHandler();
        weatherDataHandler();
    }
    else {
        alert("Enter a valid city name");
    }
});