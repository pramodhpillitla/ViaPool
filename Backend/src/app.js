import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getAllowedOrigins, isOriginAllowed } from "./utils/cors.js";

const app = express();

app.use(
    cors({
        origin(origin, callback) {
            if (isOriginAllowed(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        optionsSuccessStatus: 200
    })
);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (isOriginAllowed(origin)) {
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import authRouter from './routes/auth.routes.js';
import rideRouter from './routes/ride.routes.js';
import bookingRouter from './routes/booking.routes.js';
import paymentRouter from './routes/payment.routes.js';
import mapRouter from './routes/map.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import messageRouter from './routes/message.routes.js';
import reviewRouter from './routes/review.routes.js';
import userRouter from './routes/user.routes.js';
import earningsRouter from './routes/earnings.routes.js';
import notificationRouter from './routes/notification.routes.js';
import sosRouter from './routes/sos.routes.js';

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ViaPool backend is healthy",
        allowedOrigins: getAllowedOrigins(),
    });
});

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rides", rideRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/maps", mapRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/earnings", earningsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/sos", sosRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || []
    });
});

export { app }
