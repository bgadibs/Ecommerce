const db = require("../config/db");


// =====================================
// GET ALL PRODUCTS
// =====================================

const getProducts = (req, res) => {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "❌ Get products MySQL error:",
                err
            );

            return res.status(500).json({
                message: "Unable to get products",
                error: err.message
            });
        }

        console.log(
            "✅ Products loaded:",
            results.length
        );

        res.status(200).json(results);

    });

};


// =====================================
// GET PRODUCT BY ID
// =====================================

const getProductById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM products
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "❌ Get product MySQL error:",
                    err
                );

                return res.status(500).json({
                    message: "Unable to get product",
                    error: err.message
                });
            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            res.status(200).json(
                results[0]
            );

        }
    );

};


// =====================================
// SEARCH PRODUCTS
// =====================================

const searchProducts = (req, res) => {

    const search = req.query.search || "";

    const value = `%${search}%`;

    const sql = `
        SELECT *
        FROM products
        WHERE name LIKE ?
           OR brand LIKE ?
           OR category LIKE ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [
            value,
            value,
            value
        ],
        (err, results) => {

            if (err) {

                console.error(
                    "❌ Search products MySQL error:",
                    err
                );

                return res.status(500).json({
                    message: "Search failed",
                    error: err.message
                });

            }


            res.status(200).json(
                results
            );

        }
    );

};


// =====================================
// CREATE PRODUCT
// =====================================

const createProduct = (req, res) => {

    const {
        name,
        brand,
        price,
        discount,
        stock,
        category,
        image,
        description
    } = req.body;


    if (!name || !price || !category) {

        return res.status(400).json({
            message:
                "Name, price and category are required"
        });

    }


    const sql = `
        INSERT INTO products
        (
            name,
            brand,
            price,
            discount,
            stock,
            category,
            image,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            brand || "BGADI",
            price,
            discount || 0,
            stock || 0,
            category,
            image || "",
            description || ""
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Create product MySQL error:",
                    err
                );

                return res.status(500).json({
                    message: "Unable to add product",
                    error: err.message
                });

            }


            res.status(201).json({

                message:
                    "Product added successfully",

                productId:
                    result.insertId

            });

        }
    );

};


// =====================================
// UPDATE PRODUCT
// =====================================

const updateProduct = (req, res) => {

    const { id } = req.params;

    const {
        name,
        brand,
        price,
        discount,
        stock,
        category,
        image,
        description
    } = req.body;


    const sql = `
        UPDATE products
        SET
            name = ?,
            brand = ?,
            price = ?,
            discount = ?,
            stock = ?,
            category = ?,
            image = ?,
            description = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            brand,
            price,
            discount,
            stock,
            category,
            image,
            description,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Update product MySQL error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to update product",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });

            }


            res.status(200).json({

                message:
                    "Product updated successfully"

            });

        }
    );

};


// =====================================
// DELETE PRODUCT
// =====================================

const deleteProduct = (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Delete product MySQL error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to delete product",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });

            }


            res.status(200).json({

                message:
                    "Product deleted successfully"

            });

        }
    );

};


// =====================================
// EXPORT
// =====================================

module.exports = {

    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct

};