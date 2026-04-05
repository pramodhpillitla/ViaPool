import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Wallet, 
  Car, 
  Search, 
  ClipboardList, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  ArrowLeftRight,
  Menu,
  X
} from "lucide-react";
import api, { API_URL, REFRESH_TOKEN_KEY, clearAuthStorage } from "../lib/api";
import { logger } from "../lib/logger";
import "../pages/AppShell.css";

const DRIVER_LINKS = [
  { to: "/driver/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { to: "/driver/rides/create",   icon: PlusCircle,      label: "Post a Ride" },
  { to: "/driver/rides",          icon: Briefcase,       label: "My Rides" },
  { to: "/driver/earnings",       icon: Wallet,          label: "Earnings" },
  { to: "/driver/vehicles",       icon: Car,             label: "My Vehicles" },
];

const PASSENGER_LINKS = [
  { to: "/search",                icon: Search,          label: "Find a Ride" },
  { to: "/passenger/bookings",    icon: ClipboardList,   label: "My Bookings" },
];

// SHARED_LINKS will now have dynamic badges handled in the render
const SHARED_LINKS = [
  { to: "/profile",        icon: User,     label: "Profile" },
  { to: "/notifications",  icon: Bell,     label: "Notifications" },
  { to: "/settings",       icon: Settings, label: "Settings" },
];

export default function AppShell({ children, title, role: initialRole = "passenger" }) {
  const navigate   = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState(initialRole);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserResponse = await api.get("/api/v1/auth/current-user");
        const currentUser = currentUserResponse.data;
        setUser(currentUser);

        const storedRole = localStorage.getItem("via-role");
        const nextRole =
          currentUser.role === "driver"
            ? storedRole === "passenger"
              ? "passenger"
              : "driver"
            : "passenger";

        setRole(nextRole);
        localStorage.setItem("via-role", nextRole);

        try {
          const unreadResponse = await api.get("/api/v1/notifications/unread-count");
          setUnreadCount(unreadResponse.data?.unreadCount || 0);
        } catch (notificationError) {
          logger.error("Failed to fetch unread notifications", notificationError);
          setUnreadCount(0);
        }
      } catch (err) {
        logger.error("Failed to fetch sidebar data", err);
        if (err.status === 401) {
          clearAuthStorage();
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [location.key, navigate]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(API_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("via-token")
      }
    });

    socket.on("connect", () => {
      socket.emit("join-user-room", user._id);
    });

    socket.on("notification:new", () => {
      setUnreadCount((count) => count + 1);
    });

    socket.on("connect_error", (err) => {
      logger.error("AppShell socket connection failed", err);
    });

    return () => socket.disconnect();
  }, [user?._id]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await api.post(
          "/api/v1/auth/logout",
          { refreshToken },
          { skipAuthRefresh: true },
        );
      }
    } catch (error) {
      logger.error("Logout request failed", error);
    } finally {
      clearAuthStorage();
      navigate("/login");
    }
  };

  const toggleRole = () => {
    if (user?.role !== "driver") {
      return;
    }

    const newRole = role === "driver" ? "passenger" : "driver";
    setRole(newRole);
    localStorage.setItem("via-role", newRole);
    navigate(newRole === "driver" ? "/driver/dashboard" : "/search");
  };

  const activeLinks = role === "driver" ? DRIVER_LINKS : PASSENGER_LINKS;
  const userInitial = user?.firstName?.[0] || "U";

  const renderUserAvatar = (sizeStyle) => (
    <div
      className="su-av"
      style={sizeStyle}
      onClick={sizeStyle?.cursor ? () => navigate("/profile") : undefined}
    >
      {user?.profilePhoto ? (
        <img
          src={user.profilePhoto}
          alt={user.firstName || "User"}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        userInitial
      )}
    </div>
  );

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <span className="logo-pill">VP</span>
          ViaPool
        </NavLink>

        <nav className="sidebar-nav">
          <div className="sidebar-section-container">
              <div className="sidebar-section-label">{role === "driver" ? "Driver" : "Passenger"} View</div>
              {user?.role === "driver" ? (
                <button className="role-switch-btn" onClick={toggleRole}>
                  <ArrowLeftRight size={14} />
                  Switch to {role === "driver" ? "Passenger" : "Driver"}
                </button>
              ) : null}
          </div>
          
          {activeLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <link.icon className="sl-icon" size={20} />
              {link.label}
            </NavLink>
          ))}

          <div className="sidebar-section-label">Account</div>
          {SHARED_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <link.icon className="sl-icon" size={20} />
              {link.label}
              {link.label === "Notifications" && unreadCount > 0 && (
                  <span className="sl-badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User block */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="su-av">
                {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.firstName} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                    user?.firstName?.[0] || "U"
                )}
            </div>
            <div className="su-info">
              <div className="su-name">{user?.firstName || "Loading..."} {user?.lastName}</div>
              <button className="su-logout" onClick={handleLogout}>
                  <LogOut size={12} />
                  Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="page-content">
        <header className="page-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu-btn"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="topbar-title">{title}</div>
          </div>
          <div className="topbar-right">
            <button
              className="topbar-bell"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </button>
            {renderUserAvatar({ cursor: "pointer", width: 34, height: 34 })}
          </div>
        </header>
        <div
          className={`mobile-nav-backdrop ${mobileNavOpen ? "open" : ""}`}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden={!mobileNavOpen}
        />
        <aside className={`mobile-nav-drawer ${mobileNavOpen ? "open" : ""}`}>
          <div className="mobile-nav-header">
            <NavLink to="/" className="sidebar-logo">
              <span className="logo-pill">VP</span>
              ViaPool
            </NavLink>
            <button
              className="topbar-menu-btn"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mobile-nav-links">
            <div className="sidebar-section-container">
              <div className="sidebar-section-label">{role === "driver" ? "Driver" : "Passenger"} View</div>
              {user?.role === "driver" ? (
                <button className="role-switch-btn" onClick={toggleRole}>
                  <ArrowLeftRight size={14} />
                  Switch
                </button>
              ) : null}
            </div>

            {activeLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <link.icon className="sl-icon" size={20} />
                {link.label}
              </NavLink>
            ))}

            <div className="sidebar-section-label">Account</div>
            {SHARED_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <link.icon className="sl-icon" size={20} />
                {link.label}
                {link.label === "Notifications" && unreadCount > 0 && (
                  <span className="sl-badge">{unreadCount}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom mobile-nav-user-block">
            <div className="sidebar-user">
              {renderUserAvatar()}
              <div className="su-info">
                <div className="su-name">{user?.firstName || "Loading..."} {user?.lastName}</div>
                <button className="su-logout" onClick={handleLogout}>
                  <LogOut size={12} />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
