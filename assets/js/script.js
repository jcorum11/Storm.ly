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
                console.log(cityWeatherSpecsEl.html())
                var cityHumidityEl = $("<h3>").text(`Humidity: ${result.list[0].main.humidity}`);
                cityWeatherSpecsEl.append(cityHumidityEl)
                var cityWindSpeedEl = $("<h3>").text(`Wind Speed: ${result.list[0].wind.speed}`);
                cityWeatherSpecsEl.append(cityWindSpeedEl);
            })
        };
    })
}

var uvHandler = function () {
    // var cityWeatherSpecsEl = $("#cityWeatherSpecsEl");
    // var searchTerm = $("#search").val();
    // var url = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=29.7633&lon=-95.3633&cnt=5`
    // fetch(url)
    //     .then(function (response) {
    //         if (response.ok) {
    //             response.json()
    //         }
    //     })
    //     .then(function (response) {
    //         var cityUvIndexEl = $("<h3>").text(`UV Index: ${response}`);
    //         cityWeatherSpecsEl.append(cityUvIndexEl);
    //         var cityEl = $("#city");
    //         cityEl.append(cityWeatherSpecsEl);
    //     })
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
    console.log(cityEl.html())
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
    uvHandler()
});


