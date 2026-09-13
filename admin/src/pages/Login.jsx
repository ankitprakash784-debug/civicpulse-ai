import { useState } from "react";

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}
        <div className="login-logo">
          🏛️
        </div>

        <h1>
          Civic<span>Pulse</span> AI
        </h1>

        <p className="login-subtitle">
          Admin Portal
        </p>

        <p className="login-welcome">
          Sign in to your admin account
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="admin@civicpulse.ai"
              required
            />
          </div>


          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">

              <input
               type={showPassword ? "text" : "password"}
               placeholder="Enter your password"
               required
               autoComplete="current-password"
            />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>

            </div>
          </div>


          {/* REMEMBER + FORGOT */}
          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>Remember me</span>

            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert("Password recovery will be available soon.")
              }
            >
              Forgot password?
            </button>

          </div>


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
          >
            Login →
          </button>

        </form>


        {/* FOOTER */}
        <div className="login-divider">
          <span></span>
          <p>Admin access only</p>
          <span></span>
        </div>

        <p className="login-security">
          🛡️ Your admin data is secure with us
        </p>

      </div>

    </div>
  );
}

export default Login;