const db = require("../config/db");


// =====================================
// GET WISHLIST
// =====================================

// =====================================
// GET WISHLIST
// =====================================

const getWishlist = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            w.id AS wishlist_id,
            w.product_id,
            p.id AS id,
            p.name,
            p.price,
            p.image

        FROM wishlist AS w

        INNER JOIN products AS p
            ON w.product_id = p.id

        WHERE w.user_id = ?

        ORDER BY w.id DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "❌ Get wishlist MySQL error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to get wishlist",
                    error: err.message
                });

            }

            console.log(
                "✅ Wishlist:",
                results
            );

            res.status(200).json(results);

        }
    );
};

// =====================================
// ADD TO WISHLIST
// =====================================

const addToWishlist = (req, res) => {

    const userId = req.user.id;

    const { product_id } = req.body;


    // Check product ID

    if (!product_id) {

        return res.status(400).json({
            message: "Product ID is required"
        });

    }


    // Check whether product exists

    const checkProductSql = `
        SELECT id
        FROM products
        WHERE id = ?
    `;


    db.query(
        checkProductSql,
        [product_id],
        (err, products) => {

            if (err) {

                console.error(
                    "❌ Product check error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            if (products.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            // ===============================
            // CHECK EXISTING WISHLIST
            // ===============================

            const checkWishlistSql = `
                SELECT id
                FROM wishlist
                WHERE user_id = ?
                AND product_id = ?
            `;


            db.query(
                checkWishlistSql,
                [userId, product_id],
                (err, existing) => {

                    if (err) {

                        console.error(
                            "❌ Wishlist check error:",
                            err
                        );

                        return res.status(500).json({
                            message: "Database error",
                            error: err.message
                        });

                    }


                    if (existing.length > 0) {

                        return res.status(400).json({
                            message:
                                "Product already in wishlist"
                        });

                    }


                    // ===============================
                    // INSERT WISHLIST
                    // ===============================

                    const insertSql = `
                        INSERT INTO wishlist
                        (user_id, product_id)
                        VALUES (?, ?)
                    `;


                    db.query(
                        insertSql,
                        [userId, product_id],
                        (err, result) => {

                            if (err) {

                                console.error(
                                    "❌ Add wishlist MySQL error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Failed to add to wishlist",
                                    error: err.message
                                });

                            }


                            res.status(201).json({

                                message:
                                    "Product added to wishlist",

                                id:
                                    result.insertId

                            });

                        }
                    );

                }
            );

        }
    );

};


// =====================================
// REMOVE FROM WISHLIST
// =====================================

const removeFromWishlist = (req, res) => {

    const userId = req.user.id;

    const productId =
        req.params.productId;


    if (!productId) {

        return res.status(400).json({
            message: "Product ID is required"
        });

    }


    const sql = `
        DELETE FROM wishlist

        WHERE user_id = ?

        AND product_id = ?
    `;


    db.query(
        sql,
        [userId, productId],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Remove wishlist MySQL error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to remove wishlist",
                    error:
                        err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Product not found in wishlist"
                });

            }


            res.status(200).json({

                message:
                    "Product removed from wishlist"

            });

        }
    );

};


// =====================================
// EXPORT
// =====================================

module.exports = {

    getWishlist,

    addToWishlist,

    removeFromWishlist

};