import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { logger } from "../lib/logger";
import AppShell from "../components/AppShell";
import "../pages/AppShell.css";
import "../pages/Passenger.css";

const METHODS = [
  { id: "upi", icon: "UPI", name: "UPI", sub: "Razorpay will show UPI if it is enabled for this account and device" },
  { id: "card", icon: "CARD", name: "Cards", sub: "Razorpay checkout handles card entry" },
  { id: "nb", icon: "BANK", name: "Net Banking", sub: "Razorpay checkout shows enabled banks" },
  { id: "cod", icon: "CASH", name: "Cash to Driver", sub: "Pay directly before the ride starts" },
];

const buildRazorpayMethodConfig = (selectedMethod) => {
  if (selectedMethod === "upi") {
    // Do not hard-lock UPI in web/test sessions; Razorpay may have no eligible UPI method
    // and can show "No appropriate payment method found".
    return undefined;
  }

  if (selectedMethod === "card") {
    return {
      upi: false,
      card: true,
      netbanking: false,
      wallet: false,
      paylater: false,
      emi: false,
    };
  }

  if (selectedMethod === "nb") {
    return {
      upi: false,
      card: false,
      netbanking: true,
      wallet: false,
      paylater: false,
      emi: false,
    };
  }

  return undefined;
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get("/api/v1/bookings/my-bookings");
        const foundBooking = res.data.find((item) => item._id === bookingId);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      } catch (err) {
        logger.error("Failed to load booking", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePay = async () => {
    setError("");

    if (method === "cod") {
      setProcessing(true);
      try {
        await api.post("/api/v1/payments/confirm-cash", { bookingId });
        navigate(`/bookings/${bookingId}/payment/status?success=true&method=cod`);
      } catch (err) {
        setError(err?.body?.message || err.message || "Unable to reserve cash payment.");
        setProcessing(false);
      }
      return;
    }

    setProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Check your internet connection and try again.");
      }

      const orderRes = await api.post("/api/v1/payments/create-order", {
        bookingId,
        paymentMethod: method,
      });
      const orderData = orderRes.data;
      const checkoutKey = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!checkoutKey) {
        throw new Error("Razorpay key is missing. Configure the payment key and try again.");
      }

      if (!orderData?.id || !orderData?.amount) {
        throw new Error("Razorpay order creation failed. Missing order details.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable in this browser.");
      }

      const options = {
        key: checkoutKey,
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.id,
        name: "ViaPool",
        description: `Booking ${bookingId.slice(-6).toUpperCase()}`,
        prefill: {
          name: booking?.passenger?.firstName
            ? `${booking.passenger.firstName} ${booking.passenger.lastName || ""}`.trim()
            : undefined,
          email: booking?.passenger?.email,
          contact: booking?.passenger?.phone,
        },
        notes: {
          bookingId,
          selectedMethod: method,
        },
        ...(buildRazorpayMethodConfig(method) ? { method: buildRazorpayMethodConfig(method) } : {}),
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError("Payment window was closed before completion.");
          },
        },
        theme: { color: "#C4622D" },
        handler: async (response) => {
          try {
            await api.post("/api/v1/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
              paymentMethod: method,
            });
            navigate(
              `/bookings/${bookingId}/payment/status?success=true&paymentId=${encodeURIComponent(response.razorpay_payment_id)}&method=${encodeURIComponent(method)}`,
            );
          } catch {
            navigate(`/bookings/${bookingId}/payment/status?success=false`);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        const message =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed. Please try again.";
        setError(message);
        setProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      setError(err?.body?.message || err.message || "Unable to start payment.");
      setProcessing(false);
    }
  };

  if (loading && !booking) {
    return (
      <AppShell title="Payment" role="passenger">
        <div className="auth-spinner" style={{ margin: "40px auto" }} />
      </AppShell>
    );
  }

  if (!booking) {
    return (
      <AppShell title="Not Found" role="passenger">
        <div style={{ padding: 40, textAlign: "center" }}>Booking unavailable</div>
      </AppShell>
    );
  }

  const rideDate = new Date(booking.ride?.departureTime);

  return (
    <AppShell title="Payment" role="passenger" unreadCount={2}>
      <div className="page-header">
        <div className="page-header-eyebrow">Step 2 of 2</div>
        <h1 className="page-header-title">
          Razorpay <em>Checkout</em>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div>
          <div className="payment-card">
            <div className="info-card-title">Payment Method</div>
            {error && (
              <div
                style={{
                  color: "var(--terracotta)",
                  marginBottom: 12,
                  fontSize: "0.85rem",
                  padding: "10px 12px",
                  background: "rgba(196,98,45,0.1)",
                  borderRadius: 8,
                }}
              >
                {error}
              </div>
            )}

            {METHODS.map((item) => (
              <div
                key={item.id}
                className={`payment-method-row ${method === item.id ? "selected" : ""}`}
                onClick={() => setMethod(item.id)}
              >
                <div className="pm-icon">{item.icon}</div>
                <div className="pm-label">
                  <div className="pm-name">{item.name}</div>
                  <div className="pm-sub">{item.sub}</div>
                </div>
                <div className={`pm-radio ${method === item.id ? "checked" : ""}`} />
              </div>
            ))}
          </div>

          <div className="payment-card">
            <div className="info-card-title">Checkout Note</div>
            <p style={{ fontSize: "0.82rem", color: "var(--mist)", lineHeight: 1.7 }}>
              Razorpay is still being opened from the backend-generated test-mode order, so your current Razorpay sandbox setup keeps working. Cash reservations are now stored on the backend instead of only redirecting the UI.
            </p>
          </div>

          <div className="rzp-banner">
            <span>Secured by</span>
            <span className="rzp-logo">Razorpay</span>
            <span>Live checkout config from backend</span>
          </div>
        </div>

        <div>
          <div className="info-card" style={{ position: "sticky", top: 88 }}>
            <div className="info-card-title">Order Summary</div>
            <div style={{ background: "var(--ink)", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginBottom: 8 }}>Route</div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.05rem",
                  color: "var(--cream)",
                  letterSpacing: "-0.02em",
                }}
              >
                {booking.ride?.from?.address?.split(",")[0] || "Unknown"} to {booking.ride?.to?.address?.split(",")[0] || "Unknown"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginTop: 6 }}>
                {rideDate.toLocaleDateString()} - {rideDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {booking.seatsBooked} seats
              </div>
            </div>

            <div className="fare-row total" style={{ border: "none" }}>
              <span>Total amount</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem" }}>Rs.{booking.totalPrice}</span>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: 20, padding: "16px" }}
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? "Opening Razorpay..." : method === "cod" ? "Confirm Cash Payment" : "Proceed to Razorpay"}
            </button>

            <p style={{ fontSize: "0.72rem", color: "var(--mist)", textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>
              Online payment methods are shown directly by Razorpay checkout.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
