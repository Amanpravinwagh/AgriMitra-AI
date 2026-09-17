import os
import io
import math

import cv2
import numpy as np

from PIL import Image


# ============================================================
# AGRIMITRA AI - SOIL VISION
# ============================================================

"""
This module performs visual soil analysis from a photograph.

IMPORTANT:
A normal RGB photograph cannot reliably measure:
    - Nitrogen (N)
    - Phosphorus (P)
    - Potassium (K)
    - Exact soil pH

Therefore this module estimates VISUAL characteristics such as:
    - apparent soil color
    - apparent texture
    - apparent moisture appearance
    - image quality
    - possible soil appearance category

For real NPK/pH measurements, use:
    - laboratory soil testing
    - calibrated NPK sensor
    - pH sensor

This module is designed as a runnable prototype for AgriMitra.
"""


# ============================================================
# IMAGE VALIDATION
# ============================================================

MAX_IMAGE_SIZE = 10 * 1024 * 1024


def validate_image_bytes(image_bytes: bytes):

    if not image_bytes:
        raise ValueError("No image was received.")

    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise ValueError(
            "Image is too large. Maximum allowed size is 10 MB."
        )


# ============================================================
# IMAGE LOADING
# ============================================================

def load_image(image_bytes: bytes):

    validate_image_bytes(image_bytes)

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image = np.array(image)

        if image.size == 0:
            raise ValueError(
                "The uploaded image is empty."
            )

        return image

    except Exception as error:

        raise ValueError(
            f"Unable to read soil image: {error}"
        )


# ============================================================
# IMAGE QUALITY
# ============================================================

def calculate_image_quality(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2GRAY
    )

    # Blur detection
    sharpness = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    brightness = float(
        np.mean(gray)
    )

    # Normalize sharpness approximately
    sharpness_score = min(
        max(sharpness / 150.0, 0),
        1
    )

    # Brightness score
    if brightness < 40:

        brightness_score = brightness / 40

    elif brightness > 230:

        brightness_score = (
            255 - brightness
        ) / 25

    else:

        brightness_score = 1.0

    quality = (
        sharpness_score * 0.65
        +
        brightness_score * 0.35
    )

    quality = min(
        max(quality, 0),
        1
    )

    if quality >= 0.75:

        label = "Good"

    elif quality >= 0.45:

        label = "Acceptable"

    else:

        label = "Poor"

    return {
        "score": round(
            quality * 100,
            1
        ),
        "label": label,
        "sharpness": round(
            float(sharpness),
            2
        ),
        "brightness": round(
            brightness,
            2
        )
    }


# ============================================================
# COLOR ANALYSIS
# ============================================================

def analyze_color(image):

    # Convert RGB → HSV
    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2HSV
    )

    rgb_mean = np.mean(
        image.reshape(-1, 3),
        axis=0
    )

    r = float(rgb_mean[0])
    g = float(rgb_mean[1])
    b = float(rgb_mean[2])

    brightness = float(
        np.mean(
            hsv[:, :, 2]
        )
    )

    saturation = float(
        np.mean(
            hsv[:, :, 1]
        )
    )

    # Basic visual classification.
    #
    # These are visual categories, NOT laboratory soil classifications.

    if brightness < 75:

        color = "Very Dark"

    elif brightness < 110:

        color = "Dark Brown"

    elif brightness < 145:

        color = "Brown"

    elif brightness < 180:

        color = "Light Brown"

    else:

        color = "Pale / Light"

    # Try to detect reddish appearance

    reddish_score = (
        r - g
    )

    if reddish_score > 25 and r > b:

        appearance = "Reddish-Brown"

    elif g > r * 0.95 and g > b * 1.15:

        appearance = "Greenish / Vegetation Mixed"

    elif b > r * 1.10:

        appearance = "Cool / Grayish"

    else:

        appearance = color

    return {
        "primary_color": appearance,
        "brightness": round(
            brightness,
            1
        ),
        "saturation": round(
            saturation,
            1
        ),
        "rgb": {
            "red": round(r, 1),
            "green": round(g, 1),
            "blue": round(b, 1)
        }
    }


# ============================================================
# TEXTURE ANALYSIS
# ============================================================

def analyze_texture(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2GRAY
    )

    # Gaussian blur to reduce camera noise
    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    # Local variation
    texture_variation = float(
        np.std(
            blurred
        )
    )

    # Edge density
    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    edge_density = float(
        np.mean(
            edges > 0
        )
    )

    # Visual classification.
    #
    # This is only an appearance estimate.

    combined = (
        texture_variation * 0.7
        +
        edge_density * 100 * 0.3
    )

    if combined < 25:

        texture = "Fine / Smooth"

    elif combined < 45:

        texture = "Moderately Fine"

    elif combined < 70:

        texture = "Moderately Coarse"

    else:

        texture = "Coarse / Rough"

    return {
        "texture": texture,
        "variation": round(
            texture_variation,
            2
        ),
        "edge_density": round(
            edge_density * 100,
            2
        )
    }


