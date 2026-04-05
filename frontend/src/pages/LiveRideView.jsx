import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import api, { API_URL } from "../lib/api";
import { logger } from "../lib/logger";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CarFront,
  Check,
  Circle,
  Clock,
  Flag,
  Gauge,
  MapPin,
  User,
  UserRound,
} from "lucide-react";
import AppShell from "../components/AppShell";
import LeafletMap from "../components/LeafletMap";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import StatusNotice from "../components/ui/StatusNotice";
import "../pages/AppShell.css";

const DEFAULT_COORDS = { lat: 20.5937, lng: 78.9629 };

const toLatLng = (pointLike) => {
  if (!pointLike) return null;

  const coords =
    (Array.isArray(pointLike?.location?.coordinates) &&
      pointLike.location.coordinates) ||
    (Array.isArray(pointLike?.coordinates) && pointLike.coordinates) ||
    null;

  if (!coords || coords.length !== 2) return null;

  const [lng, lat] = coords;
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  return { lat, lng };
};

export default function LiveRideView() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [ended, setEnded] = useState(false);
  const [ride, setRide] = useState(null);
  const [socket, setSocket] = useState(null);
  const [driverCoords, setDriverCoords] = useState(DEFAULT_COORDS);
  const [passengerCoords, setPassengerCoords] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [startCoords, setStartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showSosDialog, setShowSosDialog] = useState(false);
  const [sendingSos, setSendingSos] = useState(false);
  const [endingRide, setEndingRide] = useState(false);

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const [rideRes, passengerRes] = await Promise.all([
          api.get(`/api/v1/rides/${rideId}`),
          api.get(`/api/v1/bookings/${rideId}/passengers`),
        ]);

        const rideData = rideRes.data;
        setRide(rideData);

        const rideStart = toLatLng(rideData.from);
        if (rideStart) {
          setStartCoords(rideStart);
          setDriverCoords(rideStart);
        }

        const rideDestination = toLatLng(rideData.to);
        if (rideDestination) {
          setDestinationCoords(rideDestination);
        }

        const firstPassenger = (passengerRes.data || []).find((booking) =>
          toLatLng(booking.pickupPoint),
        );
        if (firstPassenger) {
          setPickupCoords(toLatLng(firstPassenger.pickupPoint));
        }
      } catch (err) {
        logger.error("Failed to fetch live ride data", err);
      }
    };

    fetchRideData();

    const newSocket = io(API_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("via-token"),
      },
    });

    newSocket.on("connect", () => {
      newSocket.emit("join-ride-room", rideId);
    });

    newSocket.on("connect_error", (err) => {
      logger.error("Live ride socket connection failed", err);
    });

    newSocket.on("passenger-location", (data) => {
      setPassengerCoords({ lat: data.lat, lng: data.lng });
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [rideId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ended || !socket || !navigator.geolocation) {
      setIsMoving(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setDriverCoords({ lat, lng });
        setIsMoving(true);

        if (
          typeof position.coords.speed === "number" &&
          !Number.isNaN(position.coords.speed)
        ) {
          setSpeed(Math.max(0, Math.round(position.coords.speed * 3.6)));
        }

        socket.emit("location-update", { rideId, lat, lng });
      },
      (error) => {
        logger.error("Driver geolocation failed", error);
        setIsMoving(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsMoving(false);
    };
  }, [ended, socket, rideId]);

  const fmt = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60,
    ).padStart(2, "0")}`;

  const routePath = useMemo(
    () =>
      [startCoords, driverCoords, passengerCoords || pickupCoords, destinationCoords].filter(Boolean),
    [startCoords, driverCoords, passengerCoords, pickupCoords, destinationCoords],
  );

  const handleSOS = async () => {
    try {
      setSendingSos(true);
      setNotice(null);
      await api.post("/api/v1/sos/trigger", {
        rideId,
        lat: driverCoords.lat,
        lng: driverCoords.lng,
        message: "Driver triggered emergency SOS",
      });
      setNotice({
        tone: "success",
        message: "SOS alert sent. Emergency contacts and admins have been notified.",
      });
      setShowSosDialog(false);
    } catch (err) {
      setNotice({
        tone: "error",
        message: err?.body?.message || err.message || "Failed to send SOS alert.",
      });
    } finally {
      setSendingSos(false);
    }
  };

  const handleEnd = async () => {
    try {
      setEndingRide(true);
      await api.patch(`/api/v1/rides/${rideId}/status`, { status: "completed" });
      setEnded(true);
      setNotice({
        tone: "success",
        message: "Ride marked as completed.",
      });
    } catch (err) {
      setNotice({
        tone: "error",
        message: err?.body?.message || err.message || "Failed to complete ride.",
      });
    } finally {
      setEndingRide(false);
    }
  };

  return (
    <AppShell title="Live Ride" role="driver" unreadCount={3}>
      <StatusNotice
        tone={notice?.tone}
        message={notice?.message}
        onClose={() => setNotice(null)}
        style={{ marginBottom: notice ? 18 : 0 }}
      />

      <div className="page-header">
        <div
          className="page-header-eyebrow"
          style={{
            color: ended ? "var(--forest)" : "var(--terracotta)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {ended ? (
            <>
              <Check size={16} /> Ride Completed
            </>
          ) : (
            <>
              <Circle size={10} fill="var(--terracotta)" /> Live
            </>
          )}
        </div>
        <h1 className="page-header-title">
          {ride?.from?.address?.split(",")?.[0] || "..."} to
          <em>{ride?.to?.address?.split(",")?.[0] || "..."}</em>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div
          className="track-map"
          style={{
            height: 400,
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          <LeafletMap
            center={driverCoords}
            driverCoords={driverCoords}
            passengerCoords={passengerCoords}
            pickupCoords={pickupCoords}
            startCoords={startCoords}
            destinationCoords={destinationCoords}
            routePath={routePath}
            showMarkerLabels
            zoom={15}
          />
          <div className="track-eta-banner" style={{ zIndex: 10 }}>
            Driver live · {isMoving ? "Using current GPS" : "Waiting for location"} ·
            Blue: driver · Orange: passenger live · Amber: pickup · Brown: start · Green: destination
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="info-card-dark" style={{ borderRadius: 20, padding: 24 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 8,
              }}
            >
              {[
                { label: "Elapsed", val: fmt(elapsed), icon: Clock },
                { label: "Speed", val: `${speed} km/h`, icon: Gauge },
                { label: "Vehicle", val: `${ride?.vehicle?.brand || "..."}`, icon: Car },
                { label: "Seats", val: `${ride?.totalSeats || 0}`, icon: User },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(245,240,232,0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <item.icon size={10} /> {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.2rem",
                      color: "var(--cream)",
                    }}
                  >
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <div style={{ fontSize: "0.78rem", color: "var(--mist)", marginBottom: 4 }}>
              Price per Seat
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.4rem",
                color: "var(--ink)",
                letterSpacing: "-0.03em",
              }}
            >
              Rs.{ride?.pricePerSeat || 0}
            </div>
          </div>

          <div className="info-card">
            <div style={{ fontSize: "0.8rem", color: "var(--mist)", marginBottom: 10 }}>
              Map Legend
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: "0.86rem",
                color: "var(--ink)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CarFront size={14} color="#2d6ea3" /> Driver current location
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserRound size={14} color="#c4622d" /> Passenger live location
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={14} color="#d98a3a" /> Passenger pickup point
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={14} color="#8a5a2b" /> Ride start point
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Flag size={14} color="#2d4a35" /> Destination
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSosDialog(true)}
            style={{
              padding: "16px",
              borderRadius: 16,
              border: "2px solid rgba(196,98,45,0.3)",
              background: "rgba(196,98,45,0.06)",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--terracotta)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <AlertTriangle size={20} /> Emergency SOS
          </button>

          {!ended ? (
            <button
              className="auth-submit"
              onClick={handleEnd}
              disabled={endingRide}
              style={{
                background: "var(--forest)",
                boxShadow: "0 8px 24px rgba(45,74,53,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {endingRide ? "Completing..." : "End Ride"} <Check size={20} />
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn-primary"
                onClick={() => navigate("/driver/dashboard")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                Back to Dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showSosDialog}
        title="Send emergency SOS?"
        message="This will notify admins with your current ride and location details. Use it only for urgent safety issues."
        confirmLabel="Send SOS"
        danger
        busy={sendingSos}
        onCancel={() => setShowSosDialog(false)}
        onConfirm={handleSOS}
      />
    </AppShell>
  );
}
