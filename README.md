# AgriMitra-AI
#Website Look & Feel
<img width="1280" height="464" alt="WhatsApp Image 2026-09-17 at 14 13 28" src="https://github.com/user-attachments/assets/bafec184-ce1d-47df-9464-8fd4906bd53d" />
<img width="1280" height="458" alt="photo 2" src="https://github.com/user-attachments/assets/01add7c6-bb4d-44cd-bbf4-a8128511b1b3" />
<img width="1280" height="656" alt="photo 3" src="https://github.com/user-attachments/assets/51582e0d-5e7d-4f9f-a9ca-b18b3f68ce13" />
<img width="1280" height="548" alt="photo 4" src="https://github.com/user-attachments/assets/135efd3a-dc43-4e7e-8aba-3d8ace817b87" />
<img width="1280" height="576" alt="photo 5" src="https://github.com/user-attachments/assets/5bd4c569-c200-4940-a7a8-c58e7ab8fae5" />
<img width="1280" height="620" alt="photo 6" src="https://github.com/user-attachments/assets/0787aee5-f67d-4387-b005-49c22d873829" />
<img width="1280" height="734" alt="photo 7" src="https://github.com/user-attachments/assets/c13141d2-ae96-4d4e-abce-929b0ccf951f" />
<img width="1280" height="738" alt="photo 8" src="https://github.com/user-attachments/assets/20b094c1-9fce-4607-be96-3b49aa4dfa09" />
<img width="1280" height="682" alt="photo 9" src="https://github.com/user-attachments/assets/34597f1a-818d-404b-83ec-e94b89a41405" />
# 🌾 AgriMitra AI

AgriMitra AI is a smart agriculture platform designed to help farmers make better farming decisions using Artificial Intelligence, Machine Learning, localized weather data, soil image analysis, early farming alerts, irrigation guidance, and multilingual voice assistance.

## ✨ Features

- 🌦️ Localized weather information
- 🌱 AI-based crop recommendations
- 🧪 Soil Vision for preliminary image-based soil analysis
- 🚨 Early farming alerts for heat, rain, humidity, and wind
- 💧 Weather-based irrigation guidance
- 🎙️ Voice assistant with English, Hindi, and Marathi speech support
- 🔐 User registration and login using JWT
- 🗄️ MongoDB database
- 📱 Farmer-friendly React dashboard
- 🤖 Python FastAPI AI services

> **Important:** Soil Vision provides preliminary visual insights from an image. A normal RGB photograph cannot reliably determine exact NPK or pH values. Exact soil nutrient/pH measurements require laboratory testing or suitable sensors.

---

# 🏗️ Project Architecture

```text
AgriMitra Ai/
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── ...
│   ├── package.json
│   └── index.html
│
├── backend/                  # Node.js + Express API
│   ├── routes/
│   │   ├── auth.js
│   │   ├── recommendationRoutes.js
│   │   ├── soilVisionRoutes.js
│   │   └── alertsRoutes.js
│   ├── models/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── ai-service/               # Python + FastAPI AI services
    ├── model/
    │   ├── crop_model.pkl
    │   └── crop_encoder.pkl
    ├── data/
    ├── main.py               # Crop recommendation API
    ├── soil_model.py         # Soil image analysis
    ├── soil_server.py        # Soil Vision API
    ├── train_model.py
    └── requirements.txt
```

---

# 🛠️ Technologies Used

## Frontend

- React
- Vite
- React Router
- Axios
- Lucide React
- CSS
- Browser Web Speech API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv
- Axios
- Multer
- FormData / multipart requests

## AI / ML

- Python
- FastAPI
- Uvicorn
- scikit-learn
- Random Forest Classifier
- pandas
- NumPy
- joblib
- Pillow
- OpenCV/Python image processing where used by the Soil Vision implementation

## External API

- OpenWeather API

---

# 💻 Prerequisites

Install these before starting:

1. **Node.js**
2. **npm**
3. **Python 3.10+**
4. **MongoDB Community Server**
5. **Git** (optional)
6. An **OpenWeather API key**

Check installations:

```powershell
node --version
npm --version
python --version
```

Check MongoDB:

```powershell
Get-Service MongoDB
```

The service should show:

```text
Status : Running
```

If MongoDB is installed but stopped:

```powershell
Start-Service MongoDB
```

---

# 🚀 Installation From Start

## Step 1 — Get the Project

If you already have the project folder, open PowerShell and go to it:

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai"
```

If using Git:

```powershell
git clone YOUR_REPOSITORY_URL
cd "AgriMitra Ai"
```

---

# Step 2 — Install Frontend Dependencies

Open Terminal 1:

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\frontend"
npm install
```

Main frontend packages:

```powershell
npm install react react-dom react-router-dom axios lucide-react
```

If creating the frontend from scratch with Vite:

```powershell
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios lucide-react
```

---

# Step 3 — Install Backend Dependencies

