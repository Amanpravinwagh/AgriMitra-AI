const express = require("express");
const axios = require("axios");

const router = express.Router();


// =====================================
// PYTHON AI SERVICE
// =====================================

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000";


// =====================================
// POST /api/recommendations
// =====================================

router.post("/", async (req, res) => {

  try {

    const {
      location,
      soil,
      water,
      season,

      nitrogen,
      phosphorus,
      potassium,

      temperature,
      humidity,
      ph,
      rainfall
    } = req.body;


    // ---------------------------------
    // VALIDATION
    // ---------------------------------

    if (
      nitrogen === undefined ||
      phosphorus === undefined ||
      potassium === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      ph === undefined ||
      rainfall === undefined
    ) {

      return res.status(400).json({

        success: false,

        message:
          "N, P, K, temperature, humidity, pH and rainfall are required."

      });

    }


    // ---------------------------------
    // SEND DATA TO PYTHON AI
    // ---------------------------------

    const response = await axios.post(

      `${AI_SERVICE_URL}/predict`,

      {

        nitrogen:
          Number(nitrogen),

        phosphorus:
          Number(phosphorus),

        potassium:
          Number(potassium),

        temperature:
          Number(temperature),

        humidity:
          Number(humidity),

        ph:
          Number(ph),

        rainfall:
          Number(rainfall),

        location:
          location || "Unknown",

        soil:
          soil || "Unknown",

        water:
          water || "Medium",

        season:
          season || "Kharif"

      },

      {
        timeout: 15000
      }

    );


    // ---------------------------------
    // SEND AI RESULT TO REACT
    // ---------------------------------

    res.json({

      success: true,

      data:
        response.data

    });

  }

  catch (error) {

    console.error(
      "AI service error:",
      error.message
    );


    if (
      error.code ===
      "ECONNREFUSED"
    ) {

      return res.status(503).json({

        success: false,

        message:
          "AI service is not running. Start the Python service on port 8000."

      });

    }


    res.status(500).json({

      success: false,

      message:
        "Unable to get AI crop recommendations."

    });

  }

});


module.exports = router;