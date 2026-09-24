const db = require("../config/db");


// ==========================================
// CREATE ORDER / CHECKOUT
// ==========================================
const createOrder = (req, res) => {

    const userId = req.user.id;

    const {
        address,
        city,
        state,
        pincode,
        payment_method
    } = req.body;

    // Validate address
    if (!address || !city || !state || !pincode) {
        return res.status(400).json({
            message: "Complete delivery address is required"
        });
    }

    const paymentMethod = payment_method || "COD";

    // Start transaction
    db.beginTransaction((transactionError) => {

        if (transactionError) {
            console.error(transactionError);

            return res.status(500).json({
                message: "Unable to start order transaction"
            });
        }


        // Get user's cart
        const cartSql = `
            SELECT
                cart.product_id,
                cart.quantity,
                products.name,
                products.price,
                products.discount,
                products.stock
            FROM cart
            INNER JOIN products
                ON cart.product_id = products.id
            WHERE cart.user_id = ?
            FOR UPDATE
        `;

        db.query(
            cartSql,
            [userId],
            (cartError, cartItems) => {

                if (cartError) {

                    return db.rollback(() => {

                        console.error(cartError);

                        res.status(500).json({
                            message: "Unable to get cart"
                        });

                    });

                }


                // Empty cart
                if (cartItems.length === 0) {

                    return db.rollback(() => {

                        res.status(400).json({
                            message: "Your cart is empty"
                        });

                    });

                }


                // Check stock
                for (const item of cartItems) {

                    if (item.stock < item.quantity) {

                        return db.rollback(() => {

                            res.status(400).json({
                                message:
                                    `${item.name} has only ${item.stock} item(s) available`
                            });

                        });

                    }

                }


                // Calculate total
                let totalAmount = 0;

                cartItems.forEach((item) => {

                    const discount =
                        Number(item.discount || 0);

                    const finalPrice =
                        Number(item.price) -
                        (
                            Number(item.price) *
                            discount /
                            100
                        );

                    totalAmount +=
                        finalPrice * item.quantity;

                });


                // Create order
                const orderSql = `
                    INSERT INTO orders
                    (
                        user_id,
                        total_amount,
                        status,
                        address,
                        city,
                        state,
                        pincode,
                        payment_method
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    orderSql,
                    [
                        userId,
                        totalAmount,
                        "Pending",
                        address,
                        city,
                        state,
                        pincode,
                        paymentMethod
                    ],
                    (orderError, orderResult) => {

                        if (orderError) {

                            return db.rollback(() => {

                                console.error(orderError);

                                res.status(500).json({
                                    message:
                                        "Unable to create order"
                                });

                            });

                        }


                        const orderId =
                            orderResult.insertId;


                        // Insert order items one by one
                        let completedItems = 0;

                        cartItems.forEach((item) => {

                            const discount =
                                Number(item.discount || 0);

                            const finalPrice =
                                Number(item.price) -
                                (
                                    Number(item.price) *
                                    discount /
                                    100
                                );


                            // Insert order item
                            const itemSql = `
                                INSERT INTO order_items
                                (
                                    order_id,
                                    product_id,
                                    quantity,
                                    price
                                )
                                VALUES (?, ?, ?, ?)
                            `;

                            db.query(
                                itemSql,
                                [
                                    orderId,
                                    item.product_id,
                                    item.quantity,
                                    finalPrice
                                ],
                                (itemError) => {

                                    if (itemError) {

                                        return db.rollback(() => {

                                            console.error(itemError);

                                            res.status(500).json({
                                                message:
                                                    "Unable to create order items"
                                            });

                                        });

                                    }


                                    // Reduce stock
                                    const stockSql = `
                                        UPDATE products
                                        SET stock = stock - ?
                                        WHERE id = ?
                                        AND stock >= ?
                                    `;

                                    db.query(
                                        stockSql,
                                        [
                                            item.quantity,
                                            item.product_id,
                                            item.quantity
                                        ],
                                        (stockError, stockResult) => {

                                            if (stockError) {

                                                return db.rollback(() => {

                                                    console.error(stockError);

                                                    res.status(500).json({
                                                        message:
                                                            "Unable to update stock"
                                                    });

                                                });

                                            }


                                            if (
                                                stockResult.affectedRows === 0
                                            ) {

                                                return db.rollback(() => {

                                                    res.status(400).json({
                                                        message:
                                                            `Insufficient stock for ${item.name}`
                                                    });

                                                });

                                            }


                                            completedItems++;


                                            // All items completed
                                            if (
                                                completedItems ===
                                                cartItems.length
                                            ) {

                                                // Clear cart
                                                const clearCartSql = `
                                                    DELETE FROM cart
                                                    WHERE user_id = ?
                                                `;

                                                db.query(
                                                    clearCartSql,
                                                    [userId],
                                                    (clearError) => {

                                                        if (clearError) {

                                                            return db.rollback(() => {

                                                                console.error(clearError);

                                                                res.status(500).json({
                                                                    message:
                                                                        "Unable to clear cart"
                                                                });

                                                            });

                                                        }


                                                        // Commit transaction
                                                        db.commit(
                                                            (commitError) => {

                                                                if (commitError) {

                                                                    return db.rollback(() => {

                                                                        console.error(commitError);

                                                                        res.status(500).json({
                                                                            message:
                                                                                "Unable to complete order"
                                                                        });

                                                                    });

                                                                }


                                                                res.status(201).json({

                                                                    message:
                                                                        "Order placed successfully",

                                                                    orderId:
                                                                        orderId,

                                                                    totalAmount:
                                                                        Number(
                                                                            totalAmount.toFixed(2)
                                                                        )

                                                                });

                                                            }
                                                        );

                                                    }
                                                );

                                            }

                                        }
                                    );

                                }
                            );

                        });

                    }
                );

            }
        );

    });

};


// ==========================================
// GET MY ORDERS
// ==========================================
const getMyOrders = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            total_amount,
            status,
            address,
            city,
            state,
            pincode,
            payment_method,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Unable to get orders"
                });

            }

            res.json(results);

        }
    );

};


// ==========================================
// GET ORDER DETAILS
// ==========================================
const getOrderDetails = (req, res) => {

    const userId = req.user.id;
    const orderId = req.params.orderId;


    const orderSql = `
        SELECT
            id,
            total_amount,
            status,
            address,
            city,
            state,
            pincode,
            payment_method,
            created_at
        FROM orders
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        orderSql,
        [orderId, userId],
        (orderError, orders) => {

            if (orderError) {

                console.error(orderError);

                return res.status(500).json({
                    message: "Unable to get order"
                });

            }


            if (orders.length === 0) {

                return res.status(404).json({
                    message: "Order not found"
                });

            }


            const itemsSql = `
                SELECT
                    order_items.id,
                    order_items.product_id,
                    order_items.quantity,
                    order_items.price,
                    products.name,
                    products.image
                FROM order_items
                INNER JOIN products
                    ON order_items.product_id = products.id
                WHERE order_items.order_id = ?
            `;


            db.query(
                itemsSql,
                [orderId],
                (itemsError, items) => {

                    if (itemsError) {

                        console.error(itemsError);

                        return res.status(500).json({
                            message:
                                "Unable to get order items"
                        });

                    }


                    res.json({
                        order: orders[0],
                        items: items
                    });

                }
            );

        }
    );

};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderDetails
};