const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const superAdminMiddleware =
    require("../middleware/superAdminMiddleware");

const {
    getDashboardStats,
    getAdmins,
    deleteAdmin
} = require("../controllers/superAdminController");


// =====================================
// SUPER ADMIN PROTECTION
// =====================================

router.use(authMiddleware);
router.use(superAdminMiddleware);


// =====================================
// DASHBOARD
// =====================================

router.get(
    "/dashboard",
    getDashboardStats
);


// =====================================
// ADMIN MANAGEMENT
// =====================================

router.get(
    "/admins",
    getAdmins
);

router.delete(
    "/admins/:id",
    deleteAdmin
);


module.exports = router;