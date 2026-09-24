const db = require("../config/db");

// GET ALL CATEGORIES
exports.getCategories = (req, res) => {

    const sql = `
        SELECT *
        FROM categories
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Unable to fetch categories"
            });
        }

        res.json(results);
    });
};


// ADD CATEGORY
exports.createCategory = (req, res) => {

    const { name } = req.body;

    if (!name || name.trim() === "") {

        return res.status(400).json({
            message: "Category name is required"
        });

    }

    const sql = `
        INSERT INTO categories (name)
        VALUES (?)
    `;

    db.query(
        sql,
        [name.trim()],
        (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {

                    return res.status(400).json({
                        message: "Category already exists"
                    });

                }

                console.error(err);

                return res.status(500).json({
                    message: "Unable to create category"
                });
            }

            res.status(201).json({
                message: "Category created successfully",
                id: result.insertId,
                name: name.trim()
            });

        }
    );
};


// UPDATE CATEGORY
exports.updateCategory = (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {

        return res.status(400).json({
            message: "Category name is required"
        });

    }

    const sql = `
        UPDATE categories
        SET name = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name.trim(), id],
        (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {

                    return res.status(400).json({
                        message: "Category already exists"
                    });

                }

                console.error(err);

                return res.status(500).json({
                    message: "Unable to update category"
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Category not found"
                });

            }

            res.json({
                message: "Category updated successfully"
            });

        }
    );
};


// DELETE CATEGORY
exports.deleteCategory = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM categories
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Unable to delete category"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Category not found"
                });

            }

            res.json({
                message: "Category deleted successfully"
            });

        }
    );
};