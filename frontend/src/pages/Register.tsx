import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [image, setImage] = useState<string>("");

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="profile-upload">

          {image ? (
            <img
              src={image}
              alt="profile"
              className="preview"
            />
          ) : (
            <div className="upload-circle">
              Upload
            </div>
          )}

          <input
            type="file"
            onChange={handleImage}
          />
        </div>

        <div className="grid">

          <input placeholder="First Name" />
          <input placeholder="Last Name" />

          <input placeholder="Email" />
          <input placeholder="Phone Number" />

          <select>
            <option>Select Role</option>
            <option>Admin</option>
            <option>Officer</option>
            <option>Vendor</option>
            <option>Manager</option>
          </select>

          <input placeholder="Country" />

        </div>

        <textarea
          placeholder="Additional Information..."
        />

        <button className="register-btn">
          Register
        </button>

      </div>
    </div>
  );
}