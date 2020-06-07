var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));

var weatherHandler = function () {
    var searchTerm = $("#search").val();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&cnt=6&appid=${apiKey}`;
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (result) {
                historyHandler();
                var cityWeatherSpecsEl = $("#cityWeatherSpecsEl");
                cityWeatherSpecsEl.html("");
                var cityTempEl = $("<h3>").text(`Temp: ${result.list[0].main.temp}`);
                cityWeatherSpecsEl.append(cityTempEl);
                var cityHumidityEl = $("<h3>").text(`Humidity: ${result.list[0].main.humidity}`);
                cityWeatherSpecsEl.append(cityHumidityEl)
                var cityWindSpeedEl = $("<h3>").text(`Wind Speed: ${result.list[0].wind.speed}`);
                cityWeatherSpecsEl.append(cityWindSpeedEl);
                var weatherDate = $("<h2>").text(moment(result.list[0].dt_txt).format("L"));
                var weatherImg = $("<img>").attr("src", `http://openweathermap.org/img/wn/${result.list[0].weather[0].icon}.png`);
                var cityNameEl = $("#cityName");
                cityNameEl.html("")
                cityNameEl.append(weatherDate);
                cityNameEl.append(weatherImg);

                var fiveDay = $("#5-day").addClass("container")
                fiveDay.html("")
                var row = $("<div>").addClass("row");
                fiveDay.append(row);
                for (var i = 0; i < 5; i++) {
                    var weatherCard = $("<div>").addClass("card col-sm-2 m-1");
                    var weatherCardDate = $("<div>").text(moment(result.list[i].dt_txt).format("L"));
                    var weatherCardImg = $("<img>").attr("src", `http://openweathermap.org/img/wn/${result.list[i].weather[0].icon}.png`);
                    var weatherCardTemp = $("<div>").text(`Temp: ${result.list[i].main.temp}`);
                    var weatherCardHumidity = $("<div>").text(`Humidity: ${result.list[i].main.humidity}`);
                    var weatherText = $("<div>").addClass("card-body");
                    weatherText.append([weatherCardDate, weatherCardImg, weatherCardTemp, weatherCardHumidity]);
                    weatherCard.append(weatherText);
                    row.append(weatherCard);
                }
                var url = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${result.city.coord.lat}&lon=${result.city.coord.lon}&cnt=5`
                fetch(url).then(function (response) {
                    response.json().then(function(result) {
                        var cityUvIndexEl = $("<h3>").text(`UV Index: ${result[0].value}`);
                        if (result[0].value < 3) {
                            cityUvIndexEl.addClass("bg-success");
                        }
                        else if (result[0].value > 3 && result[0].value < 7) {
                            cityUvIndexEl.addClass("bg-warning");
                        }
                        else if (result[0].value > 6) {
                            cityUvIndexEl.addClass("bg-danger");
                        }
                        cityWeatherSpecsEl.append(cityUvIndexEl);
                    })
                })
            });
        }
        else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function (error) {
        alert("unable to connect to openweathermap.org");
    })
}

var historyHandler = function () {
    var searchTerm = $("#search").val();
    var historyEl = $("#history");
    historyEl.html("")
    var cityEl = $("#city")
    var cityNameEl = $("<h2>").text(searchTerm).attr("id", "cityName");
    cityEl.append(cityNameEl);
    var cityWeatherSpecsEl = $("<div>");
    cityWeatherSpecsEl.attr("id", "cityWeatherSpecsEl");
    cityEl.append(cityWeatherSpecsEl);

    if (!historyList) {
        historyList = [];
    }
    else {
        historyList.forEach(city => {
            historyCityNameEl = $("<h4>").addClass("cityHistoryItem").text(city.name);
            historyEl.append(historyCityNameEl);
        });
    }

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

historyHandler();

// click event for search button
$("#submit").click(function () {
    if ($("#search").val()) {
        weatherHandler();
    }
    else {
        alert("Enter a valid city name");
    }
});

$(".cityHistoryItem").click(function () {
    $("#search").val($(this).text());
    weatherHandler();
})