import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Leaf,
  Droplets,
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Sprout,
  FlaskConical,
} from "lucide-react";

import "./SoilVision.css";


export default function SoilVision() {

  const navigate = useNavigate();

  const fileInputRef =
    useRef(null);

  const cameraInputRef =
    useRef(null);


  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");


  // =====================================================
  // IMAGE SELECTED
  // =====================================================

  const handleImageChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;


    setError("");

    setResult(null);


    // Check type

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please select a JPG, PNG or other image file."
      );

      return;

    }


    // Check size

    if (
      file.size >
      10 * 1024 * 1024
    ) {

      setError(
        "Image must be smaller than 10 MB."
      );

      return;

    }


    setImage(file);


    const objectUrl =
      URL.createObjectURL(file);

    setPreview(
      objectUrl
    );

  };


  // =====================================================
  // OPEN FILE
  // =====================================================

  const openFilePicker = () => {

    fileInputRef.current?.click();

  };


  // =====================================================
  // OPEN CAMERA
  // =====================================================

  const openCamera = () => {

    cameraInputRef.current?.click();

  };


  // =====================================================
  // RESET
  // =====================================================

  const resetImage = () => {

    setImage(null);

    setPreview("");

    setResult(null);

    setError("");

    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }

    if (cameraInputRef.current) {

      cameraInputRef.current.value =
        "";

    }

  };


  // =====================================================
  // ANALYZE
  // =====================================================

  const analyzeSoil = async () => {

    if (!image) {

      setError(
        "Please take or upload a soil photo first."
      );

      return;

    }


    setLoading(true);

    setError("");

    setResult(null);


    try {

      const formData =
        new FormData();


      formData.append(
        "image",
        image
      );


      console.log(
        "Sending soil image to AgriMitra..."
      );


      const response =
        await fetch(
          "http://localhost:5000/api/soil-vision/analyze",
          {
            method: "POST",

            body: formData,
          }
        );


      const data =
        await response.json();


      console.log(
        "Soil Vision response:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Soil analysis failed."
        );

      }


      const analysis =
        data.data;


      setResult(
        analysis
      );


    } catch (error) {

      console.error(
        "Soil analysis error:",
        error
      );


      setError(
        error.message ||
        "Unable to connect to the Soil AI service."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // RESULT
  // =====================================================

  const soil =
    result?.soil;


  const confidence =
    Number(
      result?.confidence || 0
    );


  return (

    <div className="soil-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="soil-header">

        <button
          className="soil-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <ArrowLeft size={19} />

          <span>
            Dashboard
          </span>

        </button>


        <div className="soil-brand">

          <div className="soil-brand-icon">

            <Leaf size={21} />

          </div>


          <div>

            <h1>
              AgriMitra Soil Vision
            </h1>

            <p>
              AI-powered visual soil analysis
            </p>

          </div>

        </div>

      </header>


      <main className="soil-container">


        {/* =================================================
            INTRO
        ================================================= */}

        <section className="soil-intro">

          <div>

            <span className="soil-eyebrow">
              AI SOIL ANALYSIS
            </span>


            <h2>
              Take a photo of your soil
            </h2>


            <p>

              Instead of searching for a soil report,
              take a clear photograph of your farm soil.
              AgriMitra will analyze its visible
              characteristics.

            </p>

          </div>


          <div className="soil-feature-badge">

            <Sparkles size={17} />

            <span>
              Computer Vision
            </span>

          </div>

        </section>


        {/* =================================================
            UPLOAD AREA
        ================================================= */}

        {!result && (

          <section className="soil-upload-card">


            {!preview && (

              <>

                <div className="upload-icon">

                  <Camera size={38} />

                </div>


                <h3>
                  Take a soil photo
                </h3>


                <p>

                  Capture a clear picture of the soil
                  surface. Avoid leaves, stones and
                  shadows covering most of the soil.

                </p>


                <div className="upload-actions">

                  <button
                    className="camera-button"
                    onClick={openCamera}
                  >

                    <Camera size={19} />

                    Take Photo

                  </button>


                  <button
                    className="upload-button"
                    onClick={openFilePicker}
                  >

                    <Upload size={19} />

                    Upload Photo

                  </button>

                </div>


                <div className="photo-tips">

                  <div>

                    <CheckCircle2 size={15} />

                    Good lighting

                  </div>


                  <div>

                    <CheckCircle2 size={15} />

                    Soil fills the frame

                  </div>


                  <div>

                    <CheckCircle2 size={15} />

                    Avoid heavy shadows

                  </div>

                </div>

              </>

            )}


            {preview && (

              <div className="preview-area">


                <div className="preview-header">

                  <div>

                    <span>
                      SOIL PHOTO
                    </span>

                    <h3>
                      Ready for analysis
                    </h3>

                  </div>


                  <button
                    className="retake-button"
                    onClick={resetImage}
                  >

                    <RotateCcw size={16} />

                    Retake

                  </button>

                </div>


                <div className="soil-image-wrapper">

                  <img
                    src={preview}
                    alt="Uploaded soil"
                    className="soil-preview"
                  />

                </div>


                <div className="preview-file">

                  <ImageIcon size={16} />

                  {image?.name}

                </div>


                <button
                  className="analyze-button"
                  onClick={analyzeSoil}
                  disabled={loading}
                >

                  {loading ? (

                    <>

                      <Loader2
                        size={20}
                        className="soil-spin"
                      />

                      Analyzing Soil...

                    </>

                  ) : (

                    <>

                      <Sparkles size={20} />

                      Analyze Soil with AI

                    </>

                  )}

                </button>

              </div>

            )}


          </section>

        )}


        {/* =================================================
            HIDDEN INPUTS
        ================================================= */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />


        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          hidden
        />


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="soil-error">

            <AlertTriangle size={19} />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <section className="analysis-progress">

            <div className="progress-icon">

              <ScanSearch size={28} />

            </div>


            <h3>
              AgriMitra is analyzing your soil
            </h3>


            <p>
              Checking visible color, texture and
              apparent moisture characteristics.
            </p>


            <div className="progress-bar">

              <div />

            </div>


            <div className="analysis-steps">

              <span>
                <CheckCircle2 size={15} />
                Image received
              </span>

              <span>
                <CheckCircle2 size={15} />
                Image processing
              </span>

              <span>
                <Loader2
                  size={15}
                  className="soil-spin"
                />
                Soil analysis
              </span>

            </div>

          </section>

        )}


        {/* =================================================
            RESULT
        ================================================= */}

        {result && (

          <section className="soil-result">


            {/* RESULT HEADER */}

            <div className="result-success">

              <div className="success-icon">

                <CheckCircle2 size={24} />

              </div>


              <div>

                <span>
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  Soil Analysis Result
                </h2>

              </div>

            </div>


            {/* MAIN RESULT */}

            <div className="result-main">


              <div className="soil-result-icon">

                <Sprout size={44} />

              </div>


              <div className="soil-result-info">

                <span className="result-label">
                  POSSIBLE SOIL APPEARANCE
                </span>


                <h3>
                  {soil?.type ||
                    "Uncertain"}
                </h3>


                <p>
                  {soil?.explanation}
                </p>


                <div className="confidence-row">

                  <div>

                    <span>
                      Visual analysis confidence
                    </span>

                    <strong>
                      {confidence.toFixed(1)}%
                    </strong>

                  </div>


                  <div className="confidence-bar">

                    <div
                      style={{
                        width: `${Math.min(
                          confidence,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* CHARACTERISTICS */}

            <div className="characteristics">

              <h3>
                Visible Soil Characteristics
              </h3>


              <div className="characteristic-grid">


                <Characteristic
                  icon={
                    <FlaskConical
                      size={19}
                    />
                  }
                  title="Color"
                  value={
                    soil?.color
                      ?.primary_color ||
                    "Unknown"
                  }
                />


                <Characteristic
                  icon={
                    <ScanSearch
                      size={19}
                    />
                  }
                  title="Texture"
                  value={
                    soil?.texture
                      ?.texture ||
                    "Unknown"
                  }
                />


                <Characteristic
                  icon={
                    <Droplets
                      size={19}
                    />
                  }
                  title="Moisture appearance"
                  value={
                    soil?.moisture
                      ?.appearance ||
                    "Unknown"
                  }
                />


                <Characteristic
                  icon={
                    <ImageIcon
                      size={19}
                    />
                  }
                  title="Image quality"
                  value={
                    result?.image_quality
                      ?.label ||
                    "Unknown"
                  }
                />

              </div>

            </div>


            {/* IMPORTANT */}

            <div className="important-box">

              <div className="important-icon">

                <AlertTriangle size={20} />

              </div>


              <div>

                <h3>
                  What the camera cannot measure
                </h3>


                <p>

                  A normal phone camera cannot reliably
                  determine the exact amount of nitrogen,
                  phosphorus, potassium or soil pH.

                </p>


                <div className="limitation-list">

                  <span>
                    N — Nitrogen
                  </span>

                  <span>
                    P — Phosphorus
                  </span>

                  <span>
                    K — Potassium
                  </span>

                  <span>
                    pH — Soil acidity
                  </span>

                </div>

              </div>

            </div>


            {/* NEXT STEP */}

            <div className="next-step">

              <div>

                <span className="soil-eyebrow">
                  NEXT STEP
                </span>

                <h3>
                  Get a more accurate crop recommendation
                </h3>

                <p>

                  Combine soil measurements with weather,
                  location, season and water availability.

                </p>

              </div>


              <button
                onClick={() =>
                  navigate(
                    "/recommendations"
                  )
                }
              >

                <Sprout size={18} />

                Crop Recommendations

              </button>

            </div>


            {/* NEW ANALYSIS */}

            <button
              className="new-analysis-button"
              onClick={resetImage}
            >

              <RotateCcw size={17} />

              Analyze Another Soil Photo

            </button>


          </section>

        )}


      </main>

    </div>

  );

}


// =========================================================
// CHARACTERISTIC COMPONENT
// =========================================================

function Characteristic({
  icon,
  title,
  value,
}) {

  return (

    <div className="characteristic">

      <div className="characteristic-icon">

        {icon}

      </div>


      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );

}