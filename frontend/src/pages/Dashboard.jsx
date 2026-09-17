import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  LogOut,
  User,
  Leaf,
  CloudRain,
  RefreshCw,
  Sparkles,
  Bell,
  ArrowRight,
  Sprout,
  CalendarDays,
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Tractor,
  CircleHelp,
  Wheat,
  CheckCircle2,
  MessageCircle,
  Send,
  Menu,
  X,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  // ---------------- USER ----------------

  const [user] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("agrimitra_user")) || {}
      );
    } catch {
      return {};
    }
  });

  const city = user?.location || "Jalgaon";

  // ---------------- WEATHER ----------------

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  // ---------------- MOBILE MENU ----------------

  const [mobileMenu, setMobileMenu] = useState(false);

  // ---------------- VOICE ----------------

  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [voiceText, setVoiceText] = useState("");
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const [assistantError, setAssistantError] = useState("");

  const [recognition, setRecognition] = useState(null);

  // =====================================================
  // WEATHER
  // =====================================================

  const loadWeather = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError("");

      const response = await API.get(
        `/weather?city=${encodeURIComponent(city)}`
      );

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message || "Weather unavailable"
        );
      }

      setWeather(response.data);
    } catch (error) {
      console.error(error);

      setWeatherError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load weather."
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [city]);

  // =====================================================
  // WEATHER VALUES
  // =====================================================

  const temperature = Number(weather?.temperature || 0);
  const humidity = Number(weather?.humidity || 0);
  const windSpeed = Number(weather?.windSpeed || 0);

  const rainProbability = Number(
    weather?.forecast?.[0]?.rain ||
      weather?.forecast?.[0]?.rainProbability ||
      weather?.forecast?.[0]?.pop ||
      0
  );

  // =====================================================
  // WEATHER MESSAGE
  // =====================================================

  const getWeatherMessage = () => {
    if (rainProbability >= 70) {
      return "Rain is likely. Avoid unnecessary irrigation and protect harvested crops.";
    }

    if (temperature >= 38) {
      return "High temperature detected. Monitor crop stress and soil moisture.";
    }

    if (humidity >= 85) {
      return "Humidity is high. Monitor crops for fungal diseases.";
    }

    if (windSpeed >= 40) {
      return "Strong winds are expected. Protect young plants and weak crops.";
    }

    return "Weather conditions look suitable. Continue monitoring your crop and soil.";
  };

  // =====================================================
  // IRRIGATION
  // =====================================================

  const getIrrigationAdvice = () => {
    if (rainProbability >= 75) {
      return {
        title: "Delay Irrigation",
        text: "Rain is likely. You may not need irrigation today.",
        type: "rain",
      };
    }

    if (rainProbability >= 60) {
      return {
        title: "Rain May Be Coming",
        text: "Check soil moisture before irrigating.",
        type: "rain",
      };
    }

    if (temperature >= 38) {
      return {
        title: "Monitor Soil Moisture",
        text: "High temperature can increase water loss. Check your soil.",
        type: "hot",
      };
    }

    if (temperature >= 34 && humidity < 55) {
      return {
        title: "Irrigation May Be Needed",
        text: "Check the soil. Irrigate if the soil is dry.",
        type: "water",
      };
    }

    return {
      title: "Check Soil Before Irrigation",
      text: "Weather alone cannot determine irrigation. Check actual soil moisture.",
      type: "normal",
    };
  };

  const irrigation = getIrrigationAdvice();

  // =====================================================
  // VOICE LANGUAGES
  // =====================================================

  const languages = [
    {
      code: "en-IN",
      name: "English",
    },
    {
      code: "hi-IN",
      name: "हिंदी",
    },
    {
      code: "mr-IN",
      name: "मराठी",
    },
  ];

  // =====================================================
  // VOICE ANSWER
  // =====================================================

  const generateVoiceAnswer = (question, language) => {
    const q = String(question || "").toLowerCase();

    const temp = Math.round(temperature);
    const hum = Math.round(humidity);
    const wind = Math.round(windSpeed);
    const rain = Math.round(rainProbability);

    // ---------------- HINDI ----------------

    if (language === "hi-IN") {
      if (
        q.includes("पानी") ||
        q.includes("सिंचाई") ||
        q.includes("irrigat")
      ) {
        if (rain >= 75) {
          return "आज सिंचाई करने की आवश्यकता नहीं हो सकती है। बारिश की संभावना अधिक है।";
        }

        return "आज सिंचाई करने से पहले मिट्टी की नमी जांच लें। यदि मिट्टी सूखी है तो सिंचाई करें।";
      }

      if (
        q.includes("मौसम") ||
        q.includes("weather")
      ) {
        return `आज ${city} में तापमान ${temp} डिग्री सेल्सियस है। नमी ${hum} प्रतिशत है और बारिश की संभावना ${rain} प्रतिशत है।`;
      }

      if (
        q.includes("बारिश") ||
        q.includes("rain")
      ) {
        return `आज बारिश की संभावना ${rain} प्रतिशत है।`;
      }

      if (
        q.includes("तापमान") ||
        q.includes("temperature")
      ) {
        return `आज का तापमान ${temp} डिग्री सेल्सियस है।`;
      }

      if (
        q.includes("नमी") ||
        q.includes("humidity")
      ) {
        return `आज हवा में नमी ${hum} प्रतिशत है।`;
      }

      if (
        q.includes("हवा") ||
        q.includes("wind")
      ) {
        return `आज हवा की गति ${wind} किलोमीटर प्रति घंटा है।`;
      }

      if (
        q.includes("नमस्ते") ||
        q.includes("hello") ||
        q.includes("hi")
      ) {
        return "नमस्ते! मैं अग्रीमित्र हूँ। मैं आपको मौसम, सिंचाई और खेती से संबंधित जानकारी दे सकता हूँ।";
      }

      return "मैं मौसम, बारिश, तापमान, नमी और सिंचाई से संबंधित सवालों में आपकी मदद कर सकता हूँ।";
    }

    // ---------------- MARATHI ----------------

    if (language === "mr-IN") {
      if (
        q.includes("पाणी") ||
        q.includes("सिंचन") ||
        q.includes("irrigat") ||
        q.includes("water")
      ) {
        if (rain >= 75) {
          return "आज पिकाला पाणी देण्याची गरज नसू शकते. पावसाची शक्यता जास्त आहे.";
        }

        return "आज पाणी देण्यापूर्वी मातीतील ओलावा तपासा. माती कोरडी असल्यास सिंचन करा.";
      }

      if (
        q.includes("हवामान") ||
        q.includes("weather")
      ) {
        return `आज ${city} मध्ये तापमान ${temp} अंश सेल्सिअस आहे. आर्द्रता ${hum} टक्के आहे आणि पावसाची शक्यता ${rain} टक्के आहे.`;
      }

      if (
        q.includes("पाऊस") ||
        q.includes("पावस") ||
        q.includes("rain")
      ) {
        return `आज पावसाची शक्यता ${rain} टक्के आहे.`;
      }

      if (
        q.includes("तापमान") ||
        q.includes("temperature")
      ) {
        return `आजचे तापमान ${temp} अंश सेल्सिअस आहे.`;
      }

      if (
        q.includes("आर्द्रता") ||
        q.includes("ओलावा") ||
        q.includes("humidity")
      ) {
        return `आज हवेतील आर्द्रता ${hum} टक्के आहे.`;
      }

      if (
        q.includes("वारा") ||
        q.includes("wind")
      ) {
        return `आज वाऱ्याचा वेग ${wind} किलोमीटर प्रति तास आहे.`;
      }

      if (
        q.includes("नमस्कार") ||
        q.includes("hello") ||
        q.includes("hi")
      ) {
        return "नमस्कार! मी अग्रीमित्र आहे. मी तुम्हाला हवामान, सिंचन आणि शेतीशी संबंधित माहिती देऊ शकतो.";
      }

      return "मी हवामान, पाऊस, तापमान, आर्द्रता आणि सिंचनाशी संबंधित प्रश्नांची माहिती देऊ शकतो.";
    }

    // ---------------- ENGLISH ----------------

    if (
      q.includes("irrigat") ||
      q.includes("water")
    ) {
      if (rain >= 75) {
        return "You may not need irrigation today because the chance of rain is high.";
      }

      return "Check the actual soil moisture before irrigation. If the soil is dry, irrigation may be needed.";
    }

    if (
      q.includes("weather") ||
      q.includes("today")
    ) {
      return `Today's weather in ${city}: temperature is ${temp} degrees Celsius, humidity is ${hum} percent, and rain probability is ${rain} percent.`;
    }

    if (
      q.includes("rain")
    ) {
      return `The chance of rain today is ${rain} percent.`;
    }

    if (
      q.includes("temperature")
    ) {
      return `Today's temperature is ${temp} degrees Celsius.`;
    }

    if (
      q.includes("humidity")
    ) {
      return `Today's humidity is ${hum} percent.`;
    }

    if (
      q.includes("wind")
    ) {
      return `Today's wind speed is ${wind} kilometers per hour.`;
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return "Hello! I am AgriMitra. I can help you with weather, irrigation and farming questions.";
    }

    return "I can help you with weather, rain, temperature, humidity, irrigation and farming questions.";
  };

  // =====================================================
  // TEXT TO SPEECH
  // =====================================================

  const speakAnswer = (text, language = voiceLanguage) => {
    if (!text) return;

    if (!window.speechSynthesis) {
      setAssistantError(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = language;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const languageCode =
      language.split("-")[0].toLowerCase();

    const matchingVoice = voices.find(
      (voice) =>
        voice.lang
          ?.toLowerCase()
          .startsWith(languageCode)
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // =====================================================
  // STOP SPEECH
  // =====================================================

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // =====================================================
  // START LISTENING
  // =====================================================

  const startListening = () => {
    setAssistantError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAssistantError(
        "Voice recognition is not supported. Please use Chrome or Edge."
      );
      return;
    }

    try {
      const speech = new SpeechRecognition();

      speech.lang = voiceLanguage;
      speech.continuous = false;
      speech.interimResults = false;
      speech.maxAlternatives = 1;

      speech.onstart = () => {
        setIsListening(true);
      };

      speech.onresult = (event) => {
        const text =
          event.results?.[0]?.[0]?.transcript || "";

        setVoiceText(text);

        const answer = generateVoiceAnswer(
          text,
          voiceLanguage
        );

        setVoiceAnswer(answer);

        speakAnswer(answer, voiceLanguage);
      };

      speech.onerror = (event) => {
        console.error(event.error);

        setIsListening(false);

        if (event.error === "not-allowed") {
          setAssistantError(
            "Please allow microphone permission in your browser."
          );
        } else {
          setAssistantError(
            "I could not understand your voice. Please try again."
          );
        }
      };

      speech.onend = () => {
        setIsListening(false);
      };

      setRecognition(speech);

      speech.start();
    } catch (error) {
      console.error(error);
      setIsListening(false);
    }
  };

  // =====================================================
  // STOP LISTENING
  // =====================================================

  const stopListening = () => {
    try {
      recognition?.stop();
    } catch {
      // ignore
    }

    setIsListening(false);
  };

  // =====================================================
  // ASK TEXT QUESTION
  // =====================================================

  const askTextQuestion = () => {
    if (!voiceText.trim()) return;

    setAssistantError("");

    const answer = generateVoiceAnswer(
      voiceText,
      voiceLanguage
    );

    setVoiceAnswer(answer);

    speakAnswer(answer, voiceLanguage);
  };

  // =====================================================
  // QUICK QUESTION
  // =====================================================

  const askQuickQuestion = (question) => {
    setVoiceText(question);

    const answer = generateVoiceAnswer(
      question,
      voiceLanguage
    );

    setVoiceAnswer(answer);

    speakAnswer(answer, voiceLanguage);
  };

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const changeLanguage = (event) => {
    const language = event.target.value;

    setVoiceLanguage(language);
    setVoiceText("");
    setVoiceAnswer("");
    setAssistantError("");

    stopSpeaking();
    stopListening();
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    stopSpeaking();

    try {
      recognition?.stop();
    } catch {
      // ignore
    }

    localStorage.removeItem("agrimitra_token");
    localStorage.removeItem("agrimitra_user");

    navigate("/login");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div
          className="brand"
          onClick={() => navigate("/dashboard")}
        >
          <div className="brand-logo">
            <Leaf size={27} />
          </div>

          <div>
            <h2>AgriMitra</h2>
            <span>Smart Farming Assistant</span>
          </div>
        </div>

        <nav className="desktop-nav">

          <button
            onClick={() => navigate("/dashboard")}
            className="active"
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/recommendations")
            }
          >
            Recommendations
          </button>

          <button
            onClick={() =>
              navigate("/soil-vision")
            }
          >
            Soil Vision
          </button>

          <button
            onClick={() => navigate("/alerts")}
          >
            Alerts
          </button>

        </nav>

        <div className="topbar-right">

          <button
            className="notification-btn"
            onClick={() => navigate("/alerts")}
          >
            <Bell size={21} />
            <span className="notification-dot" />
          </button>

          <button
            className="user-btn"
            onClick={() => navigate("/profile")}
          >
            <div className="avatar">
              {(user?.name || "F")
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>
              {user?.name || "Farmer"}
            </span>
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>

        </div>

      </header>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (
        <div className="mobile-menu">

          <button
            onClick={() => {
              navigate("/dashboard");
              setMobileMenu(false);
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/recommendations");
              setMobileMenu(false);
            }}
          >
            Recommendations
          </button>

          <button
            onClick={() => {
              navigate("/soil-vision");
              setMobileMenu(false);
            }}
          >
            Soil Vision
          </button>

          <button
            onClick={() => {
              navigate("/alerts");
              setMobileMenu(false);
            }}
          >
            Alerts
          </button>

        </div>
      )}

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <span className="hero-badge">
              <Sprout size={15} />
              SMART FARMING
            </span>

            <h1>
              Welcome back,{" "}
              {user?.name || "Farmer"} 👋
            </h1>

            <p>
              Get intelligent weather insights,
              crop recommendations and farming
              alerts — all in one place.
            </p>

            <div className="hero-location">
              <MapPin size={17} />
              <span>
                Your farm: <strong>{city}</strong>
              </span>
            </div>

          </div>

          <div className="hero-illustration">
            <div className="hero-circle">
              <Sprout size={75} />
            </div>

            <div className="floating-card">
              <Leaf size={17} />
              <span>Smart Farming</span>
            </div>
          </div>

        </section>

        {/* ================= WEATHER ================= */}

        <section className="section">

          <div className="section-title-row">

            <div>
              <span className="section-label">
                LIVE WEATHER
              </span>

              <h2>
                Today's Weather
              </h2>
            </div>

            <button
              className="refresh-btn"
              onClick={loadWeather}
              disabled={weatherLoading}
            >
              <RefreshCw
                size={17}
                className={
                  weatherLoading
                    ? "spin"
                    : ""
                }
              />
              Refresh
            </button>

          </div>

          {weatherLoading ? (

            <div className="loading-box">
              <RefreshCw
                size={28}
                className="spin"
              />
              <span>
                Loading weather...
              </span>
            </div>

          ) : weatherError ? (

            <div className="error-box">
              <AlertTriangle size={24} />

              <div>
                <strong>
                  Weather unavailable
                </strong>

                <p>
                  {weatherError}
                </p>
              </div>

              <button onClick={loadWeather}>
                Retry
              </button>
            </div>

          ) : (

            <div className="weather-container">

              {/* Main Weather */}

              <div className="weather-main">

                <div className="weather-location">
                  <MapPin size={16} />
                  {weather?.city || city}
                </div>

                <div className="weather-temperature">
                  {Math.round(temperature)}
                  <span>°C</span>
                </div>

                <div className="weather-description">
                  {weather?.description ||
                    "Current conditions"}
                </div>

                <CloudSun
                  className="big-weather-icon"
                  size={72}
                />

                <div className="weather-advice">
                  <Sparkles size={17} />
                  <span>
                    {getWeatherMessage()}
                  </span>
                </div>

              </div>

              {/* Weather Stats */}

              <div className="weather-stats">

                <div className="weather-stat">
                  <div className="stat-icon">
                    <Thermometer />
                  </div>

                  <div>
                    <span>
                      Feels Like
                    </span>

                    <strong>
                      {Math.round(
                        weather?.feelsLike ??
                          temperature
                      )}
                      °C
                    </strong>
                  </div>
                </div>

                <div className="weather-stat">
                  <div className="stat-icon">
                    <Droplets />
                  </div>

                  <div>
                    <span>
                      Humidity
                    </span>

                    <strong>
                      {humidity}%
                    </strong>
                  </div>
                </div>

                <div className="weather-stat">
                  <div className="stat-icon">
                    <Wind />
                  </div>

                  <div>
                    <span>
                      Wind
                    </span>

                    <strong>
                      {Math.round(
                        windSpeed
                      )} km/h
                    </strong>
                  </div>
                </div>

                <div className="weather-stat">
                  <div className="stat-icon">
                    <CloudRain />
                  </div>

                  <div>
                    <span>
                      Rain Chance
                    </span>

                    <strong>
                      {rainProbability}%
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          )}

        </section>

        {/* ================= AI TOOLS ================= */}

        <section className="section">

          <div className="section-title-row">

            <div>
              <span className="section-label">
                AI FARMING TOOLS
              </span>

              <h2>
                Smart Tools for Your Farm
              </h2>
            </div>

          </div>

          <div className="tools-grid">

            <button
              className="tool-card soil-card"
              onClick={() =>
                navigate("/soil-vision")
              }
            >

              <div className="tool-icon">
                <Camera />
              </div>

              <span className="tool-label">
                SOIL VISION
              </span>

              <h3>
                Check My Soil
              </h3>

              <p>
                Upload a soil photo and get
                visual soil condition insights.
              </p>

              <div className="tool-link">
                Analyze Soil
                <ArrowRight size={17} />
              </div>

            </button>

            <button
              className="tool-card crop-card"
              onClick={() =>
                navigate("/recommendations")
              }
            >

              <div className="tool-icon">
                <Wheat />
              </div>

              <span className="tool-label">
                AI RECOMMENDATION
              </span>

              <h3>
                Which Crop Should I Grow?
              </h3>

              <p>
                Get intelligent crop recommendations
                based on your farm data.
              </p>

              <div className="tool-link">
                Get Recommendation
                <ArrowRight size={17} />
              </div>

            </button>

            <button
              className="tool-card alert-card"
              onClick={() =>
                navigate("/alerts")
              }
            >

              <div className="tool-icon">
                <Bell />
              </div>

              <span className="tool-label">
                EARLY ALERTS
              </span>

              <h3>
                Farming Alerts
              </h3>

              <p>
                Get warnings about rain, heat,
                humidity and strong winds.
              </p>

              <div className="tool-link">
                View Alerts
                <ArrowRight size={17} />
              </div>

            </button>

          </div>

        </section>

        {/* ================= IRRIGATION ================= */}

        <section className="section">

          <div className="section-title-row">

            <div>
              <span className="section-label">
                WATER MANAGEMENT
              </span>

              <h2>
                Should I Irrigate Today?
              </h2>
            </div>

            <Droplets size={27} />

          </div>

          <div
            className={`irrigation ${
              irrigation.type
            }`}
          >

            <div className="irrigation-icon">
              <Droplets size={31} />
            </div>

            <div className="irrigation-text">

              <span>
                Weather-based suggestion
              </span>

              <h3>
                {irrigation.title}
              </h3>

              <p>
                {irrigation.text}
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/soil-vision")
              }
              className="check-soil-btn"
            >
              <Camera size={17} />
              Check Soil
            </button>

          </div>

          <div className="info-note">

            <CircleHelp size={18} />

            <span>
              Irrigation also depends on crop type,
              soil, growth stage and actual soil moisture.
              Check your soil before making the final decision.
            </span>

          </div>

        </section>

        {/* ================= ASK AGRIMITRA ================= */}

        <section
          className="section"
          id="ask-agrimitra"
        >

          <div className="section-title-row">

            <div>
              <span className="section-label">
                VOICE FARMING ASSISTANT
              </span>

              <h2>
                Ask AgriMitra
              </h2>

              <p className="section-subtitle">
                Speak naturally in English, Hindi or Marathi.
              </p>
            </div>

            <div className="assistant-title-icon">
              <MessageCircle />
            </div>

          </div>

          <div className="assistant">

            {/* Language */}

            <div className="assistant-header">

              <div className="language">

                <Languages size={19} />

                <span>
                  Select Language
                </span>

                <select
                  value={voiceLanguage}
                  onChange={changeLanguage}
                >
                  {languages.map(
                    (language) => (
                      <option
                        key={language.code}
                        value={language.code}
                      >
                        {language.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="assistant-status">

                <span
                  className={
                    isListening
                      ? "status-circle listening"
                      : "status-circle"
                  }
                />

                {isListening
                  ? "Listening..."
                  : isSpeaking
                  ? "Speaking..."
                  : "Ready"}

              </div>

            </div>

            {/* Microphone */}

            <div className="voice-area">

              <button
                className={`microphone ${
                  isListening
                    ? "active"
                    : ""
                }`}
                onClick={
                  isListening
                    ? stopListening
                    : startListening
                }
              >

                {isListening ? (
                  <MicOff size={35} />
                ) : (
                  <Mic size={35} />
                )}

              </button>

              <h3>
                {isListening
                  ? voiceLanguage === "hi-IN"
                    ? "मैं सुन रहा हूँ..."
                    : voiceLanguage === "mr-IN"
                    ? "मी ऐकत आहे..."
                    : "I'm listening..."
                  : voiceLanguage === "hi-IN"
                  ? "माइक्रोफोन दबाकर बोलें"
                  : voiceLanguage === "mr-IN"
                  ? "मायक्रोफोन दाबून बोला"
                  : "Tap the microphone and speak"}
              </h3>

              <p>
                {voiceLanguage === "hi-IN"
                  ? "मौसम, बारिश या सिंचाई के बारे में पूछें।"
                  : voiceLanguage === "mr-IN"
                  ? "हवामान, पाऊस किंवा सिंचनाबद्दल विचारा."
                  : "Ask about weather, rain, irrigation or farming."}
              </p>

            </div>

            {/* Text Input */}

            <div className="assistant-input">

              <input
                type="text"
                value={voiceText}
                onChange={(e) =>
                  setVoiceText(e.target.value)
                }
                placeholder={
                  voiceLanguage === "hi-IN"
                    ? "अपना सवाल लिखें..."
                    : voiceLanguage === "mr-IN"
                    ? "तुमचा प्रश्न लिहा..."
                    : "Type your farming question..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askTextQuestion();
                  }
                }}
              />

              <button
                onClick={askTextQuestion}
              >
                <Send size={19} />
              </button>

            </div>

            {/* Answer */}

            {voiceAnswer && (

              <div className="assistant-answer">

                <div className="answer-top">

                  <div>
                    <Sparkles size={18} />
                    <strong>
                      AgriMitra
                    </strong>
                  </div>

                  {isSpeaking ? (

                    <button
                      onClick={stopSpeaking}
                    >
                      <VolumeX size={18} />
                      Stop
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        speakAnswer(
                          voiceAnswer,
                          voiceLanguage
                        )
                      }
                    >
                      <Volume2 size={18} />
                      Speak
                    </button>

                  )}

                </div>

                <p>
                  {voiceAnswer}
                </p>

              </div>

            )}

            {/* Error */}

            {assistantError && (

              <div className="assistant-error">

                <AlertTriangle size={18} />

                {assistantError}

              </div>

            )}

            {/* Quick Questions */}

            <div className="quick-questions">

              <span>
                Try asking:
              </span>

              <div>

                <button
                  onClick={() =>
                    askQuickQuestion(
                      voiceLanguage === "hi-IN"
                        ? "आज का मौसम कैसा है?"
                        : voiceLanguage === "mr-IN"
                        ? "आजचे हवामान कसे आहे?"
                        : "What is the weather today?"
                    )
                  }
                >
                  🌦️{" "}
                  {voiceLanguage === "hi-IN"
                    ? "आज का मौसम?"
                    : voiceLanguage === "mr-IN"
                    ? "आजचे हवामान?"
                    : "Today's weather?"}
                </button>

                <button
                  onClick={() =>
                    askQuickQuestion(
                      voiceLanguage === "hi-IN"
                        ? "क्या मुझे आज सिंचाई करनी चाहिए?"
                        : voiceLanguage === "mr-IN"
                        ? "आज पिकाला पाणी द्यावे का?"
                        : "Should I irrigate today?"
                    )
                  }
                >
                  💧{" "}
                  {voiceLanguage === "hi-IN"
                    ? "आज सिंचाई करें?"
                    : voiceLanguage === "mr-IN"
                    ? "आज पाणी द्यावे का?"
                    : "Irrigate today?"}
                </button>

                <button
                  onClick={() =>
                    askQuickQuestion(
                      voiceLanguage === "hi-IN"
                        ? "आज बारिश होगी क्या?"
                        : voiceLanguage === "mr-IN"
                        ? "आज पाऊस पडेल का?"
                        : "Will it rain today?"
                    )
                  }
                >
                  ☔{" "}
                  {voiceLanguage === "hi-IN"
                    ? "बारिश होगी?"
                    : voiceLanguage === "mr-IN"
                    ? "पाऊस पडेल?"
                    : "Will it rain?"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FARM ACTIONS ================= */}

        <section className="section">

          <div className="section-title-row">

            <div>
              <span className="section-label">
                FARM ADVISORY
              </span>

              <h2>
                Today's Farm Actions
              </h2>
            </div>

            <Tractor size={26} />

          </div>

          <div className="actions-grid">

            {[
              {
                icon: CloudRain,
                title: "Monitor Rain",
                text:
                  rainProbability > 50
                    ? "Rain probability is significant. Prepare your field."
                    : "Low rain probability today.",
              },
              {
                icon: Droplets,
                title: "Check Soil Moisture",
                text:
                  "Check soil moisture before irrigation.",
              },
              {
                icon: Sprout,
                title: "Monitor Crops",
                text:
                  "Walk through your field and check crop health.",
              },
            ].map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    className="action-card"
                    key={index}
                  >
                    <div className="action-icon">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* ================= FORECAST ================= */}

        {weather?.forecast?.length > 0 && (

          <section className="section">

            <div className="section-title-row">

              <div>
                <span className="section-label">
                  WEATHER OUTLOOK
                </span>

                <h2>
                  Weather Forecast
                </h2>
              </div>

              <CalendarDays size={25} />

            </div>

            <div className="forecast">

              {weather.forecast
                .slice(0, 5)
                .map((day, index) => {

                  const rain = Number(
                    day.rain ||
                      day.rainProbability ||
                      day.pop ||
                      0
                  );

                  return (
                    <div
                      className="forecast-card"
                      key={index}
                    >

                      <span>
                        {day.day ||
                          `Day ${index + 1}`}
                      </span>

                      <CloudSun size={34} />

                      <strong>
                        {Math.round(
                          Number(
                            day.temperature || 0
                          )
                        )}
                        °C
                      </strong>

                      <small>
                        {day.description ||
                          "Weather"}
                      </small>

                      <div className="forecast-rain">
                        <CloudRain size={14} />
                        {Math.round(rain)}%
                      </div>

                    </div>
                  );
                })}

            </div>

          </section>

        )}

        {/* ================= FARM PROFILE ================= */}

        <section className="section">

          <div className="section-title-row">

            <div>
              <span className="section-label">
                MY FARM
              </span>

              <h2>
                Farm Profile
              </h2>
            </div>

            <button
              className="edit-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              Edit Profile
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="farm-profile">

            <div>
              <MapPin />
              <span>Location</span>
              <strong>
                {user?.location || "Jalgaon"}
              </strong>
            </div>

            <div>
              <Wheat />
              <span>Main Crop</span>
              <strong>
                {user?.crop || "Not selected"}
              </strong>
            </div>

            <div>
              <Sprout />
              <span>Farm Size</span>
              <strong>
                {user?.farmSize || "Not added"}
              </strong>
            </div>

            <div>
              <CheckCircle2 />
              <span>Weather</span>
              <strong>
                {weather
                  ? "Updated"
                  : "Unavailable"}
              </strong>
            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>
          <Leaf size={21} />
          <strong>AgriMitra</strong>
          <span>
            Smart technology for better farming
          </span>
        </div>

        <span>
          Weather • AI Recommendations • Soil Vision • Alerts
        </span>

      </footer>

    </div>
  );
}