import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Cookie from "js-cookie";
import { GoogleLogin } from 'react-google-login';
import env from "../../env.json";
import './login.css';


function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submit behavior
    const hashedPassword = sha256(password).toString();
    const data = {
      Email: email,
      Password: hashedPassword
    };

    try {
      const response = await axios.post(`${env.api}/users/login`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response && response.status === 200) {
        Cookie.set("signed_in_user", response.data);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      alert('Wrong email or password');
    }
  };

  const handleGoogleLogin = async (googleData) => {
    const { tokenObj } = googleData;
    try {
      const response = await axios.post(`${env.api}/users/googleLogin`, {
        token: tokenObj.id_token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.status === 200) {
        Cookie.set("signed_in_user", response.data);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      alert('Google login failed');
    }
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="login-background">
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button" onClick={handleSubmit}>Login</button>
        <div className="separator">Do you want to continue with Google?</div>
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Login with Google"
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={'single_host_origin'}
        />
        <div className="terms">
          By clicking continue, you agree to our <strong>Terms of Service</strong> and <strong>Privacy policy</strong>
        </div>
      </div>
    </div>
    </div>

  );
}

export default Login;
