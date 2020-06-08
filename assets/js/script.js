var apiKey = "a2dfa14dde9a15c432f7f0a5cb10b4a7";
var historyList = JSON.parse(localStorage.getItem("historyList"));

var weatherHandler = function () {
    var searchTerm = $("#search").val();
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&cnt=6&units=imperial&appid=${apiKey}`;
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (result) {
                historyHandler();
                var cityCard = $("<div>").attr("id", "cityCard").addClass("card bg-dark text-light shadow")
                var cityEl = $("<div>").attr("id", "city").addClass("card-body")
                var cityTopEl = $("<div>").addClass("cityTop d-inline-flex").insertBefore("#5-day");;
                var cityName = $("<h2>").attr("id", "cityName").addClass("my-2").text(searchTerm);
                var weatherDate = $("<h2>").addClass("m-2").text(moment(result.list[0].dt_txt).format("L"));
                var weatherImg = $("<img>").addClass("m-2").attr("src", `http://openweathermap.org/img/wn/${result.list[0].weather[0].icon}.png`);
                cityTopEl.html("")
                cityTopEl.append(cityName);
                cityTopEl.append(weatherDate);
                cityTopEl.append(weatherImg);
                cityEl.append(cityTopEl)
                var cityWeatherSpecsEl = $("<div>");
                cityWeatherSpecsEl.attr("id", "cityWeatherSpecsEl");
                cityEl.append(cityWeatherSpecsEl);
                cityCard.append(cityEl);
                cityCard.insertBefore("#5-day")
                var cityWeatherSpecsEl = $("#cityWeatherSpecsEl");
                cityWeatherSpecsEl.html("");
                var cityTempEl = $("<h3>").text(`Temp: ${Math.round(result.list[0].main.temp)}\xB0F`);
                cityWeatherSpecsEl.append(cityTempEl);
                var cityHumidityEl = $("<h3>").text(`Humidity: ${result.list[0].main.humidity}%`);
                cityWeatherSpecsEl.append(cityHumidityEl)
                var cityWindSpeedEl = $("<h3>").text(`Wind Speed: ${result.list[0].wind.speed} mph`);
                cityWeatherSpecsEl.append(cityWindSpeedEl);
                var fiveDay = $("#5-day").addClass("d-flex justify-content-between my-4");
                fiveDay.html("")
                // var container = $("<div>").addClass("d-inline-flex justify-content-between");
                // fiveDay.append(container);
                for (var i = 0; i < 5; i++) {
                    var weatherCard = $("<div>").addClass("card bg-dark text-light shadow").attr("style", "width: 8rem");
                    var weatherCardDate = $("<div>").text(moment(result.list[i].dt_txt).format("L"));
                    var weatherCardImg = $("<img>").attr("src", `http://openweathermap.org/img/wn/${result.list[i].weather[0].icon}.png`);
                    var weatherCardTemp = $("<div>").text(`Temp: ${Math.round(result.list[i].main.temp)}\xB0F`);
                    var weatherCardHumidity = $("<div>").text(`Humidity: ${result.list[i].main.humidity}%`);
                    var weatherText = $("<div>").addClass("m-2");
                    weatherText.append([weatherCardDate, weatherCardImg, weatherCardTemp, weatherCardHumidity]);
                    weatherCard.append(weatherText);
                    fiveDay.append(weatherCard);
                }
                var url = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${result.city.coord.lat}&lon=${result.city.coord.lon}&cnt=5`
                fetch(url).then(function (response) {
                    response.json().then(function(result) {
                        var cityUvIndexEl = $("<h3>").text(`UV Index: ${result[0].value}`);
                        if (result[0].value < 3) {
                            cityUvIndexEl.addClass("bg-success");
                        }
                        else if (result[0].value > 2 && result[0].value < 6) {
                            cityUvIndexEl.addClass("bg-warning");
                        }
                        else if (result[0].value > 5 && result[0].value < 8) {
                            cityUvIndexEl.addClass("bg-orange");
                        }
                        else if (result[0].value > 7 && result[0].value < 11) {
                            cityUvIndexEl.addClass("bg-danger");
                        }
                        else if (result[0].value > 11) {
                            cityUvIndexEl.addClass("bg-purple")
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
        alert("unable to connect to openweathermap.org (status 200-299)");
    })
}

var historyHandler = function () {
    var searchTerm = $("#search").val();
    var historyEl = $("#history");
    historyEl.html("")

    if (!historyList) {
        historyList = [];
    }
    else {
        historyList.forEach(city => {
            historyCard = $("<div>").addClass("card m-1 cityHistoryItem bg-dark text-light shadow");
            historyCityNameEl = $("<h4>").addClass("card-body mx-1").text(city.name);
            historyCard.append(historyCityNameEl);
            historyEl.append(historyCard);
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
$("#form").submit(function () {
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