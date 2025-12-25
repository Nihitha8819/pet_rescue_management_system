import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

import "./adminlogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!email) temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      temp.email = "Enter a valid email address.";

    if (!password) temp.password = "Password is required.";
    else if (password.length < 6)
      temp.password = "Password must be at least 6 characters.";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!validate()) return;

   try {
     const loggedInUser = await login(email, password);

     if (loggedInUser.user_type !== "admin") {
       setErrors({ general: "Access denied. Admins only." });
       return;
     }

     navigate("/AdminPage");
   } catch (err) {
     setErrors({
       general:
         err.response?.data?.error ||
         "Invalid admin credentials.",
     });
   }
 };


  return (
    <div className="add-wrapper">
      <div className="container">
        <div className="a-card">
          <h2>Welcome Admin</h2>
          <p className="subtitle">Login to Admin-Dashbord.</p>

          <form className="a-form" onSubmit={handleSubmit}>
            {errors.general && (
              <p className="error-text" style={{ textAlign: "center" }}>
                {errors.general}</p>)}

            <div className="field-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validate();
                }}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="field-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validate();
                }}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <button
              className="a-btn"
              disabled={!email || !password || Object.keys(errors).length > 0}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
