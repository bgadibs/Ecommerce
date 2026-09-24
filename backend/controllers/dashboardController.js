const db = require("../config/db");

const getDashboardStats = (req, res) => {

    const queries = {
        products: "SELECT COUNT(*) AS count FROM products",
        orders: "SELECT COUNT(*) AS count FROM orders",
        users: "SELECT COUNT(*) AS count FROM users",
        admins: "SELECT COUNT(*) AS count FROM admins"
    };

    db.query(queries.products, (productErr, productResult) => {

        if (productErr) {
            console.error("Products count error:", productErr);
            return res.status(500).json({
                message: "Unable to get products count"
            });
        }

        db.query(queries.orders, (orderErr, orderResult) => {

            if (orderErr) {
                console.error("Orders count error:", orderErr);
                return res.status(500).json({
                    message: "Unable to get orders count"
                });
            }

            db.query(queries.users, (userErr, userResult) => {

                if (userErr) {
                    console.error("Users count error:", userErr);
                    return res.status(500).json({
                        message: "Unable to get users count"
                    });
                }

                db.query(queries.admins, (adminErr, adminResult) => {

                    if (adminErr) {
                        console.error("Admins count error:", adminErr);
                        return res.status(500).json({
                            message: "Unable to get admins count"
                        });
                    }

                    res.json({
                        products: productResult[0].count,
                        orders: orderResult[0].count,
                        users: userResult[0].count,
                        admins: adminResult[0].count
                    });

                });

            });

        });

    });
};

module.exports = {
    getDashboardStats
};