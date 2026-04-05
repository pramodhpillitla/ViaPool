import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    assertObjectId,
    normalizePaymentMethod,
    parseNonNegativeNumber,
    requirePaymentMethod,
} from "../utils/validation.js";

const initializeRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new ApiError(500, "Razorpay is not configured on the server");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

const getOwnedBookingForPayment = async (bookingId, passengerId) => {
    const booking = await Booking.findOne({ _id: bookingId, passenger: passengerId });

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.bookingStatus === "cancelled") {
        throw new ApiError(400, "Cancelled bookings cannot be paid");
    }

    if (booking.bookingStatus === "completed") {
        throw new ApiError(400, "Completed bookings cannot start a new payment");
    }

    return booking;
};

const createOrder = asyncHandler(async (req, res) => {
    const { bookingId, paymentMethod } = req.body;
    assertObjectId(bookingId, "booking ID");
    const normalizedPaymentMethod = requirePaymentMethod(paymentMethod);

    if (normalizedPaymentMethod === "cash") {
        throw new ApiError(400, "Cash payments do not require an online order");
    }

    const booking = await getOwnedBookingForPayment(bookingId, req.user._id);

    if (booking.paymentStatus === "paid") {
        throw new ApiError(400, "Booking is already paid");
    }

    const normalizedAmount = parseNonNegativeNumber(booking.totalPrice, "booking amount");
    if (normalizedAmount === 0) {
        throw new ApiError(400, "Booking amount must be greater than zero");
    }

    const instance = initializeRazorpay();

    const options = {
        amount: normalizedAmount * 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${booking._id}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
        throw new ApiError(500, "Error creating Razorpay order");
    }

    await Payment.findOneAndUpdate(
        { booking: booking._id },
        {
            payer: req.user._id,
            amount: normalizedAmount,
            currency: "INR",
            paymentStatus: "pending",
            paymentMethod: normalizedPaymentMethod,
            providerOrderId: order.id,
            providerSignature: undefined,
            transactionId: undefined,
            paidAt: undefined,
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        },
    );

    res.status(200).json(
        new ApiResponse(
            200,
            {
                ...order,
                keyId: process.env.RAZORPAY_KEY_ID
            },
            "Order created successfully"
        )
    );
});

const confirmCashPayment = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    assertObjectId(bookingId, "booking ID");

    const booking = await getOwnedBookingForPayment(bookingId, req.user._id);

    if (booking.paymentStatus === "paid") {
        throw new ApiError(400, "Booking is already paid");
    }

    const normalizedAmount = parseNonNegativeNumber(booking.totalPrice, "booking amount");
    if (normalizedAmount === 0) {
        throw new ApiError(400, "Booking amount must be greater than zero");
    }

    const payment = await Payment.findOneAndUpdate(
        { booking: booking._id },
        {
            payer: req.user._id,
            amount: normalizedAmount,
            currency: "INR",
            paymentMethod: "cash",
            paymentStatus: "pending",
            providerOrderId: undefined,
            providerSignature: undefined,
            transactionId: undefined,
            paidAt: undefined,
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        },
    );

    booking.paymentStatus = "unpaid";
    await booking.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookingId: booking._id,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
            },
            "Cash payment reservation confirmed",
        ),
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
        paymentMethod,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
        throw new ApiError(400, "Incomplete payment verification payload");
    }

    assertObjectId(bookingId, "booking ID");

    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new ApiError(500, "Razorpay is not configured on the server");
    }

    const normalizedPaymentMethod = paymentMethod == null
        ? undefined
        : requirePaymentMethod(paymentMethod);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);
    const isAuthentic =
        expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isAuthentic) {
        throw new ApiError(400, "Invalid payment signature");
    }

    const booking = await Booking.findOne({ _id: bookingId, passenger: req.user._id });
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.bookingStatus === "cancelled") {
        throw new ApiError(400, "Cancelled bookings cannot be verified for payment");
    }

    const payment = await Payment.findOne({ booking: bookingId, payer: req.user._id });
    if (!payment) {
        throw new ApiError(400, "Payment order was not initialized for this booking");
    }

    if (payment.paymentStatus === "success") {
        if (payment.transactionId === razorpay_payment_id) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        verified: true,
                        paymentId: payment.transactionId,
                    },
                    "Payment already verified",
                ),
            );
        }

        throw new ApiError(400, "This payment has already been verified");
    }

    if (payment.providerOrderId !== razorpay_order_id) {
        throw new ApiError(400, "Payment order does not match this booking");
    }

    if (payment.amount !== parseNonNegativeNumber(booking.totalPrice, "booking amount")) {
        throw new ApiError(400, "Payment amount mismatch");
    }

    payment.transactionId = razorpay_payment_id;
    payment.providerSignature = razorpay_signature;
    payment.paymentStatus = "success";
    payment.paymentMethod = normalizedPaymentMethod || payment.paymentMethod;
    payment.paidAt = new Date();
    await payment.save();

    booking.paymentStatus = "paid";
    await booking.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                verified: true,
                paymentId: payment.transactionId,
            },
            "Payment verified successfully",
        ),
    );
});

export {
    createOrder,
    confirmCashPayment,
    verifyPayment
};
