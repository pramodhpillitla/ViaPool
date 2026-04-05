import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import api, { clearAuthStorage } from "../lib/api";
import StatusNotice from "../components/ui/StatusNotice";
import "../pages/AppShell.css";

const SETTINGS_PREFS_KEY = "via-settings-prefs";
const DEFAULT_PREFERENCES = {
  lang: "english",
  curr: "inr",
  location: "while_using",
  data: "enabled",
};

const CHOICE_FIELDS = {
  lang: {
    options: [
      { value: "english", label: "English", sub: "Use English across the app." },
      { value: "hindi", label: "Hindi", sub: "Show primary labels in Hindi." },
      { value: "telugu", label: "Telugu", sub: "Show primary labels in Telugu." },
    ],
  },
  curr: {
    options: [
      { value: "inr", label: "INR (Rs.)", sub: "Display fares in Indian Rupees." },
      { value: "usd", label: "USD ($)", sub: "Display fares in US Dollars." },
    ],
  },
  location: {
    options: [
      { value: "while_using", label: "Only while using app", sub: "Share location only when ViaPool is open." },
      { value: "always", label: "Always allow", sub: "Keep location available for smoother live tracking." },
      { value: "never", label: "Don't allow", sub: "Disable location access for the app." },
    ],
  },
  data: {
    options: [
      { value: "enabled", label: "Help improve ViaPool", sub: "Share anonymous diagnostics to improve the app." },
      { value: "essential", label: "Essential only", sub: "Keep only required service telemetry enabled." },
      { value: "disabled", label: "Don't share", sub: "Turn off analytics collection where possible." },
    ],
  },
};

const getChoiceLabel = (fieldId, value, fallback) =>
  CHOICE_FIELDS[fieldId]?.options.find((option) => option.value === value)?.label || fallback;

