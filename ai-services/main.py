import os
import joblib
import numpy as np

from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field


# ====================================
# PATHS
# ====================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "crop_model.pkl"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "model",
    "crop_encoder.pkl"
)


# ====================================
# LOAD MODEL
# ====================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "crop_model.pkl not found. "
        "Run train_model.py first."
    )

if not os.path.exists(ENCODER_PATH):
    raise FileNotFoundError(
        "crop_encoder.pkl not found. "
        "Run train_model.py first."
    )


model = joblib.load(
    MODEL_PATH
)

encoder = joblib.load(
    ENCODER_PATH
)


# ====================================
# FASTAPI
# ====================================

app = FastAPI(
    title="AgriMitra AI",
    description="AI Crop Recommendation Service",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====================================
# REQUEST MODEL
# ====================================

class CropRequest(BaseModel):

    nitrogen: float = Field(
        ...,
        ge=0,
        le=200
    )

    phosphorus: float = Field(
        ...,
        ge=0,
        le=200
    )

    potassium: float = Field(
        ...,
        ge=0,
        le=200
    )

    temperature: float = Field(
        ...,
        ge=-10,
        le=60
    )

    humidity: float = Field(
        ...,
        ge=0,
        le=100
    )

    ph: float = Field(
        ...,
        ge=0,
        le=14
    )

    rainfall: float = Field(
        ...,
        ge=0,
        le=5000
    )

    location: Optional[str] = "Unknown"

    soil: Optional[str] = "Unknown"

    water: Optional[str] = "Medium"

    season: Optional[str] = "Kharif"


# ====================================
# HEALTH CHECK
# ====================================

@app.get("/")
def root():

    return {
        "success": True,
        "service": "AgriMitra AI",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "success": True,
        "model_loaded": True
    }


# ====================================
# RECOMMENDATION
# ====================================

@app.post("/predict")
def predict_crop(
    request: CropRequest
):

    try:

        values = np.array([
            [
                request.nitrogen,
                request.phosphorus,
                request.potassium,
                request.temperature,
                request.humidity,
                request.ph,
                request.rainfall
            ]
        ])


        # ------------------------------
        # MODEL PREDICTION
        # ------------------------------

        probabilities = (
            model.predict_proba(values)[0]
        )


        classes = encoder.classes_


        # Top 5 crops
        top_indices = np.argsort(
            probabilities
        )[::-1][:5]


        recommendations = []


        for index in top_indices:

            crop_name = classes[index]

            probability = (
                probabilities[index]
            )

            score = round(
                probability * 100,
                2
            )


            recommendations.append({
                "crop": crop_name,
                "score": score
            })


        # ------------------------------
        # CONTEXT
        # ------------------------------

        return {

            "success": True,

            "location":
                request.location,

            "soil":
                request.soil,

            "water":
                request.water,

            "season":
                request.season,

            "input": {

                "nitrogen":
                    request.nitrogen,

                "phosphorus":
                    request.phosphorus,

                "potassium":
                    request.potassium,

                "temperature":
                    request.temperature,

                "humidity":
                    request.humidity,

                "ph":
                    request.ph,

                "rainfall":
                    request.rainfall
            },

            "recommendations":
                recommendations

        }

    except Exception as error:

        print(
            "Prediction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="AI prediction failed"
        )