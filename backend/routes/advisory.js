const express = require("express");

const router = express.Router();


router.post("/", async (req, res) => {

  try {

    const {
      temperature = 27,
      humidity = 60,
      rain = 0,
      windSpeed = 10,
      crop = "your crop"
    } = req.body;


    const alerts = [];
    const advice = [];


    // Heavy rain
    if (rain >= 70) {

      alerts.push({
        type: "rain",
        level: "high",
        title: "Heavy Rain Expected",
        message:
          `High rainfall probability detected. Avoid unnecessary irrigation for ${crop}.`
      });

      advice.push(
        "Check field drainage before heavy rainfall."
      );

      advice.push(
        "Avoid fertilizer application immediately before heavy rain."
      );
    }


    // Medium rain
    else if (rain >= 40) {

      alerts.push({
        type: "rain",
        level: "medium",
        title: "Rain Possible",
        message:
          "Rain may occur soon. Monitor soil moisture before irrigation."
      });

      advice.push(
        "Check soil moisture before watering."
      );
    }


    // High temperature
    if (temperature >= 35) {

      alerts.push({
        type: "heat",
        level: "high",
        title: "High Temperature",
        message:
          "High temperature may increase crop water stress."
      });

      advice.push(
        "Irrigate during early morning or evening."
      );

      advice.push(
        "Monitor plants for heat stress."
      );

    }


    // Humidity
    if (humidity >= 80) {

      alerts.push({
        type: "humidity",
        level: "medium",
        title: "High Humidity",
        message:
          "High humidity can increase the risk of fungal diseases."
      });

      advice.push(
        "Monitor leaves for fungal infection."
      );

    }


    // Wind
    if (windSpeed >= 30) {

      alerts.push({
        type: "wind",
        level: "high",
        title: "Strong Wind",
        message:
          "Strong wind conditions may damage crops."
      });

      advice.push(
        "Avoid spraying pesticides during strong winds."
      );

    }


    // Normal condition
    if (
      alerts.length === 0
    ) {

      advice.push(
        `Weather conditions currently look suitable for normal ${crop} field activities.`
      );

      advice.push(
        "Continue monitoring soil moisture and crop health."
      );

    }


    res.json({

      crop,

      alerts,

      advice,

      summary:
        alerts.length > 0
          ? `${alerts.length} weather-related advisory alert(s) detected.`
          : "No major weather risks detected."

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Unable to generate advisory"
    });

  }

});


module.exports = router;