const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderDetails
} = require("../controllers/orderController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Checkout / Create order
router.post(
    "/",
    authMiddleware,
    createOrder
);


// Get logged-in user's orders
router.get(
    "/",
    authMiddleware,
    getMyOrders
);


// Get one order
router.get(
    "/:orderId",
    authMiddleware,
    getOrderDetails
);


module.exports = router;