Open Terminal 2:

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\backend"
npm install
```

Required backend packages:

```powershell
npm install express mongoose cors dotenv axios multer bcryptjs jsonwebtoken form-data
```

Development dependency:

```powershell
npm install --save-dev nodemon
```

### Backend package summary

| Package | Purpose |
|---|---|
| express | Backend REST API |
| mongoose | MongoDB connection and models |
| cors | Frontend-backend communication |
| dotenv | Environment variables |
| axios | HTTP/API requests |
| multer | Image upload handling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| form-data | Forward image data to AI service |
| nodemon | Automatic backend restart during development |

---

# Step 4 — Configure Backend `.env`

Create:

```text
backend/.env
```

Add:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/agrimitra

JWT_SECRET=agrimitra_secret_key_2026

WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

Replace:

```text
YOUR_OPENWEATHER_API_KEY
```

with your real OpenWeather API key.

### Important

Never put the OpenWeather API key directly inside React frontend code.

Never upload `.env` to GitHub.

Add this to `.gitignore`:

```gitignore
node_modules/
.env
```

---

# Step 5 — Install Python AI Dependencies

Open Terminal 3:

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\ai-service"
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then:

```powershell
.\venv\Scripts\Activate.ps1
```

You should see:

```text
(venv)
```

---

# Step 6 — Install AI Dependencies

With the virtual environment activated:

```powershell
pip install -r requirements.txt
```

If `requirements.txt` is not complete, install the required packages:

```powershell
pip install fastapi uvicorn scikit-learn pandas numpy joblib pillow python-multipart opencv-python
```

Save the installed packages:

```powershell
pip freeze > requirements.txt
```

---

# 🤖 AI Services

AgriMitra AI uses two Python services.

## 1. Crop Recommendation AI

File:

```text
ai-service/main.py
```

Runs on:

```text
http://127.0.0.1:8000
```

Endpoint:

```text
POST /predict
```

The crop model uses these parameters:

```text
Nitrogen
Phosphorus
Potassium
Temperature
Humidity
pH
Rainfall
```

The Random Forest model returns suitable crop recommendations.

The model files should be available at:

```text
ai-service/model/crop_model.pkl
ai-service/model/crop_encoder.pkl
```

If these files are not present, train the model using the project's training script:

```powershell
python train_model.py
```

---

# 2. 🌱 Soil Vision AI

File:

```text
ai-service/soil_server.py
```

Runs on:

```text
http://127.0.0.1:8001
```

Endpoint:

```text
POST /analyze
```

Soil Vision performs preliminary visual analysis of the uploaded soil image.

It can provide visual characteristics such as:

- Visible soil color
- Texture appearance
- Moisture appearance
- Image quality
- Basic farming guidance

It should not be treated as a laboratory replacement for exact soil nutrient or pH measurement.

---

# 🗄️ MongoDB Setup

Make sure MongoDB is running:

```powershell
Get-Service MongoDB
```

Expected:

```text
Status   Name
------   ----
Running  MongoDB
```

The application uses:

```text
mongodb://127.0.0.1:27017/agrimitra
```

The database can be created automatically when the application stores its first document.

You can check MongoDB with:

```powershell
mongosh
```

Then:

```text
show dbs
```

Select the database:

```text
use agrimitra
```

Show collections:

```text
show collections
```

---

# ▶️ Running the Complete Project

You need four terminals.

MongoDB does **not** need a separate terminal when it is running as a Windows service.

---

## Terminal 1 — Backend

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\backend"
node server.js
```

Or, if a start script is configured:

```powershell
npm start
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## Terminal 2 — Crop AI

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\ai-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

Crop AI:

```text
http://localhost:8000
```

Prediction endpoint:

```text
POST http://localhost:8000/predict
```

---

## Terminal 3 — Soil Vision AI

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\ai-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn soil_server:app --reload --port 8001
```

Soil Vision:

```text
http://localhost:8001
```

Analysis endpoint:

```text
POST http://localhost:8001/analyze
```

---

## Terminal 4 — Frontend

```powershell
cd "C:\Users\shree\Desktop\AgriMitra Ai\frontend"
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔗 API Architecture

```text
                    ┌──────────────────┐
                    │   React Frontend │
                    │   Port 5173      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node + Express   │
                    │ Port 5000        │
                    └──────┬─────┬─────┘
                           │     │
              ┌────────────┘     └────────────┐
              ▼                               ▼
       ┌──────────────┐                ┌──────────────┐
       │   MongoDB    │                │ OpenWeather  │
       │   Database   │                │     API      │
       └──────────────┘                └──────────────┘

                           │
                           ▼
                    ┌──────────────────┐
                    │ Python AI Layer  │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       ┌──────────────┐              ┌──────────────┐
       │ Crop AI      │              │ Soil Vision  │
       │ Port 8000    │              │ Port 8001    │
       └──────────────┘              └──────────────┘
