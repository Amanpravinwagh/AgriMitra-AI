const express = require("express");
const multer = require("multer");
const axios = require("axios");

const router = express.Router();


// =========================================================
// MULTER CONFIGURATION
// =========================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed."
        )
      );
    }

  },
});


// =========================================================
// PYTHON SOIL AI SERVICE
// =========================================================

const SOIL_AI_URL =
  process.env.SOIL_AI_URL ||
  "http://127.0.0.1:8001";


// =========================================================
// POST /api/soil-vision/analyze
// =========================================================

router.post(
  "/analyze",
  upload.single("image"),

  async (req, res) => {

    try {

      // -----------------------------------------------------
      // CHECK IMAGE
      // -----------------------------------------------------

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload a soil image."

        });

      }


      console.log(
        "Soil image received:",
        req.file.originalname
      );


      // -----------------------------------------------------
      // CREATE MULTIPART FORM
      // -----------------------------------------------------

      const FormData =
        require("form-data");

      const formData =
        new FormData();


      formData.append(
        "image",
        req.file.buffer,
        {
          filename:
            req.file.originalname ||
            "soil.jpg",

          contentType:
            req.file.mimetype,
        }
      );


      // -----------------------------------------------------
      // SEND TO PYTHON
      // -----------------------------------------------------

      console.log(
        "Sending soil image to Python AI..."
      );


      const response =
        await axios.post(
          `${SOIL_AI_URL}/analyze`,
          formData,

          {
            headers:
              formData.getHeaders(),

            maxContentLength:
              10 * 1024 * 1024,

            maxBodyLength:
              10 * 1024 * 1024,

            timeout: 60000,
          }
        );


      console.log(
        "Python soil AI response received."
      );


      // -----------------------------------------------------
      // RETURN RESULT
      // -----------------------------------------------------

      return res.json({

        success: true,

        data: response.data,

      });


    } catch (error) {

      console.error(
        "Soil Vision Error:"
      );

      console.error(
        error.message
      );


      // -----------------------------------------------------
      // PYTHON SERVICE DOWN
      // -----------------------------------------------------

      if (
        error.code ===
        "ECONNREFUSED"
      ) {

        return res.status(503).json({

          success: false,

          message:
            "Soil AI service is not running. Start soil_server.py on port 8001.",

        });

      }


      // -----------------------------------------------------
      // TIMEOUT
      // -----------------------------------------------------

      if (
        error.code ===
        "ECONNABORTED"
      ) {

        return res.status(504).json({

          success: false,

          message:
            "Soil AI analysis timed out. Please try again.",

        });

      }


      // -----------------------------------------------------
      // PYTHON ERROR
      // -----------------------------------------------------

      if (
        error.response &&
        error.response.data
      ) {

        return res.status(500).json({

          success: false,

          message:
            error.response.data.message ||
            "Soil AI analysis failed.",

          details:
            error.response.data,

        });

      }


      // -----------------------------------------------------
      // GENERAL ERROR
      // -----------------------------------------------------

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Unable to analyze soil image.",

      });

    }

  }
);


// =========================================================
// MULTER ERROR HANDLER
// =========================================================

router.use(
  (error, req, res, next) => {

    if (
      error instanceof
      multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Image is too large. Maximum size is 10 MB.",

        });

      }

    }


    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "Invalid soil image.",

      });

    }


    next();

  }
);


module.exports = router;