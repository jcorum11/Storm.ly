var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));


$("#submit").click(function() {
    var cityName = $("#search").val();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    var historyEl = $("#history");
    if (!historyList) {
        historyList = [];
    }
    historyList.push({name: cityName});
    localStorage.setItem("historyList", JSON.stringify(historyList));
    historyList.forEach(city => {
        historyCityNameEl = $("<h4>").addClass("cityHistoryItem").text(city.name);
        historyEl.append(historyCityNameEl);
    });

    fetch(url).then(function(response) {
        if (response.ok) {
            response.json();
        }
    })
    var cityWeatherSpecsEl = $("<div>");
    cityWeatherSpecsEl.attr("id", "cityWeatherSpecsEl");
    var cityNameEl = $("<h2>").text(cityName);
    cityWeatherSpecsEl.append(cityNameEl);
    var cityTempEl = $("<h3>").text("Temp:");
    cityWeatherSpecsEl.append(cityTempEl);
    var cityHumidityEl = $("<h3>").text("Humidity");
    cityWeatherSpecsEl.append(cityHumidityEl)
    var cityWindSpeedEl = $("<h3>").text("Wind Speed:");
    cityWeatherSpecsEl.append(cityWindSpeedEl);
    var cityUvIndexEl = $("<h3>").text("UV Index:");
    cityWeatherSpecsEl.append(cityUvIndexEl);
    var cityEl = $("#city");
    cityEl.append(cityWeatherSpecsEl);
})



