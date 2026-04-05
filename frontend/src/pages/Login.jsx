import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Map, Star } from "lucide-react";
import api, { setAuthSession } from "../lib/api";
import "./Auth.css";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const TESTIMONIAL = {
  text: "I post my route at 8am and by 8:05 I have 3 passengers confirmed. The earnings cover my fuel entirely.",
  name: "Vikram R.",
  role: "Driver - Bangalore",
  letter: "V",
};

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/login", {
        email: form.email,
        password: form.password,
      });

      const user = res?.data?.user;
      const accessToken = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;

      if (!user || !accessToken || !refreshToken) {
        throw new Error("Invalid login response from server");
      }

      setAuthSession({ accessToken, refreshToken, user });

      setLoading(false);
      if (user?.role === "driver") navigate("/driver/dashboard");
      else navigate("/search");
    } catch (err) {
      setLoading(false);
      setApiError(err.body?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span className="logo-pill">VP</span>
          ViaPool
        </Link>

        <div className="auth-form-wrap">
          <div className="auth-eyebrow">Welcome back</div>
          <h1 className="auth-title">Sign in to<br /><em>ViaPool.</em></h1>
          <p className="auth-sub">Your next shared ride is waiting. Sign in to continue.</p>

          {apiError && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(196,98,45,0.08)", border: "1.5px solid rgba(196,98,45,0.25)", color: "var(--terracotta)", fontSize: "0.88rem", marginBottom: 16 }}>
              {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input id="email" type="email" className={`auth-input ${errors.email ? "error" : ""}`} placeholder="arjun@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="auth-label" htmlFor="password">Password</label>
                <span className="auth-forgot">
                  <Link to="/forgot-password">Forgot password?</Link>
                </span>
              </div>
              <div className="auth-input-wrap">
                <input id="password" type={showPwd ? "text" : "password"} className={`auth-input ${errors.password ? "error" : ""}`} placeholder="Your password" value={form.password} onChange={set("password")} autoComplete="current-password" />
                <button type="button" className="auth-input-icon" onClick={() => setShowPwd((v) => !v)} aria-label="Toggle password">
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-link">New to ViaPool? <Link to="/register">Create an account</Link></p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-stripe" />
        <div className="auth-right-stripe-2" />
        <div className="auth-right-content">
          <div className="auth-right-icon">
            <Map size={40} />
          </div>
          <h2 className="auth-right-title">Every commute,<br /><em>shared smarter.</em></h2>
          <p className="auth-right-sub">Real-time matching, verified drivers, and secure payments all in one place.</p>
          <div className="auth-right-stats">
            {[
              { num: "98%", lbl: "Safety score" },
              null,
              { num: "22min", lbl: "Avg match time" },
              null,
              { num: "4.9", lbl: "Avg rating", icon: Star },
            ].map((s, i) =>
              s === null ? <div className="ars-div" key={i} /> : (
                <div className="ars-item" key={s.num}>
                  <div className="ars-num" style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                    {s.num}
                    {s.icon ? <s.icon size={16} /> : null}
                  </div>
                  <div className="ars-lbl">{s.lbl}</div>
                </div>
              )
            )}
          </div>
          <div className="auth-testimonial">
            <div className="at-text">"{TESTIMONIAL.text}"</div>
            <div className="at-author">
              <div className="at-av">{TESTIMONIAL.letter}</div>
              <div>
                <div className="at-name">{TESTIMONIAL.name}</div>
                <div className="at-role">{TESTIMONIAL.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
