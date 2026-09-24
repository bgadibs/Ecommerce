const express = require("express");

const router = express.Router();

const {
    getUsers,
    searchUsers,
    deleteUser
} = require("../controllers/userController");


// =====================================
// SEARCH USERS
// =====================================

router.get("/search", searchUsers);


// =====================================
// GET ALL USERS
// =====================================

router.get("/", getUsers);


// =====================================
// DELETE USER
// =====================================

router.delete("/:id", deleteUser);


module.exports = router;