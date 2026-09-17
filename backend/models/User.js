const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    location: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    crop: {
      type: String,
      default: ""
    },

    soilType: {
      type: String,
      default: ""
    },

    irrigation: {
      type: String,
      default: ""
    },

    season: {
      type: String,
      default: ""
    },

    landArea: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);