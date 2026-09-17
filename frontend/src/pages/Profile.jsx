import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Leaf
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import API from "../api";


export default function Profile() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      location: "",
      state: "",
      crop: ""
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "agrimitra_user"
      );

    if (savedUser) {

      const user =
        JSON.parse(savedUser);

      setForm({
        name: user.name || "",
        location: user.location || "",
        state: user.state || "",
        crop: user.crop || ""
      });

    }

  }, []);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };


  const saveProfile = async () => {

    try {

      setLoading(true);

      const response =
        await API.put(
          "/auth/profile",
          form
        );


      localStorage.setItem(
        "agrimitra_user",
        JSON.stringify(response.data)
      );


      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      setMessage(
        "Unable to update profile."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="profile-page">

      <div className="profile-container">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft />
          Dashboard
        </button>


        <div className="profile-header">

          <div className="profile-logo">
            <Leaf size={35} />
          </div>

          <div>

            <h1>
              Farmer Profile
            </h1>

            <p>
              Update your farming information
            </p>

          </div>

        </div>


        {message && (
          <div className="success">
            {message}
          </div>
        )}


        <div className="profile-form">

          <label>
            Full Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />


          <label>
            Village / City
          </label>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />


          <label>
            State
          </label>

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            <option>Maharashtra</option>
            <option>Gujarat</option>
            <option>Madhya Pradesh</option>
            <option>Rajasthan</option>
            <option>Karnataka</option>
            <option>Other</option>
          </select>


          <label>
            Main Crop
          </label>

          <select
            name="crop"
            value={form.crop}
            onChange={handleChange}
          >

            <option value="">
              Select crop
            </option>

            <option>Wheat</option>
            <option>Rice</option>
            <option>Tomato</option>
            <option>Onion</option>
            <option>Soybean</option>
            <option>Cotton</option>
            <option>Sugarcane</option>
            <option>Maize</option>

          </select>


          <button
            className="primary-btn"
            onClick={saveProfile}
            disabled={loading}
          >

            <Save size={19} />

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </div>
  );
}