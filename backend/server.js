// ============================================
// AGRIMITRA AI - BACKEND SERVER
// ============================================

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ============================================
// ROUTES
// ============================================

const authRoutes = require("./routes/auth");

const recommendationRoutes =
  require("./routes/recommendationRoutes");

const soilVisionRoutes =
  require("./routes/soilVisionRoutes");

const alertsRoutes =
  require("./routes/alertsRoutes");

// ============================================
// APP
// ============================================

const app = express();

// ============================================
// CONFIG
// ============================================

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/agrimitra";

// ============================================
// MIDDLEWARE
// ============================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ============================================
// HOME
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AgriMitra AI Backend is running.",
    service: "AgriMitra AI",
    version: "1.0.0",

    endpoints: {
      health: "/health",

      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        profile: "PUT /api/auth/profile",
      },

      weather:
        "/api/weather?city=Nashik",

      recommendations:
        "/api/recommendations",

      soilVision:
        "/api/soil-vision",

      alerts:
        "/api/alerts?city=Nashik",
    },
  });
});

// ============================================
// HEALTH
// ============================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "AgriMitra Backend",
    port: PORT,
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// ============================================
// AUTHENTICATION
// ============================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================
// WEATHER API
// ============================================

const WEATHER_API_KEY =
  process.env.WEATHER_API_KEY;

app.get("/api/weather", async (req, res) => {
  try {
    const city =
      req.query.city || "Nashik";

    if (!WEATHER_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "WEATHER_API_KEY is missing in backend .env file.",
      });
    }

    // ========================================
    // CURRENT WEATHER
    // ========================================

    const currentResponse =
      await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: "metric",
          },

          timeout: 15000,
        }
      );

    const current =
      currentResponse.data;

    // ========================================
    // FORECAST
    // ========================================

    const forecastResponse =
      await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: "metric",
          },

          timeout: 15000,
        }
      );

    const forecastData =
      forecastResponse.data;

    // ========================================
    // GROUP FORECAST BY DATE
    // ========================================

    const dailyMap = {};

    forecastData.list.forEach((item) => {
      const date =
        new Date(item.dt * 1000);

      const dateKey =
        date.toISOString().split("T")[0];

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = [];
      }

      dailyMap[dateKey].push(item);
    });

    // ========================================
    // DAILY FORECAST
    // ========================================

    const forecast =
      Object.entries(dailyMap)
        .slice(0, 7)
        .map(([dateKey, items]) => {

          const temperatures =
            items.map(
              (item) =>
                Number(
                  item.main.temp
                )
            );

          const averageTemperature =
            temperatures.reduce(
              (sum, value) =>
                sum + value,
              0
            ) / temperatures.length;

          const rainValues =
            items.map(
              (item) =>
                Number(
                  item.pop || 0
                )
            );

          const rain =
            Math.round(
              Math.max(
                ...rainValues
              ) * 100
            );

          const description =
            items[0]
              ?.weather?.[0]
              ?.description ||
            "Normal";

          const dayName =
            new Date(
              `${dateKey}T12:00:00`
            ).toLocaleDateString(
              "en-IN",
              {
                weekday: "short",
              }
            );

          return {
            day: dayName,

            date: dateKey,

            temperature:
              Math.round(
                averageTemperature
              ),

            description:
              description,

            rain: rain,
          };
        });

    // ========================================
    // RESPONSE
    // ========================================

    return res.json({
      success: true,

      city:
        current.name ||
        city,

      temperature:
        Math.round(
          current.main.temp
        ),

      feelsLike:
        Math.round(
          current.main.feels_like
        ),

      humidity:
        current.main.humidity,

      windSpeed:
        Math.round(
          (current.wind?.speed || 0) *
            3.6
        ),

      description:
        current.weather?.[0]
          ?.description ||
        "Normal",

      forecast:
        forecast,
    });

  } catch (error) {

    console.error(
      "Weather API error:",
      error.message
    );

    if (error.response) {
      return res.status(
        error.response.status || 500
      ).json({
        success: false,

        message:
          error.response.data?.message ||
          "Unable to fetch weather data.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch weather data.",

      error:
        error.message,
    });
  }
});

// ============================================
// CROP RECOMMENDATIONS
// ============================================

app.use(
  "/api/recommendations",
  recommendationRoutes
);

// ============================================
// SOIL VISION
// ============================================

app.use(
  "/api/soil-vision",
  soilVisionRoutes
);

// ============================================
// EARLY FARMING ALERTS
// ============================================

app.use(
  "/api/alerts",
  alertsRoutes
);

// ============================================
// 404
// ============================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,

      message:
        "API route not found.",

      path:
        req.originalUrl,
    });
  }
);

// ============================================
// ERROR HANDLER
// ============================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Internal server error.",
    });
  }
);

// ============================================
// START SERVER AFTER MONGODB CONNECTS
// ============================================

async function startServer() {

  try {

    console.log("");
    console.log(
      "=========================================="
    );

    console.log(
      "🌱 Starting AgriMitra AI Backend..."
    );

    console.log(
      "=========================================="
    );

    // ======================================
    // CONNECT MONGODB
    // ======================================

    console.log(
      "🍃 Connecting to MongoDB..."
    );

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "✅ MongoDB connected successfully!"
    );

    // ======================================
    // START EXPRESS
    // ======================================

    app.listen(
      PORT,
      () => {

        console.log("");

        console.log(
          "=========================================="
        );

        console.log(
          "🌱 AgriMitra AI Backend"
        );

        console.log(
          "=========================================="
        );

        console.log(
          `🚀 Server: http://localhost:${PORT}`
        );

        console.log(
          `❤️ Register: http://localhost:${PORT}/api/auth/register`
        );

        console.log(
          `🔐 Login: http://localhost:${PORT}/api/auth/login`
        );

        console.log(
          `👤 Profile: http://localhost:${PORT}/api/auth/profile`
        );

        console.log(
          `🌦️ Weather: http://localhost:${PORT}/api/weather?city=Nashik`
        );

        console.log(
          `🌱 Recommendations: http://localhost:${PORT}/api/recommendations`
        );

        console.log(
          `📷 Soil Vision: http://localhost:${PORT}/api/soil-vision`
        );

        console.log(
          `🔔 Alerts: http://localhost:${PORT}/api/alerts?city=Nashik`
        );

        console.log(
          "=========================================="
        );

        console.log("");
      }
    );

  } catch (error) {

    console.error("");

    console.error(
      "❌ FAILED TO START AGRIMITRA BACKEND"
    );

    console.error(
      "=========================================="
    );

    console.error(
      error.message
    );

    console.error(
      "=========================================="
    );

    console.error("");

    console.error(
      "Check that MongoDB is running."
    );

    process.exit(1);
  }
}

startServer();