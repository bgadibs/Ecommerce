const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================
// GET CART
// =====================================
router.get(
    "/",
    authMiddleware,
    getCart
);

// =====================================
// ADD TO CART
// =====================================
router.post(
    "/",
    authMiddleware,
    addToCart
);

// =====================================
// UPDATE CART QUANTITY
// =====================================
router.put(
    "/:productId",
    authMiddleware,
    updateCart
);

// =====================================
// REMOVE FROM CART
// =====================================
router.delete(
    "/:productId",
    authMiddleware,
    removeFromCart
);

module.exports = router;