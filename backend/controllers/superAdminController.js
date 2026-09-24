const db = require("../config/db");


// =====================================
// SUPER ADMIN DASHBOARD
// =====================================

const getDashboardStats = (req, res) => {

    const queries = {

        products:
            "SELECT COUNT(*) AS count FROM products",

        users:
            "SELECT COUNT(*) AS count FROM users",

        orders:
            "SELECT COUNT(*) AS count FROM orders",

        admins:
            "SELECT COUNT(*) AS count FROM admins"

    };

    db.query(
        queries.products,
        (err, productResult) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Unable to get dashboard data"
                });
            }

            db.query(
                queries.users,
                (err, userResult) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: "Unable to get dashboard data"
                        });
                    }

                    db.query(
                        queries.orders,
                        (err, orderResult) => {

                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    message: "Unable to get dashboard data"
                                });
                            }

                            db.query(
                                queries.admins,
                                (err, adminResult) => {

                                    if (err) {
                                        console.error(err);
                                        return res.status(500).json({
                                            message: "Unable to get dashboard data"
                                        });
                                    }

                                    res.json({

                                        products:
                                            productResult[0].count,

                                        users:
                                            userResult[0].count,

                                        orders:
                                            orderResult[0].count,

                                        admins:
                                            adminResult[0].count

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );
};


// =====================================
// GET ADMINS
// =====================================

const getAdmins = (req, res) => {

    const sql = `
        SELECT id, name, email, role
        FROM admins
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Unable to get admins"
            });

        }

        res.json(results);

    });
};


// =====================================
// DELETE ADMIN
// =====================================

const deleteAdmin = (req, res) => {

    const { id } = req.params;

    if (Number(id) === Number(req.user.id)) {

        return res.status(400).json({
            message: "You cannot delete your own account"
        });

    }

    const sql = `
        DELETE FROM admins
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Unable to delete admin"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Admin not found"
            });

        }

        res.json({
            message: "Admin deleted successfully"
        });

    });
};


module.exports = {
    getDashboardStats,
    getAdmins,
    deleteAdmin
};