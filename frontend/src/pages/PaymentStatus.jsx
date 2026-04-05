import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { logger } from "../lib/logger";
import AppShell from "../components/AppShell";
import "../pages/AppShell.css";
import "../pages/Passenger.css";

export default function PaymentStatus() {
  const { bookingId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const success = params.get("success") !== "false";
  const paymentId = params.get("paymentId");
  const paymentMethod = params.get("method");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get("/api/v1/bookings/my-bookings");
        const found = (res.data || []).find((item) => item._id === bookingId);

        if (found) {
          setBooking(found);
        }
      } catch (err) {
        logger.error("Failed to load booking status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const departure = booking?.ride?.departureTime
    ? new Date(booking.ride.departureTime)
    : null;
  const backendPaymentMethod = booking?.payment?.paymentMethod;
  const backendPaymentStatus = booking?.payment?.paymentStatus;
  const isCashBooking = backendPaymentMethod === "cash" || paymentMethod === "cod";
  const receiptPaymentStatus = isCashBooking
    ? backendPaymentStatus === "pending"
      ? "Pay at pickup"
      : "Cash selected"
    : booking?.paymentStatus || "unpaid";
  const heading = success
    ? isCashBooking
      ? "Booking Reserved"
      : "Booking Confirmed"
    : "Payment Failed";

  return (
    <AppShell title={heading} role="passenger">
      <div className="status-card">
        {loading ? (
          <div className="auth-spinner" style={{ margin: "40px auto" }} />
        ) : success ? (
          <>
            <div className="status-icon success">
              {isCashBooking ? "Reserved" : "Confirmed"}
            </div>
            <div className="status-title">
              {isCashBooking ? "Seat Reserved!" : "Booking Confirmed!"}
            </div>
            <div className="status-sub">
              Your ride from{" "}
              <strong>{booking?.ride?.from?.address?.split(",")[0] || "Unknown"}</strong>{" "}
              to <strong>{booking?.ride?.to?.address?.split(",")[0] || "Unknown"}</strong>{" "}
              has been {isCashBooking ? "reserved" : "confirmed"}.
            </div>
          </>
        ) : (
          <>
            <div className="status-icon failure">Failed</div>
            <div className="status-title">Payment Failed</div>
            <div className="status-sub">
              Something went wrong with your payment. Your booking is still unpaid.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
              <button className="btn-secondary" onClick={() => navigate(-1)}>
                Try Again
              </button>
              <button className="btn-outline" onClick={() => navigate("/passenger/bookings")}>
                My Bookings
              </button>
            </div>
          </>
        )}

        {success && booking && (
          <>
            <div
              style={{
                background: "var(--cream)",
                border: "1px solid var(--sand)",
                borderRadius: 16,
                padding: "20px 22px",
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1rem",
                  color: "var(--ink)",
                  marginBottom: 14,
                  letterSpacing: "-0.02em",
                }}
              >
                Receipt
              </div>
              {[
                { label: "Booking ID", val: booking._id },
                {
                  label: isCashBooking ? "Payment Mode" : "Transaction",
                  val: isCashBooking ? "Cash to Driver" : paymentId || "Captured",
                },
                {
                  label: "Route",
                  val: `${booking.ride?.from?.address?.split(",")[0] || "Unknown"} -> ${booking.ride?.to?.address?.split(",")[0] || "Unknown"}`,
                },
                {
                  label: "Date & Time",
                  val: departure
                    ? `${departure.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} - ${departure.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Unknown",
                },
                { label: "Seats", val: booking.seatsBooked },
                {
                  label: "Driver",
                  val: booking.ride?.driver
                    ? `${booking.ride.driver.firstName} ${booking.ride.driver.lastName}`
                    : "Unknown",
                },
                {
                  label: "Ride fare",
                  val: `Rs.${booking.totalPrice || 0}`,
                },
                {
                  label: "Payment status",
                  val: receiptPaymentStatus,
                },
              ].map((row) => (
                <div key={row.label} className="receipt-row">
                  <span>{row.label}</span>
                  <span>{row.val}</span>
                </div>
              ))}
              <div
                className="receipt-row"
                style={{
                  marginTop: 4,
                  paddingTop: 12,
                  borderTop: "1px dashed var(--sand)",
                  borderBottom: "none",
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "var(--ink)" }}>
                  {isCashBooking ? "Amount Due" : "Total Paid"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.2rem",
                    color: "var(--ink)",
                  }}
                >
                  Rs.{booking.totalPrice || 0}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {booking.ride?._id ? (
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/rides/${booking.ride._id}/track`)}
                >
                  Track Ride
                </button>
              ) : null}
              <button className="btn-secondary" onClick={() => navigate("/passenger/bookings")}>
                My Bookings
              </button>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: "14px 18px",
                background: "rgba(45,74,53,0.06)",
                borderRadius: 12,
                border: "1px solid rgba(45,74,53,0.15)",
                fontSize: "0.82rem",
                color: "var(--mist)",
                lineHeight: 1.6,
              }}
            >
              {isCashBooking
                ? "Bring the exact amount if possible. Your driver will collect the fare before the ride starts."
                : "Your payment has been verified and the booking is ready for travel."}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