export default function Settings() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({ twoFa: false, showPhone: true });
  const [modal, setModal] = useState(null);
  const [confirmed, setConfirmed] = useState("");
  const [user, setUser] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [modalError, setModalError] = useState("");
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const applyUserState = (nextUser) => {
    setUser(nextUser);
    if (nextUser?.privacy) {
      setToggles((prev) => ({
        ...prev,
        twoFa: !!nextUser.privacy.twoFa,
        showPhone: !!nextUser.privacy.showPhone,
      }));
    }
  };

  const fetchUser = useEffectEvent(async () => {
    try {
      const res = await api.get("/api/v1/auth/current-user");
      applyUserState(res?.data || null);
    } catch (err) {
      setNotice({
        tone: "error",
        message: err?.body?.message || err.message || "We could not load your latest settings.",
      });
    }
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(SETTINGS_PREFS_KEY);
      if (!savedPrefs) return;
      setPreferences((prev) => ({ ...prev, ...JSON.parse(savedPrefs) }));
    } catch {
      localStorage.removeItem(SETTINGS_PREFS_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const SECTIONS = [
    {
      title: "Account",
      items: [
        { id: "email", label: "Email address", sub: user?.email || "Loading...", action: "Change" },
        { id: "phone", label: "Phone number", sub: user?.phone || "Not set", action: "Change" },
        { id: "bio", label: "Bio", sub: user?.bio || "No bio added", action: "Change" },
        { id: "tagline", label: "Tagline", sub: user?.tagline || "No tagline", action: "Change" },
        { id: "password", label: "Password", sub: "********", action: "Change" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { id: "lang", label: "Language", sub: getChoiceLabel("lang", preferences.lang, "English"), action: "Change" },
        { id: "curr", label: "Currency", sub: getChoiceLabel("curr", preferences.curr, "INR (Rs.)"), action: "Change" },
      ],
    },
    {
      title: "Privacy",
      items: [
        { id: "location", label: "Location access", sub: getChoiceLabel("location", preferences.location, "Only while using app"), action: "Manage" },
        { id: "data", label: "Data & analytics", sub: getChoiceLabel("data", preferences.data, "Help improve ViaPool"), action: "Manage" },
      ],
    },
    {
      title: "Danger Zone",
      danger: true,
      items: [
        { id: "deactivate", label: "Deactivate account", sub: "Temporarily pause your profile", action: "Deactivate" },
        { id: "delete", label: "Delete account", sub: "Permanently remove all your data", action: "Delete" },
      ],
    },
  ];

  const Toggle = ({ k }) => {
    const handleChange = async (e) => {
      const val = e.target.checked;
      setToggles((prev) => ({ ...prev, [k]: val }));
      try {
        const res = await api.patch("/api/v1/auth/update-profile", { privacy: { [k]: val } });
        applyUserState(res?.data || null);
        setNotice({
          tone: "success",
          message: `${k === "twoFa" ? "Two-factor preference" : "Phone visibility"} updated.`,
        });
      } catch (err) {
        setToggles((prev) => ({ ...prev, [k]: !val }));
        setNotice({
          tone: "error",
          message: err?.body?.message || err.message || "That setting could not be updated.",
        });
      }
    };

    return (
      <label style={{ position: "relative", width: 44, height: 24, flexShrink: 0, cursor: "pointer" }}>
        <input type="checkbox" checked={toggles[k]} onChange={handleChange} style={{ display: "none" }} />
        <div
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: toggles[k] ? "var(--forest)" : "var(--sand)",
            transition: "background 0.25s",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4,
              left: toggles[k] ? 23 : 4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.25s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </label>
    );
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setModalError("");

      if (modal.id === "delete") {
        setModalError("Permanent account deletion is not available yet. You can deactivate your account instead.");
        return;
      }

      if (modal.id === "deactivate") {
        await api.patch("/api/v1/auth/deactivate");
        setNotice({
          tone: "success",
          message: "Your account has been deactivated. Signing you out now.",
        });
        setModal(null);
        clearAuthStorage();
        navigate("/login");
        return;
      }

      if (CHOICE_FIELDS[modal.id]) {
        setPreferences((prev) => ({ ...prev, [modal.id]: editValue }));
        setNotice({
          tone: "success",
          message: `${modal.label} updated for this device.`,
        });
        setModal(null);
        setEditValue("");
        return;
      }

      const payload = { [modal.id]: editValue.trim() };
      const res = await api.patch("/api/v1/auth/update-profile", payload);
      applyUserState(res?.data || null);
      setNotice({
        tone: "success",
        message: `${modal.label} updated successfully.`,
      });
      setModal(null);
      setEditValue("");
    } catch (err) {
      setModalError(err?.body?.message || err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const TOGGLE_PREFS = [
    { key: "twoFa", label: "Two-factor Authentication", sub: "Add an extra layer of security to your account." },
    { key: "showPhone", label: "Show phone number", sub: "Visible to other users during an active ride." },
  ];

  return (
    <AppShell title="Settings" unreadCount={3}>
      <StatusNotice
        tone={notice?.tone}
        message={notice?.message}
        onClose={() => setNotice(null)}
        style={{ marginBottom: notice ? 18 : 0 }}
      />

      <div className="page-header">
        <div className="page-header-eyebrow">Account</div>
        <h1 className="page-header-title">Settings</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start", maxWidth: 960 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SECTIONS.map((section) => (
            <div key={section.title} className="info-card">
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1rem",
                  color: section.danger ? "var(--terracotta)" : "var(--ink)",
                  marginBottom: 16,
                }}
              >
                {section.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {section.items.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 0",
                      borderTop: i > 0 ? "1px solid var(--sand)" : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: section.danger ? "var(--terracotta)" : "var(--ink)" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--mist)", marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <button
                      onClick={() => {
                        setModal(item);
                        setModalError("");
                        setConfirmed("");
                        setEditValue(
                          item.id === "email" ? (user?.email || "") :
                          item.id === "phone" ? (user?.phone || "") :
                          item.id === "bio" ? (user?.bio || "") :
                          item.id === "tagline" ? (user?.tagline || "") :
                          CHOICE_FIELDS[item.id] ? preferences[item.id] :
                          ""
                        );
                      }}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 8,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: section.danger ? "1.5px solid rgba(196,98,45,0.3)" : "1.5px solid var(--sand)",
                        background: "transparent",
                        color: section.danger ? "var(--terracotta)" : "var(--ink)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="info-card" style={{ position: "sticky", top: 80 }}>
          <div className="info-card-title">Security & Privacy</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {TOGGLE_PREFS.map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--mist)", lineHeight: 1.5 }}>{item.sub}</div>
                </div>
                <Toggle k={item.key} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--sand)", fontSize: "0.8rem", color: "var(--mist)", lineHeight: 1.6 }}>
            ViaPool v1.0.0 · <a href="#" style={{ color: "var(--terracotta)", textDecoration: "none" }}>Privacy Policy</a> · <a href="#" style={{ color: "var(--terracotta)", textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </div>

      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ background: "var(--cream)", borderRadius: 20, padding: 32, maxWidth: 420, width: "100%" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--ink)", marginBottom: 8 }}>{modal.label}</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--mist)", marginBottom: 20, lineHeight: 1.6 }}>
              {modal.id === "delete"
                ? "Permanent deletion is not available yet. Type DELETE if you want to acknowledge this and review the warning."
                : CHOICE_FIELDS[modal.id]
                  ? `Choose how you want ${modal.label.toLowerCase()} to work.`
                  : `This will let you update your ${modal.label.toLowerCase()}. This feature connects to the API.`}
            </p>

            {modal.id === "delete" ? (
              <input
                className="auth-input"
                placeholder="Type DELETE to confirm"
                value={confirmed}
                onChange={(e) => setConfirmed(e.target.value)}
                style={{ marginBottom: 16 }}
              />
            ) : CHOICE_FIELDS[modal.id] ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {CHOICE_FIELDS[modal.id].options.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: `1.5px solid ${editValue === option.value ? "rgba(196,98,45,0.45)" : "var(--sand)"}`,
                      background: editValue === option.value ? "rgba(196,98,45,0.06)" : "var(--parchment)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={modal.id}
                      value={option.value}
                      checked={editValue === option.value}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ marginTop: 3 }}
                    />
                    <span>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", marginBottom: 2 }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--mist)", lineHeight: 1.5 }}>
                        {option.sub}
                      </div>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="auth-field">
                <label className="auth-label">New {modal.label}</label>
                <input
                  className="auth-input"
                  placeholder={`Enter new ${modal.label.toLowerCase()}`}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
              </div>
            )}

            {modalError && (
              <div style={{ color: "var(--terracotta)", fontSize: "0.82rem", marginBottom: 14, lineHeight: 1.5 }}>
                {modalError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-outline"
                onClick={() => {
                  setModal(null);
                  setConfirmed("");
                  setEditValue("");
                  setModalError("");
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={(modal.id === "delete" && confirmed !== "DELETE") || (modal.id !== "delete" && !editValue.trim())}
                style={{ flex: 1, background: ["delete", "deactivate"].includes(modal.id) ? "var(--terracotta)" : undefined }}
                onClick={handleUpdate}
              >
                {saving ? "Saving..." : modal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
