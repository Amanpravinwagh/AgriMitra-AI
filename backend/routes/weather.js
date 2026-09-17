const express = require("express");
const axios = require("axios");

const router = express.Router();


// GET WEATHER
router.get("/", async (req, res) => {
  try {
    const {
      city = "Nashik"
    } = req.query;

    const apiKey = process.env.WEATHER_API_KEY;

    // Demo fallback
    if (!apiKey || apiKey === "YOUR_WEATHER_API_KEY") {
      return res.json({
        city,
        country: "India",
        temperature: 29,
        feelsLike: 30,
        humidity: 64,
        windSpeed: 12,
        description: "Partly cloudy",
        icon: "02d",
        forecast: [
          {
            day: "Today",
            temperature: 29,
            description: "Partly cloudy",
            rain: 20
          },
          {
            day: "Tomorrow",
            temperature: 28,
            description: "Light rain",
            rain: 65
          },
          {
            day: "Wednesday",
            temperature: 27,
            description: "Rain",
            rain: 75
          },
          {
            day: "Thursday",
            temperature: 30,
            description: "Sunny",
            rain: 10
          },
          {
            day: "Friday",
            temperature: 31,
            description: "Sunny",
            rain: 5
          },
          {
            day: "Saturday",
            temperature: 29,
            description: "Cloudy",
            rain: 30
          },
          {
            day: "Sunday",
            temperature: 28,
            description: "Light rain",
            rain: 55
          }
        ]
      });
    }


    // OpenWeather current weather
    const currentResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: `${city},IN`,
          appid: apiKey,
          units: "metric"
        }
      }
    );


    const current = currentResponse.data;


    // 5 day forecast
    const forecastResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: `${city},IN`,
          appid: apiKey,
          units: "metric"
        }
      }
    );


    const forecastData = forecastResponse.data;

    const daily = {};

    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!daily[date]) {
        daily[date] = item;
      }
    });


    const forecast = Object.keys(daily)
      .slice(0, 7)
      .map((date, index) => ({
        day:
          index === 0
            ? "Today"
            : new Date(date).toLocaleDateString(
                "en-IN",
                { weekday: "long" }
              ),

        temperature: Math.round(
          daily[date].main.temp
        ),

        description:
          daily[date].weather[0].description,

        rain: Math.round(
          (daily[date].pop || 0) * 100
        )
      }));


    res.json({
      city: current.name,
      country: current.sys.country,
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      description:
        current.weather[0].description,
      icon: current.weather[0].icon,
      forecast
    });

  } catch (error) {
    console.error(
      "Weather Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Unable to fetch weather"
    });
  }
});


module.exports = router;