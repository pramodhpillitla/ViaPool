import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { Ride } from "../models/ride.model.js";
import { Booking } from "../models/booking.model.js";
import { logger } from "../utils/logger.js";
import { isOriginAllowed } from "../utils/cors.js";
import jwt from "jsonwebtoken";

const connectedUsers = new Map();

const setUserSocketConnected = (userId, socketId) => {
    if (!connectedUsers.has(userId)) {
        connectedUsers.set(userId, new Set());
    }

    connectedUsers.get(userId).add(socketId);
};

const setUserSocketDisconnected = (userId, socketId) => {
    const sockets = connectedUsers.get(userId);
    if (!sockets) return;

    sockets.delete(socketId);
    if (sockets.size === 0) {
        connectedUsers.delete(userId);
    }
};

const isUserOnline = (userId) => connectedUsers.has(userId);

const getRideAccess = async (rideId, userId) => {
    const ride = await Ride.findById(rideId).select("driver");
    if (!ride) return null;

    const userIdString = userId.toString();
    const driverId = ride.driver.toString();
    const passengerBooking = await Booking.findOne({
        ride: rideId,
        passenger: userId,
        bookingStatus: { $in: ["confirmed", "completed"] },
    }).select("_id");

    return {
        ride,
        isDriver: driverId === userIdString,
        isPassenger: Boolean(passengerBooking),
    };
};

const canMessageOnRide = async (rideId, senderId, receiverId) => {
    const [senderAccess, receiverAccess] = await Promise.all([
        getRideAccess(rideId, senderId),
        getRideAccess(rideId, receiverId),
    ]);

    if (!senderAccess || !receiverAccess) {
        return false;
    }

    return (
        (senderAccess.isDriver && receiverAccess.isPassenger) ||
        (receiverAccess.isDriver && senderAccess.isPassenger)
    );
};

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (isOriginAllowed(origin)) {
                    callback(null, true);
                    return;
                }

                callback(new Error(`Origin ${origin} not allowed by Socket.IO CORS`));
            },
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");

            if (!token && socket.handshake.headers.cookie) {
                const cookieStr = socket.handshake.headers.cookie;
                const match = cookieStr.match(/accessToken=([^;]+)/);
                if (match) token = match[1];
            }

            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded?._id).select("-password -refreshToken");

            if (!user || user.isBlocked) {
                return next(new Error("Authentication error: Invalid or blocked user"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error: " + err.message));
        }
    });

    io.on("connection", (socket) => {
        const currentUserId = socket.user._id.toString();
        setUserSocketConnected(currentUserId, socket.id);
        io.to(`presence_watch_${currentUserId}`).emit("user-presence", {
            userId: currentUserId,
            online: true,
        });
        logger.info("Socket client connected", { userId: currentUserId, socketId: socket.id });

        // User joining their personal room for notifications
        socket.on("join-user-room", (userId) => {
            if (userId !== socket.user._id.toString()) {
                logger.warn("User attempted to join a different personal room", {
                    userId: socket.user._id.toString(),
                    requestedRoomUserId: userId,
                });
                return;
            }
            socket.join(`user_${userId}`);
            logger.debug("User joined personal room", { userId });
        });

        socket.on("watch-user", (userId) => {
            if (!userId) return;
            socket.join(`presence_watch_${userId}`);
            socket.emit("user-presence", {
                userId,
                online: isUserOnline(userId),
            });
        });

        // Driver joining a ride room to broadcast location
        socket.on("join-ride-room", async (rideId) => {
            const access = await getRideAccess(rideId, socket.user._id);
            if (!access || (!access.isDriver && !access.isPassenger)) {
                return;
            }

            socket.join(`ride_${rideId}`);
            logger.debug("User joined ride room", { userId: currentUserId, rideId });
        });

        // Driver sending location updates
        socket.on("location-update", async (data) => {
            if (socket.user.role !== "driver") return;
            const { rideId, lat, lng } = data;
            const access = await getRideAccess(rideId, socket.user._id);
            if (!access?.isDriver) return;
            io.to(`ride_${rideId}`).emit("driver-location", { lat, lng });
        });

        socket.on("passenger-location-update", async (data) => {
            if (socket.user.role !== "passenger") return;
            const { rideId, lat, lng } = data;
            const access = await getRideAccess(rideId, socket.user._id);
            if (!access?.isPassenger) return;
            io.to(`ride_${rideId}`).emit("passenger-location", {
                userId: currentUserId,
                lat,
                lng,
            });
        });

        // Messaging between driver and passenger
        socket.on("send-message", async (data) => {
            const { rideId, senderId, receiverId, message } = data;

            if (senderId !== socket.user._id.toString()) return; // Must send as self
            if (typeof message !== "string" || !message.trim()) return;

            try {
                const allowed = await canMessageOnRide(rideId, senderId, receiverId);
                if (!allowed) return;

                // Save to DB
                const newMessage = await Message.create({
                    ride: rideId,
                    sender: senderId,
                    receiver: receiverId,
                    message: message.trim()
                });

                const populatedMessage = await Message.findById(newMessage._id).lean();
                const sender = await User.findById(senderId).select("firstName lastName").lean();

                const notification = await Notification.create({
                    user: receiverId,
                    type: "new_message",
                    message: `New message from ${sender?.firstName || "ViaPool user"}`,
                    relatedId: newMessage._id,
                });

                // Emit to both sender and receiver personal rooms so every active chat stays in sync
                io.to(`user_${receiverId}`).emit("receive-message", populatedMessage);
                io.to(`user_${senderId}`).emit("receive-message", populatedMessage);
                io.to(`user_${receiverId}`).emit("notification:new", notification.toObject());
            } catch (error) {
                logger.error("Error saving socket message", error);
            }
        });

        socket.on("typing-start", async ({ rideId, receiverId, senderId }) => {
            if (senderId !== currentUserId || !receiverId) return;
            const allowed = await canMessageOnRide(rideId, senderId, receiverId);
            if (!allowed) return;
            io.to(`user_${receiverId}`).emit("typing-status", {
                rideId,
                senderId,
                isTyping: true,
            });
        });

        socket.on("typing-stop", async ({ rideId, receiverId, senderId }) => {
            if (senderId !== currentUserId || !receiverId) return;
            const allowed = await canMessageOnRide(rideId, senderId, receiverId);
            if (!allowed) return;
            io.to(`user_${receiverId}`).emit("typing-status", {
                rideId,
                senderId,
                isTyping: false,
            });
        });

        socket.on("disconnect", () => {
            setUserSocketDisconnected(currentUserId, socket.id);
            if (!isUserOnline(currentUserId)) {
                io.to(`presence_watch_${currentUserId}`).emit("user-presence", {
                    userId: currentUserId,
                    online: false,
                });
            }
            logger.debug("Socket client disconnected", { userId: currentUserId, socketId: socket.id });
        });
    });

    return io;
};
