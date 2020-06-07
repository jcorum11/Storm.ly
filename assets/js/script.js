var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));

var weatherHandler = function () {
    var searchTerm = $("#search").val();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&cnt=6&appid=${apiKey}`;
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (result) {
                var cityWeatherSpecsEl = $("#cityWeatherSpecsEl");
                var cityTempEl = $("<h3>").text(`Temp: ${result.list[0].main.temp}`);
                cityWeatherSpecsEl.append(cityTempEl);
                var cityHumidityEl = $("<h3>").text(`Humidity: ${result.list[0].main.humidity}`);
                cityWeatherSpecsEl.append(cityHumidityEl)
                var cityWindSpeedEl = $("<h3>").text(`Wind Speed: ${result.list[0].wind.speed}`);
                cityWeatherSpecsEl.append(cityWindSpeedEl);
                var fiveDay = $("#5-day").addClass("container")
                var row = $("<div>").addClass("row");
                fiveDay.append(row);
                for (var i = 0; i < 5; i++) {
                    var weatherCard = $("<div>").addClass("card col-sm-2 m-1");
                    var weatherText = $("<div>").text("some text").addClass("card-body");
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
    })
}

// click event for search button
$("#submit").click(function () {
    var searchTerm = $("#search").val();
    var historyEl = $("#history");
    var cityEl = $("#city")
    var cityNameEl = $("<h2>").text(searchTerm);
    cityEl.append(cityNameEl);
    var cityWeatherSpecsEl = $("<div>");
    cityWeatherSpecsEl.attr("id", "cityWeatherSpecsEl");
    cityEl.append(cityWeatherSpecsEl);
    if (!historyList) {
        historyList = [];
    }

    historyList.push({ name: searchTerm });
    localStorage.setItem("historyList", JSON.stringify(historyList));
    historyList.forEach(city => {
        historyCityNameEl = $("<h4>").addClass("cityHistoryItem").text(city.name);
        historyEl.append(historyCityNameEl);
    });

    weatherHandler();
});
