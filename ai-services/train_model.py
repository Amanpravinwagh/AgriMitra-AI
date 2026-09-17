import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "Crop_recommendation.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

os.makedirs(MODEL_DIR, exist_ok=True)


print("====================================")
print(" AgriMitra Crop Recommendation AI ")
print("====================================")


# -----------------------------------
# LOAD DATASET
# -----------------------------------

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(
        f"Dataset not found:\n{DATA_PATH}"
    )


df = pd.read_csv(DATA_PATH)

print("\nDataset loaded successfully.")
print("Rows:", len(df))
print("Columns:", list(df.columns))


# -----------------------------------
# CLEAN COLUMN NAMES
# -----------------------------------

df.columns = [
    column.strip().lower()
    for column in df.columns
]


required_columns = [
    "n",
    "p",
    "k",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
    "label"
]


missing = [
    column
    for column in required_columns
    if column not in df.columns
]


if missing:
    raise ValueError(
        f"Missing columns: {missing}"
    )


# -----------------------------------
# FEATURES
# -----------------------------------

features = [
    "n",
    "p",
    "k",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]


X = df[features]

y = df["label"]


# -----------------------------------
# ENCODE CROP LABELS
# -----------------------------------

encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)


# -----------------------------------
# TRAIN / TEST SPLIT
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# -----------------------------------
# RANDOM FOREST
# -----------------------------------

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)


print("\nTraining model...")

model.fit(
    X_train,
    y_train
)


# -----------------------------------
# EVALUATION
# -----------------------------------

predictions = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    predictions
)


print("\n====================================")
print("MODEL RESULTS")
print("====================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        target_names=encoder.classes_
    )
)


# -----------------------------------
# FEATURE IMPORTANCE
# -----------------------------------

print("\nFeature importance:")

for feature, importance in zip(
    features,
    model.feature_importances_
):
    print(
        f"{feature}: "
        f"{importance:.4f}"
    )


# -----------------------------------
# SAVE MODEL
# -----------------------------------

model_path = os.path.join(
    MODEL_DIR,
    "crop_model.pkl"
)

encoder_path = os.path.join(
    MODEL_DIR,
    "crop_encoder.pkl"
)


joblib.dump(
    model,
    model_path
)

joblib.dump(
    encoder,
    encoder_path
)


print("\n====================================")
print("MODEL SAVED")
print("====================================")

print(model_path)
print(encoder_path)

print("\nTraining completed successfully.")