const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");


// =====================================
// GET PROFILE
// =====================================

router.get(
    "/",
    authMiddleware,
    getProfile
);


// =====================================
// UPDATE PROFILE
// =====================================

router.put(
    "/",
    authMiddleware,
    updateProfile
);


module.exports = router;