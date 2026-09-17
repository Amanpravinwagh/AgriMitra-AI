const express = require("express");
const axios = require("axios");

const router = express.Router();


// ========================================
// WEATHER API
// ========================================

const WEATHER_API_URL =
  process.env.WEATHER_API_URL ||
  "http://localhost:5000/api/weather";


// ========================================
// ALERT GENERATION LOGIC
// ========================================

function generateAlerts(weather) {

  const alerts = [];

  if (!weather) {
    return alerts;
  }


  // ======================================
  // WEATHER VALUES
  // ======================================

  const temperature =
    Number(weather.temperature);

  const humidity =
    Number(weather.humidity);

  const windSpeed =
    Number(weather.windSpeed);


  // Forecast
  const forecast =
    Array.isArray(weather.forecast)
      ? weather.forecast
      : [];


  // ======================================
  // HIGH TEMPERATURE
  // ======================================

  if (!Number.isNaN(temperature) && temperature >= 38) {

    alerts.push({

      id: "high-temperature",

      type: "heat",

      severity: "high",

      icon: "temperature",

      title: "High Temperature Alert",

      message:
        `Temperature is currently ${temperature}°C. ` +
        "High heat may cause water stress in crops.",

      action:
        "Consider irrigation during suitable hours and monitor crops for heat stress.",

      value:
        `${temperature}°C`,

      category:
        "Temperature",

    });

  } else if (
    !Number.isNaN(temperature) &&
    temperature >= 35
  ) {

    alerts.push({

      id: "moderate-temperature",

      type: "heat",

      severity: "medium",

      icon: "temperature",

      title: "Warm Weather Alert",

      message:
        `Temperature is ${temperature}°C. ` +
        "Crops may require additional monitoring.",

      action:
        "Check soil moisture and monitor plants during the hottest part of the day.",

      value:
        `${temperature}°C`,

      category:
        "Temperature",

    });

  }


  // ======================================
  // HIGH HUMIDITY
  // ======================================

  if (!Number.isNaN(humidity) && humidity >= 85) {

    alerts.push({

      id: "high-humidity",

      type: "humidity",

      severity: "high",

      icon: "humidity",

      title: "High Humidity Alert",

      message:
        `Humidity is ${humidity}%. ` +
        "Very humid conditions can increase the risk of fungal diseases.",

      action:
        "Monitor leaves for disease symptoms and avoid unnecessary irrigation.",

      value:
        `${humidity}%`,

      category:
        "Humidity",

    });

  } else if (
    !Number.isNaN(humidity) &&
    humidity >= 70
  ) {

    alerts.push({

      id: "moderate-humidity",

      type: "humidity",

      severity: "medium",

      icon: "humidity",

      title: "High Humidity",

      message:
        `Humidity is ${humidity}%. ` +
        "Keep an eye on crop health and leaf moisture.",

      action:
        "Regularly inspect crops for signs of fungal infection.",

      value:
        `${humidity}%`,

      category:
        "Humidity",

    });

  }


  // ======================================
  // STRONG WIND
  // ======================================

  if (!Number.isNaN(windSpeed) && windSpeed >= 40) {

    alerts.push({

      id: "strong-wind",

      type: "wind",

      severity: "high",

      icon: "wind",

      title: "Strong Wind Alert",

      message:
        `Wind speed is ${windSpeed} km/h. ` +
        "Strong winds may damage crops and farm structures.",

      action:
        "Secure vulnerable plants and farm equipment. Avoid spraying during strong winds.",

      value:
        `${windSpeed} km/h`,

      category:
        "Wind",

    });

  } else if (
    !Number.isNaN(windSpeed) &&
    windSpeed >= 25
  ) {

    alerts.push({

      id: "moderate-wind",

      type: "wind",

      severity: "medium",

      icon: "wind",

      title: "Moderate Wind Alert",

      message:
        `Wind speed is ${windSpeed} km/h.`,

      action:
        "Avoid unnecessary spraying and monitor young or exposed plants.",

      value:
        `${windSpeed} km/h`,

      category:
        "Wind",

    });

  }


  // ======================================
  // FORECAST RAIN
  // ======================================

  let heavyRainFound = false;
  let rainFound = false;
  let rainDay = null;


  for (const day of forecast) {

    const rain =
      Number(day?.rain);

    if (!Number.isNaN(rain)) {

      if (rain >= 70) {

        heavyRainFound = true;

        rainDay = day;

        break;

      }

      if (rain >= 50) {

        rainFound = true;

        rainDay = day;

      }

    }

  }


  // ======================================
  // HEAVY RAIN ALERT
  // ======================================

  if (heavyRainFound) {

    alerts.push({

      id: "heavy-rain",

      type: "rain",

      severity: "high",

      icon: "rain",

      title: "Heavy Rain Expected",

      message:
        `${rainDay?.day || "Upcoming"} has a ${rainDay?.rain}% chance of rain.`,

      action:
        "Consider postponing irrigation, fertilizer application and spraying. Protect harvested produce from rain.",

      value:
        `${rainDay?.rain}%`,

      category:
        "Rainfall",

    });

  } else if (rainFound) {

    alerts.push({

      id: "rain",

      type: "rain",

      severity: "medium",

      icon: "rain",

      title: "Rain Expected",

      message:
        `${rainDay?.day || "Upcoming"} has a ${rainDay?.rain}% chance of rain.`,

      action:
        "Plan irrigation and field activities according to the expected rainfall.",

      value:
        `${rainDay?.rain}%`,

      category:
        "Rainfall",

    });

  }


  // ======================================
  // NO IMPORTANT ALERT
  // ======================================

  if (alerts.length === 0) {

    alerts.push({

      id: "normal",

      type: "normal",

      severity: "low",

      icon: "normal",

      title: "Weather Conditions Look Normal",

      message:
        "No major weather-related farming risks were detected from the available weather data.",

      action:
        "Continue monitoring your crop and follow your normal farming schedule.",

      value:
        "Normal",

      category:
        "General",

    });

  }


  return alerts;

}


// ========================================
// GET ALERTS
// ========================================

router.get("/", async (req, res) => {

  try {

    const city =
      req.query.city || "Nashik";


    // ====================================
    // GET WEATHER FROM EXISTING API
    // ====================================

    const weatherResponse =
      await axios.get(

        WEATHER_API_URL,

        {
          params: {
            city,
          },

          timeout: 15000,
        }

      );


    const weather =
      weatherResponse.data;


    // ====================================
    // GENERATE ALERTS
    // ====================================

    const alerts =
      generateAlerts(weather);


    // ====================================
    // RETURN RESPONSE
    // ====================================

    return res.json({

      success: true,

      city,

      generatedAt:
        new Date().toISOString(),

      count:
        alerts.length,

      alerts,

    });


  } catch (error) {

    console.error(
      "Alert generation error:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to generate farming alerts.",

      error:
        error.message,

    });

  }

});


module.exports = router;