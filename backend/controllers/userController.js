const db = require("../config/db");


// =====================================
// GET ALL USERS
// =====================================

exports.getUsers = (req, res) => {

    const sql = `
        SELECT id, name, email
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get users error:", err);

            return res.status(500).json({
                message: "Unable to fetch users"
            });
        }

        res.json(results);
    });
};


// =====================================
// SEARCH USERS
// =====================================

exports.searchUsers = (req, res) => {

    const search = req.query.q || "";

    const value = `%${search}%`;

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE name LIKE ?
           OR email LIKE ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [value, value],
        (err, results) => {

            if (err) {

                console.error("Search users error:", err);

                return res.status(500).json({
                    message: "Unable to search users"
                });
            }

            res.json(results);
        }
    );
};


// =====================================
// DELETE USER
// =====================================

exports.deleteUser = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error("Delete user error:", err);

                return res.status(500).json({
                    message: "Unable to delete user"
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "User deleted successfully"
            });
        }
    );
};