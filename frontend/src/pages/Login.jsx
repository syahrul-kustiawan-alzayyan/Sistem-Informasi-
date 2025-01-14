import axios from "axios";
import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import vector from "../assets/10545730-removebg-preview.png";
import logo from "../assets/KANTOR__2_-removebg-preview.png";
import { FaSignOutAlt, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success or error
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
      setPopupMessage("");
      setPopupType("");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      showPopup("Username dan password harus diisi!", "error");
      return;
    }

    axios
      .post("http://localhost:3002/login", { username, password })
      .then((res) => {
        if (res.data.Status === "Sukses") {
          showPopup("Login berhasil!", "success");
          setTimeout(() => {
            if (res.data.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/");
            }
          }, 2000);
        } else {
          showPopup("Username atau password salah!", "error");
        }
      })
      .catch((error) => console.error(error));
  };

  // Logout function
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <div className="login-page">
      {popupMessage && (
        <div className={`popup ${popupType}`}>{popupMessage}</div>
      )}
      <div className="login-container">
        <div className="login-card">
          <div className="login-left">
            <div className="login-logo">
              <Link to="/">
                <img src={logo} alt="Logo" />
              </Link>
              <img src={vector} alt="Vector" />
            </div>
          </div>
          <div className="login-right">
            <h3>MASUK</h3>
            <p>
              Selamat datang di aplikasi pengajuan majelis taklim kabupaten
              garut
            </p>
            <Form onSubmit={handleSubmit}>
              {/* Username Input */}
              <InputGroup className="mb-3">
                <InputGroup.Text id="username-addon">
                  <FaUser />
                </InputGroup.Text>
                <FormControl
                  placeholder="Masukan username"
                  aria-label="Username"
                  aria-describedby="username-addon"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>

              {/* Password Input */}
              <InputGroup className="mb-3">
                <InputGroup.Text id="password-addon">
                  <FaLock />
                </InputGroup.Text>
                <FormControl
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan password"
                  aria-label="Password"
                  aria-describedby="password-addon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup.Text
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>

              <Button variant="success" type="submit" className="login-button">
                Masuk
              </Button>
            </Form>
            <div className="register-link">
              <p>
                Belum punya akun? <Link to="/register">daftar disini!</Link>
              </p>
            </div>
            {/* Logout button */}
            <Button
              variant="danger"
              className="logout-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
