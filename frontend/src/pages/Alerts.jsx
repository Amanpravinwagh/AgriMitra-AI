import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Bell,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  MapPin,
  ShieldAlert,
  Sprout,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../api";

import "./Alerts.css";


export default function Alerts() {

  const navigate = useNavigate();


  // ======================================
  // STATE
  // ======================================

  const [alerts, setAlerts] =
    useState([]);

  const [city, setCity] =
    useState("Nashik");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);


  // ======================================
  // LOAD ALERTS
  // ======================================

  useEffect(() => {

    loadAlerts();

  }, []);


  // ======================================
  // FETCH ALERTS
  // ======================================

  const loadAlerts = async () => {

    try {

      setLoading(true);

      setError("");


      const savedUser =
        localStorage.getItem(
          "agrimitra_user"
        );


      let parsedUser = null;


      if (savedUser) {

        try {

          parsedUser =
            JSON.parse(savedUser);

        } catch (err) {

          console.error(
            "Invalid user data",
            err
          );

        }

      }


      const userCity =
        parsedUser?.location ||
        "Nashik";


      setCity(userCity);


      const response =
        await API.get(
          `/alerts?city=${encodeURIComponent(
            userCity
          )}`
        );


      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          "Unable to load alerts."
        );

      }


      setAlerts(
        response.data.alerts || []
      );


      setLastUpdated(
        response.data.generatedAt
          ? new Date(
              response.data.generatedAt
            )
          : new Date()
      );


    } catch (err) {

      console.error(
        "Alerts error:",
        err
      );


      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load farming alerts."
      );


    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // ALERT ICON
  // ======================================

  const getAlertIcon = (alert) => {

    switch (alert.type) {

      case "rain":
        return <CloudRain size={28} />;

      case "heat":
        return <Thermometer size={28} />;

      case "humidity":
        return <Droplets size={28} />;

      case "wind":
        return <Wind size={28} />;

      case "normal":
        return <CheckCircle2 size={28} />;

      default:
        return <Bell size={28} />;

    }

  };


  // ======================================
  // SEVERITY LABEL
  // ======================================

  const getSeverityLabel = (severity) => {

    switch (severity) {

      case "high":
        return "HIGH PRIORITY";

      case "medium":
        return "MEDIUM PRIORITY";

      case "low":
        return "LOW PRIORITY";

      default:
        return "ALERT";

    }

  };


  // ======================================
  // FORMAT TIME
  // ======================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (

      <div className="alerts-loading">

        <RefreshCw
          size={38}
          className="alerts-spin"
        />

        <h2>
          Checking farming conditions...
        </h2>

        <p>
          AgriMitra is analyzing the
          latest weather information.
        </p>

      </div>

    );

  }


  // ======================================
  // PAGE
  // ======================================

  return (

    <div className="alerts-page">


      {/* ==================================
          HEADER
      ================================== */}

      <header className="alerts-header">

        <button
          className="alerts-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <ArrowLeft size={19} />

          Dashboard

        </button>


        <div className="alerts-brand">

          <div className="alerts-brand-icon">

            <Bell size={22} />

          </div>

          <div>

            <strong>
              AgriMitra
            </strong>

            <span>
              Early Farming Alerts
            </span>

          </div>

        </div>


        <button
          className="alerts-refresh-btn"
          onClick={loadAlerts}
          disabled={loading}
        >

          <RefreshCw
            size={18}
          />

          Refresh

        </button>

      </header>



      {/* ==================================
          MAIN
      ================================== */}

      <main className="alerts-container">


        {/* ==================================
            INTRO
        ================================== */}

        <section className="alerts-intro">

          <div className="alerts-intro-icon">

            <ShieldAlert size={34} />

          </div>


          <div>

            <p className="alerts-small-title">
              SMART FARM SAFETY
            </p>

            <h1>
              Early Farming Alerts
            </h1>

            <p>
              Weather-based warnings to help
              you plan your farming activities
              safely and efficiently.
            </p>

          </div>

        </section>



        {/* ==================================
            LOCATION
        ================================== */}

        <div className="alerts-location">

          <MapPin size={18} />

          <span>
            Monitoring conditions for
          </span>

          <strong>
            {city}
          </strong>

        </div>



        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="alerts-error">

            <AlertTriangle size={20} />

            <div>

              <strong>
                Unable to load alerts
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}



        {/* ==================================
            LAST UPDATED
        ================================== */}

        {lastUpdated && !error && (

          <div className="alerts-updated">

            Last checked:
            {" "}
            {formatTime(lastUpdated)}

          </div>

        )}



        {/* ==================================
            ALERTS
        ================================== */}

        {!error && (

          <section className="alerts-list">

            {alerts.map((alert) => (

              <article
                key={alert.id}
                className={`alert-card ${alert.severity}`}
              >


                {/* ICON */}

                <div className="alert-card-icon">

                  {getAlertIcon(alert)}

                </div>


                {/* CONTENT */}

                <div className="alert-card-content">

                  <div className="alert-card-top">

                    <span className="alert-category">

                      {alert.category}

                    </span>

                    <span className="alert-severity">

                      {getSeverityLabel(
                        alert.severity
                      )}

                    </span>

                  </div>


                  <h2>
                    {alert.title}
                  </h2>


                  <p className="alert-message">
                    {alert.message}
                  </p>


                  {alert.value && (

                    <div className="alert-value">

                      <strong>
                        {alert.value}
                      </strong>

                    </div>

                  )}


                  <div className="alert-action">

                    <Sprout size={18} />

                    <div>

                      <strong>
                        Recommended Action
                      </strong>

                      <p>
                        {alert.action}
                      </p>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </section>

        )}



        {/* ==================================
            FARMING TIPS
        ================================== */}

        <section className="alerts-info">

          <div className="alerts-info-icon">

            <Sprout size={25} />

          </div>


          <div>

            <h2>
              Smart Farming Reminder
            </h2>

            <p>
              Weather alerts are intended to
              support your farming decisions.
              Always consider your actual field
              conditions before taking action.
            </p>

          </div>

        </section>



        {/* ==================================
            QUICK ACTIONS
        ================================== */}

        <section className="alerts-actions">

          <button
            onClick={() =>
              navigate("/soil-vision")
            }
          >

            <CameraIcon />

            Analyze My Soil

          </button>


          <button
            onClick={() =>
              navigate("/recommendations")
            }
          >

            <Sprout size={18} />

            Crop Recommendations

          </button>


          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >

            <CloudRain size={18} />

            View Weather

          </button>

        </section>


      </main>

    </div>

  );

}


// ========================================
// CAMERA ICON
// ========================================

function CameraIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M14.5 4h-5L7.5 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2.5z" />

      <circle
        cx="12"
        cy="13"
        r="3"
      />

    </svg>

  );

}