# ============================================================
# MOISTURE APPEARANCE
# ============================================================

def analyze_moisture(image):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2HSV
    )

    value = hsv[:, :, 2]

    saturation = hsv[:, :, 1]

    mean_value = float(
        np.mean(value)
    )

    mean_saturation = float(
        np.mean(saturation)
    )

    # Very rough visual estimate.
    #
    # Camera images cannot replace a moisture sensor.

    moisture_index = (
        (255 - mean_value) * 0.65
        +
        mean_saturation * 0.35
    )

    if moisture_index > 160:

        label = "Possibly Moist"

    elif moisture_index > 105:

        label = "Moderate / Slightly Moist"

    else:

        label = "Possibly Dry"

    return {
        "appearance": label,
        "index": round(
            moisture_index,
            1
        )
    }


# ============================================================
# POSSIBLE SOIL APPEARANCE
# ============================================================

def classify_soil_appearance(
    color_result,
    texture_result,
    moisture_result
):

    color = (
        color_result["primary_color"]
        .lower()
    )

    texture = (
        texture_result["texture"]
        .lower()
    )

    moisture = (
        moisture_result["appearance"]
        .lower()
    )


    # -----------------------------------------
    # BLACK / DARK SOIL
    # -----------------------------------------

    if (
        "dark" in color
        or "very dark" in color
    ):

        soil_type = "Dark / Black Soil"

        explanation = (
            "The image shows a predominantly "
            "dark soil appearance. Dark soil can "
            "occur in several soil types, so "
            "laboratory testing is recommended "
            "for confirmation."
        )


    # -----------------------------------------
    # RED SOIL
    # -----------------------------------------

    elif "reddish" in color:

        soil_type = "Reddish Soil"

        explanation = (
            "The image has a reddish-brown "
            "appearance. This can be associated "
            "with iron-rich soils, but a photo "
            "alone cannot confirm soil type."
        )


    # -----------------------------------------
    # BROWN SOIL
    # -----------------------------------------

    elif "brown" in color:

        soil_type = "Brown / Loamy Appearance"

        explanation = (
            "The soil appears brown in the "
            "photograph. Brown appearance can "
            "occur across several soil textures."
        )


    # -----------------------------------------
    # DEFAULT
    # -----------------------------------------

    else:

        soil_type = "Uncertain Soil Appearance"

        explanation = (
            "The image does not provide enough "
            "visual evidence for a reliable soil "
            "appearance classification."
        )


    return {
        "soil_type": soil_type,
        "explanation": explanation
    }


# ============================================================
# MAIN ANALYSIS
# ============================================================

def analyze_soil_image(
    image_bytes: bytes
):

    image = load_image(
        image_bytes
    )


    # Resize for consistent processing

    max_dimension = 1000

    height, width = image.shape[:2]

    if max(height, width) > max_dimension:

        scale = (
            max_dimension
            /
            max(height, width)
        )

        new_width = int(
            width * scale
        )

        new_height = int(
            height * scale
        )

        image = cv2.resize(
            image,
            (
                new_width,
                new_height
            )
        )


    # Perform analysis

    quality = calculate_image_quality(
        image
    )

    color = analyze_color(
        image
    )

    texture = analyze_texture(
        image
    )

    moisture = analyze_moisture(
        image
    )

    classification = classify_soil_appearance(
        color,
        texture,
        moisture
    )


    # ========================================================
    # CONFIDENCE
    # ========================================================

    confidence = (
        quality["score"] * 0.55
        +
        65 * 0.45
    )

    confidence = min(
        max(confidence, 20),
        90
    )


    # ========================================================
    # RESULT
    # ========================================================

    return {

        "success": True,

        "analysis_type":
            "visual_soil_analysis",

        "message":
            "Soil photograph analyzed successfully.",

        "confidence":
            round(
                confidence,
                1
            ),

        "soil": {

            "type":
                classification["soil_type"],

            "explanation":
                classification["explanation"],

            "color":
                color,

            "texture":
                texture,

            "moisture":
                moisture

        },

        "image_quality":
            quality,

        "limitations": [

            "A normal soil photograph cannot accurately measure nitrogen.",

            "A normal soil photograph cannot accurately measure phosphorus.",

            "A normal soil photograph cannot accurately measure potassium.",

            "A normal soil photograph cannot accurately measure soil pH.",

            "For exact NPK and pH values, use a laboratory soil test or calibrated soil sensors."

        ],

        "next_step": {

            "recommended":
                "Use weather data and measured soil values for crop recommendation.",

            "required_for_exact_ai":
                [
                    "Nitrogen",
                    "Phosphorus",
                    "Potassium",
                    "pH",
                    "Temperature",
                    "Humidity",
                    "Rainfall"
                ]

        }

    }