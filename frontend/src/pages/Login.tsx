import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="photo-box">
          <span>Photo</span>
        </div>

        <input
          type="text"
          placeholder="Username"
          className="input-box"
        />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
        />

        <button className="login-btn">
          Login
        </button>

        <p className="register-link">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}