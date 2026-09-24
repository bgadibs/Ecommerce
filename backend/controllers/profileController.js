const db = require("../config/db");

// =====================================
// GET USER PROFILE
// =====================================

const getProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            address
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.error("Get profile error:", err);

            return res.status(500).json({
                message: "Failed to get profile"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);
    });
};


// =====================================
// UPDATE USER PROFILE
// =====================================

const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {
        name,
        phone,
        address
    } = req.body;


    if (!name || !phone || !address) {

        return res.status(400).json({
            message: "Name, phone and address are required"
        });
    }


    const sql = `
        UPDATE users
        SET
            name = ?,
            phone = ?,
            address = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            phone,
            address,
            userId
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Update profile error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to update profile"
                });
            }


            res.json({
                message: "Profile updated successfully"
            });

        }
    );

};


module.exports = {
    getProfile,
    updateProfile
};