from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from soil_model import analyze_soil_image


app = FastAPI(
    title="AgriMitra Soil Vision AI",
    description="Visual soil analysis service",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():

    return {
        "success": True,
        "service": "AgriMitra Soil Vision AI",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "success": True,
        "service": "soil-vision",
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze_soil(
    image: UploadFile = File(...)
):

    try:

        if not image.content_type:

            return {
                "success": False,
                "message": "No image content type."
            }


        if not image.content_type.startswith(
            "image/"
        ):

            return {
                "success": False,
                "message": "Please upload an image file."
            }


        image_bytes = await image.read()


        result = analyze_soil_image(
            image_bytes
        )


        return result


    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }