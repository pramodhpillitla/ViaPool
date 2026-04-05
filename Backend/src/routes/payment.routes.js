import { Router } from "express";
import { confirmCashPayment, createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-order").post(createOrder);
router.route("/confirm-cash").post(confirmCashPayment);
router.route("/verify").post(verifyPayment);

export default router;
