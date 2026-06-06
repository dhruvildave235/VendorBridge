import "./RegistrationScreen.css";

export default function RegistrationScreen() {
  return (
    <div className="container">
      {/* Login Section */}

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
          Login Button
        </button>
      </div>

      {/* Registration Section */}

      <div className="register-card">
        <div className="register-header">
          <div className="profile-circle">
            Photo
          </div>
        </div>

        <div className="form-grid">
          <input placeholder="First Name" />
          <input placeholder="Last Name" />

          <input placeholder="Email Address" />
          <input placeholder="Phone Number" />

          <input placeholder="Role (Admin, Officer)" />
          <input placeholder="Country" />
        </div>

        <textarea
          placeholder="Additional Information..."
        ></textarea>

        <button className="register-btn">
          Register
        </button>
      </div>
    </div>
  );
}