import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock, MapPin } from "lucide-react";

import API from "../api";


export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    state: "Maharashtra",
    crop: ""
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response =
        await API.post(
          "/auth/register",
          form
        );


      localStorage.setItem(
        "agrimitra_token",
        response.data.token
      );

      localStorage.setItem(
        "agrimitra_user",
        JSON.stringify(
          response.data.user
        )
      );


      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        <div className="logo">
          <Leaf size={38} />
        </div>

        <h1>Join AgriMitra</h1>

        <p className="subtitle">
          Create your farmer account
        </p>


        {error && (
          <div className="error">
            {error}
          </div>
        )}


        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <div className="input-box">

            <User size={20} />

            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>


          <label>Email</label>

          <div className="input-box">

            <Mail size={20} />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>


          <label>Password</label>

          <div className="input-box">

            <Lock size={20} />

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              required
            />

          </div>


          <label>Village / City</label>

          <div className="input-box">

            <MapPin size={20} />

            <input
              name="location"
              placeholder="e.g. Nashik"
              value={form.location}
              onChange={handleChange}
              required
            />

          </div>


          <label>State</label>

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
          >

            <option>Maharashtra</option>
            <option>Gujarat</option>
            <option>Madhya Pradesh</option>
            <option>Rajasthan</option>
            <option>Uttar Pradesh</option>
            <option>Karnataka</option>
            <option>Other</option>

          </select>


          <label>Main Crop</label>

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
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>


        <p className="bottom-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}