const db = require("../config/db");


// =====================================
// ADD PRODUCT TO CART
// =====================================

const addToCart = (req, res) => {

    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id) {

        return res.status(400).json({
            message: "Product ID is required"
        });

    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {

        return res.status(400).json({
            message: "Quantity must be at least 1"
        });

    }

    const checkSql = `
        SELECT id, quantity
        FROM cart
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        checkSql,
        [userId, product_id],
        (err, results) => {

            if (err) {

                console.error("Check cart error:", err);

                return res.status(500).json({
                    message: "Database error"
                });

            }


            // =====================================
            // PRODUCT ALREADY IN CART
            // =====================================

            if (results.length > 0) {

                const updateSql = `
                    UPDATE cart
                    SET quantity = quantity + ?
                    WHERE user_id = ? AND product_id = ?
                `;

                db.query(
                    updateSql,
                    [qty, userId, product_id],
                    (err) => {

                        if (err) {

                            console.error(
                                "Update cart error:",
                                err
                            );

                            return res.status(500).json({
                                message: "Unable to update cart"
                            });

                        }

                        res.json({
                            message: "Product quantity updated"
                        });

                    }
                );

            }


            // =====================================
            // NEW PRODUCT
            // =====================================

            else {

                const insertSql = `
                    INSERT INTO cart
                    (user_id, product_id, quantity)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [userId, product_id, qty],
                    (err) => {

                        if (err) {

                            console.error(
                                "Insert cart error:",
                                err
                            );

                            return res.status(500).json({
                                message: "Unable to add product"
                            });

                        }

                        res.status(201).json({
                            message: "Product added to cart"
                        });

                    }
                );

            }

        }
    );

};


// =====================================
// GET USER'S CART
// =====================================

const getCart = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            cart.id,
            cart.product_id,
            cart.quantity,
            products.name,
            products.price,
            products.discount,
            products.image,
            products.stock
        FROM cart
        INNER JOIN products
            ON cart.product_id = products.id
        WHERE cart.user_id = ?
        ORDER BY cart.id DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Get cart error:",
                    err
                );

                return res.status(500).json({
                    message: "Unable to get cart"
                });

            }

            res.json(results);

        }
    );

};


// =====================================
// UPDATE CART QUANTITY
// =====================================

const updateCart = (req, res) => {

    const userId = req.user.id;

    // Product ID comes from URL
    const productId = req.params.productId;

    // Quantity comes from request body
    const { quantity } = req.body;

    const newQuantity = Number(quantity);


    // =====================================
    // VALIDATION
    // =====================================

    if (!productId) {

        return res.status(400).json({
            message: "Product ID is required"
        });

    }

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {

        return res.status(400).json({
            message: "Quantity must be at least 1"
        });

    }


    // =====================================
    // UPDATE QUANTITY
    // =====================================

    const sql = `
        UPDATE cart
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        sql,
        [
            newQuantity,
            userId,
            productId
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Update cart error:",
                    err
                );

                return res.status(500).json({
                    message: "Unable to update cart"
                });

            }


            // =====================================
            // CART ITEM NOT FOUND
            // =====================================

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Cart item not found"
                });

            }


            // =====================================
            // SUCCESS
            // =====================================

            res.json({
                message: "Cart updated successfully",
                product_id: productId,
                quantity: newQuantity
            });

        }
    );

};


// =====================================
// REMOVE PRODUCT FROM CART
// =====================================

const removeFromCart = (req, res) => {

    const userId = req.user.id;
    const productId = req.params.productId;

    const sql = `
        DELETE FROM cart
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        sql,
        [userId, productId],
        (err, result) => {

            if (err) {

                console.error(
                    "Remove cart error:",
                    err
                );

                return res.status(500).json({
                    message: "Unable to remove product"
                });

            }


            // =====================================
            // PRODUCT NOT FOUND
            // =====================================

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Product not found in cart"
                });

            }


            // =====================================
            // SUCCESS
            // =====================================

            res.json({
                message: "Product removed from cart"
            });

        }
    );

};


// =====================================
// EXPORT
// =====================================

module.exports = {

    addToCart,
    getCart,
    updateCart,
    removeFromCart

};