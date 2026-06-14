import { useState } from "react";
import { Leaf, LockKeyhole, LogIn, Mail } from "lucide-react";
import { apiRequest } from "./middleware/request.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try { 
      const res = await apiRequest(
     `/login`,
      "POST",
      { email, password }
    );
    console.log("Login response:", res);
  const user = await apiRequest(
    `/login/me`,
    "GET"
  );

  onLogin(user);

} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <div className="login-logo">
            <Leaf size={24} />
          </div>
          <div>
            <h1>EcoSensor</h1>
          </div>
        </div>

        <div className="login-heading">
          <h2>Entrar</h2>
        </div>

        <label className="login-field">
          <span>Email</span>
          <div className="login-input-wrap">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="login-field">
          <span>Palavra-passe</span>
          <div className="login-input-wrap">
            <LockKeyhole size={18} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </label>

        {error && <div className="login-error">{error}</div>}

        <button className="login-submit" type="submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? "A iniciar sessão..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
