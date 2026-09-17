import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Droplets,
  CalendarDays,
  Thermometer,
  CloudRain,
  MapPin,
  CheckCircle2,
  Loader2,
  FlaskConical,
  Sprout,
  Wind,
  Beaker,
  AlertCircle,
} from "lucide-react";

import API from "../api";
import "./Recommendations.css";

export default function Recommendations() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    location: "Jalgaon",
    soil: "Black Soil",
    water: "Medium",
    season: "Kharif",

    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,

    temperature: 27,
    humidity: 65,

    ph: 6.5,

    rainfall: 700,
  });

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("agrimitra_user");

      if (!savedUser) return;

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      setForm((previous) => ({
        ...previous,

        location:
          parsedUser.location || previous.location,

        soil:
          parsedUser.soil || previous.soil,

        water:
          parsedUser.water || previous.water,

        season:
          parsedUser.season || previous.season,
      }));
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove old error when user starts correcting input
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const nitrogen = Number(form.nitrogen);
    const phosphorus = Number(form.phosphorus);
    const potassium = Number(form.potassium);
    const temperature = Number(form.temperature);
    const humidity = Number(form.humidity);
    const ph = Number(form.ph);
    const rainfall = Number(form.rainfall);

    if (
      !Number.isFinite(nitrogen) ||
      nitrogen < 0 ||
      nitrogen > 200
    ) {
      return "Nitrogen must be between 0 and 200.";
    }

    if (
      !Number.isFinite(phosphorus) ||
      phosphorus < 0 ||
      phosphorus > 200
    ) {
      return "Phosphorus must be between 0 and 200.";
    }

    if (
      !Number.isFinite(potassium) ||
      potassium < 0 ||
      potassium > 200
    ) {
      return "Potassium must be between 0 and 200.";
    }

    if (
      !Number.isFinite(temperature) ||
      temperature < -10 ||
      temperature > 60
    ) {
      return "Temperature must be between -10°C and 60°C.";
    }

    if (
      !Number.isFinite(humidity) ||
      humidity < 0 ||
      humidity > 100
    ) {
      return "Humidity must be between 0% and 100%.";
    }

    if (
      !Number.isFinite(ph) ||
      ph < 0 ||
      ph > 14
    ) {
      return "Soil pH must be between 0 and 14.";
    }

    if (
      !Number.isFinite(rainfall) ||
      rainfall < 0 ||
      rainfall > 5000
    ) {
      return "Rainfall must be between 0 and 5000 mm.";
    }

    return "";
  };

  // =====================================================
  // GET RECOMMENDATIONS
  // =====================================================

  const getRecommendations = async (event) => {
    event.preventDefault();

    setError("");
    setResults([]);

    // Validate before API call
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // PAYLOAD
      // =================================================

      const payload = {
        location: String(form.location || "Unknown"),
        soil: String(form.soil || "Unknown"),
        water: String(form.water || "Medium"),
        season: String(form.season || "Kharif"),

        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),

        temperature: Number(form.temperature),
        humidity: Number(form.humidity),

        ph: Number(form.ph),

        rainfall: Number(form.rainfall),
      };

      console.log(
        "Sending recommendation request:",
        payload
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await API.post(
        "/recommendations",
        payload
      );

      console.log(
        "Recommendation response:",
        response.data
      );

      // =================================================
      // HANDLE DIFFERENT RESPONSE STRUCTURES
      // =================================================

      const recommendations =
        response?.data?.data?.recommendations ||
        response?.data?.recommendations ||
        [];

      if (
        !Array.isArray(recommendations) ||
        recommendations.length === 0
      ) {
        setError(
          "AI service responded successfully, but no crop recommendations were returned."
        );

        return;
      }

      setResults(recommendations);
    } catch (err) {
      console.error(
        "Recommendation error:",
        err
      );

      // =================================================
      // GET USEFUL ERROR MESSAGE
      // =================================================

      const backendMessage =
        err?.response?.data?.message;

      const backendDetail =
        err?.response?.data?.detail;

      const status =
        err?.response?.status;

      if (status === 422) {
        setError(
          "Invalid crop recommendation data. Please check N, P, K, temperature, humidity, pH and rainfall values."
        );
      } else if (status === 500) {
        setError(
          backendMessage ||
            backendDetail ||
            "AI prediction failed. Please check that the Crop AI service is running."
        );
      } else if (err?.response) {
        setError(
          backendMessage ||
            backendDetail ||
            `Server error (${status || "unknown"}). Please try again.`
        );
      } else if (err?.request) {
        setError(
          "Cannot connect to the backend server. Make sure Node.js backend is running on port 5000."
        );
      } else {
        setError(
          err?.message ||
            "Unable to get crop recommendations."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT CROP NAME
  // =====================================================

  const formatCropName = (crop) => {
    if (!crop) return "";

    return String(crop)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // TOP CROP
  // =====================================================

  const topCrop = results[0];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="recommendation-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="recommendation-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={19} />
          <span>Dashboard</span>
        </button>

        <div className="header-title">

          <div className="header-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <h1>
              AI Crop Recommendations
            </h1>

            <p>
              Find crops that match your
              farm conditions
            </p>
          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="recommendation-container">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="intro-section">

          <div>

            <span className="eyebrow">
              AGRIMITRA AI
            </span>

            <h2>
              What should you grow?
            </h2>

            <p>
              Enter your farm and
              environmental conditions.
              Our machine-learning model
              will analyze them and suggest
              suitable crops.
            </p>

          </div>

          <div className="location-pill">
            <MapPin size={17} />

            <span>
              {form.location ||
                "Your location"}
            </span>
          </div>

        </section>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="conditions-card"
          onSubmit={getRecommendations}
        >

          {/* =================================================
              FARM INFORMATION
          ================================================= */}

          <div className="section-heading">

            <div className="section-heading-icon">
              <FlaskConical size={20} />
            </div>

            <div>
              <h3>
                Farm Conditions
              </h3>

              <p>
                Tell us about your farm
                and current conditions.
              </p>
            </div>

          </div>

          {/* FARM INFORMATION */}

          <div className="form-section">

            <h4>
              Farm information
            </h4>

            <div className="input-grid">

              <InputField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                icon={
                  <MapPin size={17} />
                }
              />

              <SelectField
                label="Soil type"
                name="soil"
                value={form.soil}
                onChange={handleChange}
                options={[
                  "Black Soil",
                  "Red Soil",
                  "Alluvial Soil",
                  "Sandy Soil",
                  "Loamy Soil",
                  "Clay Soil",
                ]}
              />

              <SelectField
                label="Water availability"
                name="water"
                value={form.water}
                onChange={handleChange}
                options={[
                  "Low",
                  "Medium",
                  "High",
                ]}
              />

              <SelectField
                label="Growing season"
                name="season"
                value={form.season}
                onChange={handleChange}
                options={[
                  "Kharif",
                  "Rabi",
                  "Zaid",
                  "Year Round",
                ]}
              />

            </div>

          </div>

          {/* =================================================
              SOIL
          ================================================= */}

          <div className="form-section">

            <h4>
              Soil nutrients
            </h4>

            <p className="section-help">
              Enter values from your
              soil test report.
            </p>

            <div className="input-grid three-columns">

              <NumberField
                label="Nitrogen (N)"
                name="nitrogen"
                value={form.nitrogen}
                onChange={handleChange}
                min={0}
                max={200}
              />

              <NumberField
                label="Phosphorus (P)"
                name="phosphorus"
                value={form.phosphorus}
                onChange={handleChange}
                min={0}
                max={200}
              />

              <NumberField
                label="Potassium (K)"
                name="potassium"
                value={form.potassium}
                onChange={handleChange}
                min={0}
                max={200}
              />

            </div>

          </div>

          {/* =================================================
              ENVIRONMENT
          ================================================= */}

          <div className="form-section">

            <h4>
              Weather & soil condition
            </h4>

            <div className="input-grid">

              <NumberField
                label="Temperature (°C)"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                min={-10}
                max={60}
              />

              <NumberField
                label="Humidity (%)"
                name="humidity"
                value={form.humidity}
                onChange={handleChange}
                min={0}
                max={100}
              />

              <NumberField
                label="Rainfall (mm)"
                name="rainfall"
                value={form.rainfall}
                onChange={handleChange}
                min={0}
                max={5000}
              />

              <NumberField
                label="Soil pH"
                name="ph"
                value={form.ph}
                onChange={handleChange}
                step="0.1"
                min={0}
                max={14}
              />

            </div>

          </div>

          {/* =================================================
              BUTTON
          ================================================= */}

          <button
            className="analyze-button"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="spin"
                />

                Analyzing your conditions...
              </>
            ) : (
              <>
                <Sparkles size={20} />

                Get AI Crop Recommendations
              </>
            )}

          </button>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="error-message">

              <AlertCircle
                size={19}
              />

              <span>
                {error}
              </span>

            </div>
          )}

        </form>

        {/* =================================================
            CONDITIONS SUMMARY
        ================================================= */}

        {results.length > 0 && (

          <section className="summary-card">

            <div className="summary-heading">

              <div>

                <span className="eyebrow">
                  ANALYSIS INPUT
                </span>

                <h3>
                  Conditions analyzed by AI
                </h3>

              </div>

              <CheckCircle2 size={24} />

            </div>

            <div className="condition-grid">

              <Condition
                icon={
                  <MapPin size={18} />
                }
                label="Location"
                value={form.location}
              />

              <Condition
                icon={
                  <Leaf size={18} />
                }
                label="Soil"
                value={form.soil}
              />

              <Condition
                icon={
                  <Droplets size={18} />
                }
                label="Water"
                value={form.water}
              />

              <Condition
                icon={
                  <CalendarDays size={18} />
                }
                label="Season"
                value={form.season}
              />

              <Condition
                icon={
                  <Thermometer size={18} />
                }
                label="Temperature"
                value={`${form.temperature} °C`}
              />

              <Condition
                icon={
                  <Wind size={18} />
                }
                label="Humidity"
                value={`${form.humidity}%`}
              />

              <Condition
                icon={
                  <CloudRain size={18} />
                }
                label="Rainfall"
                value={`${form.rainfall} mm`}
              />

              <Condition
                icon={
                  <Beaker size={18} />
                }
                label="Soil pH"
                value={form.ph}
              />

            </div>

          </section>

        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        {results.length > 0 && (

          <section className="results-section">

            <div className="results-header">

              <div>

                <span className="eyebrow">
                  AI ANALYSIS COMPLETE
                </span>

                <h2>
                  Recommended Crops
                </h2>

                <p>
                  These crops received the
                  highest model prediction
                  probabilities for the
                  supplied conditions.
                </p>

              </div>

            </div>

            {/* =================================================
                TOP CROP
            ================================================= */}

            {topCrop && (

              <div className="top-recommendation">

                <div className="top-badge">

                  <Sparkles size={15} />

                  Top AI Prediction

                </div>

                <div className="top-content">

                  <div className="crop-icon-large">
                    <Sprout size={42} />
                  </div>

                  <div className="top-crop-info">

                    <p className="rank-label">
                      #1 Recommended crop
                    </p>

                    <h3>
                      {formatCropName(
                        topCrop.crop
                      )}
                    </h3>

                    <p>
                      This crop received the
                      highest prediction
                      probability from the
                      machine-learning model.
                    </p>

                    <div className="score-area">

                      <div className="score-header">

                        <span>
                          Model prediction
                          probability
                        </span>

                        <strong>
                          {Number(
                            topCrop.score
                          ).toFixed(1)}
                          %
                        </strong>

                      </div>

                      <div className="score-bar">

                        <div
                          className="score-fill"
                          style={{
                            width: `${Math.min(
                              Number(
                                topCrop.score
                              ) || 0,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

                <div className="top-note">

                  <CheckCircle2 size={18} />

                  <span>
                    The prediction is based
                    on N, P, K, temperature,
                    humidity, soil pH and
                    rainfall.
                  </span>

                </div>

              </div>

            )}

            {/* =================================================
                OTHER CROPS
            ================================================= */}

            {results.length > 1 && (

              <div className="other-results">

                <div className="other-heading">

                  <h3>
                    Other suitable predictions
                  </h3>

                  <span>
                    {results.length - 1} more
                  </span>

                </div>

                <div className="crop-grid">

                  {results
                    .slice(1)
                    .map((item, index) => (

                      <CropCard
                        key={`${item.crop}-${index}`}
                        item={item}
                        rank={index + 2}
                        formatCropName={
                          formatCropName
                        }
                      />

                    ))}

                </div>

              </div>

            )}

            {/* =================================================
                EXPLANATION
            ================================================= */}

            <div className="explanation-card">

              <div className="explanation-icon">
                <Sparkles size={20} />
              </div>

              <div>

                <h3>
                  How does AgriMitra AI work?
                </h3>

                <p>
                  The Random Forest machine-learning
                  model compares your supplied soil
                  and environmental conditions with
                  patterns learned from the crop
                  recommendation dataset.
                </p>

                <div className="factor-list">

                  <span>
                    <CheckCircle2 size={15} />
                    Nitrogen
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Phosphorus
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Potassium
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Temperature
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Humidity
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Rainfall
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Soil pH
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                DISCLAIMER
            ================================================= */}

            <div className="disclaimer">

              <strong>
                Important:
              </strong>

              {" "}
              AI predictions are
              decision-support information,
              not a guarantee of crop yield.
              Consider local agricultural
              advice, soil-test results, seed
              availability and market conditions
              before making planting decisions.

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
  label,
  name,
  value,
  onChange,
  icon,
}) {
  return (
    <div className="field">

      <label>
        {icon}
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}


// =====================================================
// SELECT FIELD
// =====================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div className="field">

      <label>
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


// =====================================================
// NUMBER FIELD
// =====================================================

function NumberField({
  label,
  name,
  value,
  onChange,
  step = "1",
  min = 0,
  max,
}) {
  return (
    <div className="field">

      <label>
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        max={max}
      />

      {max !== undefined && (
        <small
          style={{
            display: "block",
            marginTop: "5px",
            fontSize: "12px",
            opacity: 0.65,
          }}
        >
          Range: {min} – {max}
        </small>
      )}

    </div>
  );
}


// =====================================================
// CONDITION
// =====================================================

function Condition({
  icon,
  label,
  value,
}) {
  return (
    <div className="condition">

      <div className="condition-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


// =====================================================
// CROP CARD
// =====================================================

function CropCard({
  item,
  rank,
  formatCropName,
}) {
  const score = Number(
    item?.score || 0
  );

  return (
    <article className="crop-card">

      <div className="crop-card-top">

        <span className="crop-rank">
          #{rank}
        </span>

        <div className="small-crop-icon">
          <Leaf size={22} />
        </div>

      </div>

      <h4>
        {formatCropName(item?.crop)}
      </h4>

      <p className="crop-description">
        AI prediction based on the
        supplied environmental
        conditions.
      </p>

      <div className="mini-score">

        <div className="mini-score-label">

          <span>
            Prediction probability
          </span>

          <strong>
            {score.toFixed(1)}%
          </strong>

        </div>

        <div className="mini-bar">

          <div
            style={{
              width: `${Math.min(
                score,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      <div className="crop-factor">

        <CheckCircle2 size={16} />

        <span>
          ML model prediction
        </span>

      </div>

    </article>
  );
}