```

---

# 📡 Important API Routes

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Weather

```text
GET /api/weather?city=Nashik
```

## Crop Recommendations

```text
POST /api/recommendations
```

## Soil Vision

```text
POST /api/soil-vision/analyze
```

Form-data field:

```text
image
```

## Farming Alerts

```text
GET /api/alerts?city=Nashik
```

---

# 🌱 Crop Recommendation Input

Example:

```json
{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 27,
  "humidity": 65,
  "ph": 6.5,
  "rainfall": 700,
  "location": "Jalgaon",
  "soil": "Black Soil",
  "water": "Medium",
  "season": "Kharif"
}
```

The ML model's prediction features are:

```text
N
P
K
Temperature
Humidity
pH
Rainfall
```

The fields:

```text
location
soil
water
season
```

are contextual application information unless the trained model/dataset is explicitly changed to use them.

---

# 🎙️ Voice Assistant

The dashboard uses browser speech capabilities for:

- English
- Hindi
- Marathi

Example questions:

```text
Should I irrigate today?
What is the weather today?
Will it rain?
Is the temperature high?
What is the humidity?
```

Voice recognition and speech synthesis depend on browser support and device microphone permissions.

---

# 🚨 Early Alert System

The alert system evaluates weather conditions such as:

```text
High temperature
High humidity
Strong wind
Heavy rain
Moderate rain
```

Example rules include:

```text
Temperature >= 38°C
Humidity >= 85%
Wind >= 40 km/h
Rain probability >= 70%
```

These are decision-support rules and should be treated as guidance rather than a replacement for field observation or professional agricultural advice.

---

# 🐛 Troubleshooting

## 1. `npm run dev` does not work

Run:

```powershell
npm install
npm run dev
```

Make sure you are inside:

```text
frontend
```

---

## 2. `nodemon is not recognized`

Use:

```powershell
npx nodemon server.js
```

Or install it:

```powershell
npm install --save-dev nodemon
```

---

## 3. MongoDB buffering timeout

Example:

```text
MongooseError: Operation users.findOne() buffering timed out
```

Check:

```powershell
Get-Service MongoDB
```

If stopped:

```powershell
Start-Service MongoDB
```

Also verify:

```env
MONGO_URI=mongodb://127.0.0.1:27017/agrimitra
```

Restart the backend after changing `.env`.

---

## 4. OpenWeather says `Invalid API key`

Check:

```env
WEATHER_API_KEY=YOUR_REAL_KEY
```

Then restart:

```powershell
node server.js
```

Do not expose the API key in frontend files.

---

## 5. Crop AI returns `422 Unprocessable Entity`

Check that the values are within the API limits.

Typical limits used by the Crop AI request model:

```text
Nitrogen:    0–200
Phosphorus:  0–200
Potassium:   0–200
Temperature: -10–60
Humidity:    0–100
pH:          0–14
Rainfall:    0–5000
```

For example:

```text
N = 90
P = 42
K = 43
Temperature = 27
Humidity = 65
pH = 6.5
Rainfall = 700
```

---

## 6. Soil Vision gives `404`

Make sure Soil Vision is running on port **8001**:

```powershell
python -m uvicorn soil_server:app --reload --port 8001
```

The endpoint is:

```text
/analyze
```

not:

```text
/predict
```

---

## 7. Frontend cannot connect to backend

Check that all services are running:

```text
Frontend       → 5173
Backend        → 5000
Crop AI        → 8000
Soil Vision    → 8001
MongoDB        → Running
```

---

# 🔐 Security

Before deploying the application:

- Never commit `.env`
- Never expose JWT secrets
- Never expose API keys in frontend code
- Use a strong `JWT_SECRET`
- Validate uploaded images
- Restrict upload file size
- Use HTTPS in production
- Configure CORS for the production frontend domain

Example `.gitignore`:

```gitignore
node_modules/
.env
venv/
__pycache__/
*.pyc
dist/
```

---

# 📦 Production Build

Build the frontend:

```powershell
cd frontend
npm run build
```

The production files will be generated in:

```text
frontend/dist/
```

The backend and Python services should be deployed separately or behind an appropriate production server/reverse proxy.

---

# 📚 Development Commands

### Frontend

```powershell
npm install
npm run dev
npm run build
```

### Backend

```powershell
npm install
node server.js
```

### Python AI

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Soil Vision:

```powershell
python -m uvicorn soil_server:app --reload --port 8001
```

---

# 🌾 Future Enhancements

Possible future improvements:

- IoT soil moisture sensors
- Real-time soil NPK/pH sensors
- More crop and disease datasets
- Advanced irrigation prediction
- Satellite/remote-sensing integration
- Regional language expansion
- SMS/WhatsApp alerts
- Farmer marketplace integration
- Pest and disease image detection
- Personalized farm history and analytics
- Cloud deployment
- Mobile application

---

# 👨‍💻 Project

**Project Name:** AgriMitra AI

**Type:** AI-Based Smart Agriculture Platform

**Frontend:** React + Vite

**Backend:** Node.js + Express

**AI:** Python + FastAPI + Machine Learning

**Database:** MongoDB

**Weather:** OpenWeather API

---

# 📄 License

This project is developed for educational/project purposes. Add your preferred open-source license before public distribution.
