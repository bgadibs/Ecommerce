const express = require("express");

const router = express.Router();

const {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.get("/search", searchProducts);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;