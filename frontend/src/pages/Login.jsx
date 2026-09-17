import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock } from "lucide-react";

import API from "../api";


export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response =
        await API.post(
          "/auth/login",
          {
            email,
            password
          }
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
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="logo">
          <Leaf size={38} />
        </div>

        <h1>AgriMitra AI</h1>

        <p className="subtitle">
          Smart farming starts here 🌾
        </p>


        {error && (
          <div className="error">
            {error}
          </div>
        )}


        <form onSubmit={handleLogin}>

          <label>Email</label>

          <div className="input-box">

            <Mail size={20} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <label>Password</label>

          <div className="input-box">

            <Lock size={20} />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="bottom-text">

          Don't have an account?

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}