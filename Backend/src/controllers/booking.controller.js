import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";
import { Ride } from "../models/ride.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assertFiniteCoordinatePair,
  assertObjectId,
  parsePositiveInteger,
} from "../utils/validation.js";

/* ---------------------- HELPERS ---------------------- */

const validatePoint = (point) => {
  if (!point) return;
  assertFiniteCoordinatePair(point.coordinates, "pickup/drop coordinates");
};

const attachPaymentMetadata = async (bookings) => {
  if (!bookings.length) return [];

  const bookingIds = bookings.map((booking) => booking._id);
  const payments = await Payment.find({ booking: { $in: bookingIds } }).select(
    "booking paymentMethod transactionId providerOrderId paymentStatus paidAt amount",
  );

  const paymentMap = new Map(
    payments.map((payment) => [payment.booking.toString(), payment]),
  );

  return bookings.map((booking) => {
    const bookingObject =
      typeof booking.toObject === "function" ? booking.toObject() : booking;
    const payment = paymentMap.get(booking._id.toString());

    if (
      bookingObject.ride?.driver &&
      bookingObject.ride.driver.privacy?.showPhone === false
    ) {
      delete bookingObject.ride.driver.phone;
    }

    if (payment) {
      bookingObject.payment = {
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        providerOrderId: payment.providerOrderId,
        paymentStatus: payment.paymentStatus,
        paidAt: payment.paidAt,
        amount: payment.amount,
      };
    }

    return bookingObject;
  });
};

/* ---------------------- BOOK RIDE ---------------------- */

const bookRide = asyncHandler(async (req, res) => {
  const { rideId, seatsBooked, pickupPoint, dropPoint, passengerNote } = req.body;

  if (!rideId || !seatsBooked) {
    throw new ApiError(400, "Ride ID and seats booked are required");
  }

  assertObjectId(rideId, "ride ID");
  const normalizedSeatsBooked = parsePositiveInteger(seatsBooked, "Seats booked");

  validatePoint(pickupPoint);
  validatePoint(dropPoint);

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (["completed", "cancelled"].includes(ride.status)) {
    throw new ApiError(400, "Ride is not available for booking");
  }

  if (ride.driver.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Driver cannot book their own ride");
  }

  if (normalizedSeatsBooked > ride.totalSeats) {
    throw new ApiError(400, "Invalid seat request");
  }

  const existingBooking = await Booking.findOne({
    ride: rideId,
    passenger: req.user._id,
    bookingStatus: { $ne: "cancelled" },
  });

  if (existingBooking) {
    throw new ApiError(400, "You already have a booking for this ride");
  }

  /*
  Atomic seat reservation
  Prevents race conditions
  */
  const updatedRide = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      availableSeats: { $gte: normalizedSeatsBooked },
    },
    {
      $inc: { availableSeats: -normalizedSeatsBooked },
    },
    { new: true }
  );

  if (!updatedRide) {
    throw new ApiError(400, "Not enough available seats");
  }

  const totalPrice = updatedRide.pricePerSeat * normalizedSeatsBooked;
  const cancelledBooking = await Booking.findOne({
    ride: rideId,
    passenger: req.user._id,
    bookingStatus: "cancelled",
  });

  let booking;
  if (cancelledBooking) {
    cancelledBooking.seatsBooked = normalizedSeatsBooked;
    cancelledBooking.totalPrice = totalPrice;
    cancelledBooking.pickupPoint = pickupPoint;
    cancelledBooking.dropPoint = dropPoint;
    cancelledBooking.passengerNote =
      typeof passengerNote === "string" ? passengerNote.trim() : undefined;
    cancelledBooking.bookingStatus = "confirmed";
    cancelledBooking.paymentStatus = "unpaid";
    cancelledBooking.isPickedUp = false;
    booking = await cancelledBooking.save();
  } else {
    booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
      seatsBooked: normalizedSeatsBooked,
      totalPrice,
      pickupPoint,
      dropPoint,
      passengerNote:
        typeof passengerNote === "string" ? passengerNote.trim() : undefined,
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Ride booked successfully"));
});

/* ---------------------- MY BOOKINGS ---------------------- */

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ passenger: req.user._id })
    .populate({
      path: "ride",
      select: "from to departureTime status pricePerSeat driver vehicle",
      populate: [
        {
          path: "driver",
          select: "firstName lastName phone overallRating privacy.showPhone",
        },
        {
          path: "vehicle",
          select: "brand model color registrationNumber isVerified",
        },
      ],
    })
    .sort({ createdAt: -1 });

  const sanitizedBookings = await attachPaymentMetadata(bookings);

  return res
    .status(200)
    .json(new ApiResponse(200, sanitizedBookings, "Bookings fetched successfully"));
});

/* ---------------------- RIDE PASSENGERS ---------------------- */

const getRidePassengers = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  assertObjectId(rideId, "ride ID");

  const ride = await Ride.findOne({
    _id: rideId,
    driver: req.user._id,
  });

  if (!ride) {
    throw new ApiError(
      403,
      "You do not have permission to view passengers for this ride"
    );
  }

  const bookings = await Booking.find({
    ride: rideId,
    bookingStatus: { $ne: "cancelled" },
  }).populate(
    "passenger",
    "firstName lastName profilePhoto phone overallRating"
  );

  const bookingsWithPayments = await attachPaymentMetadata(bookings);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bookingsWithPayments,
        "Passengers fetched successfully",
      ),
    );
});

/* ---------------------- CANCEL BOOKING ---------------------- */

const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  assertObjectId(bookingId, "booking ID");

  const booking = await Booking.findOne({
    _id: bookingId,
    passenger: req.user._id,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(400, "Booking already cancelled");
  }

  if (booking.bookingStatus === "completed") {
    throw new ApiError(400, "Completed bookings cannot be cancelled");
  }

  const payment = await Payment.findOne({
    booking: booking._id,
    payer: req.user._id,
  }).session(null);

  if (payment?.paymentStatus === "success" || booking.paymentStatus === "paid") {
    throw new ApiError(
      400,
      "Paid bookings cannot be cancelled automatically yet. Please add refund handling first.",
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (payment) {
      payment.paymentStatus = "failed";
      payment.paidAt = undefined;
      payment.transactionId = undefined;
      payment.providerSignature = undefined;
      await payment.save({ validateBeforeSave: false, session });
    }

    booking.bookingStatus = "cancelled";
    booking.paymentStatus = "unpaid";
    await booking.save({ validateBeforeSave: false, session });

    await Ride.findByIdAndUpdate(booking.ride, {
      $inc: { availableSeats: booking.seatsBooked },
    }, { session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Booking cancelled successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export {
  bookRide,
  getMyBookings,
  getRidePassengers,
  cancelBooking,
};
