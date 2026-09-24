import { useEffect, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/api";

function AdminProducts() {

    const emptyProduct = {
        name: "",
        brand: "",
        price: "",
        discount: "",
        stock: "",
        category: "",
        image: "",
        description: ""
    };

    const [products, setProducts] = useState([]);

    const [product, setProduct] =
        useState(emptyProduct);

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");

    // =====================================
    // LOAD PRODUCTS
    // =====================================

    const loadProducts = async () => {

        try {

            const response =
                await getProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }
    };


    useEffect(() => {

        loadProducts();

    }, []);


    // =====================================
    // HANDLE INPUT
    // =====================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProduct({
            ...product,
            [name]: value
        });
    };


    // =====================================
    // ADD / UPDATE PRODUCT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await updateProduct(
                    editingId,
                    product
                );

                setMessage(
                    "Product updated successfully"
                );

            } else {

                await createProduct(product);

                setMessage(
                    "Product added successfully"
                );
            }

            setProduct(emptyProduct);

            setEditingId(null);

            await loadProducts();

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    // =====================================
    // EDIT PRODUCT
    // =====================================

    const handleEdit = (item) => {

        setProduct({
            name: item.name || "",
            brand: item.brand || "",
            price: item.price || "",
            discount: item.discount || "",
            stock: item.stock || "",
            category: item.category || "",
            image: item.image || "",
            description: item.description || ""
        });

        setEditingId(item.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================
    // DELETE PRODUCT
    // =====================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteProduct(id);

            setMessage(
                "Product deleted successfully"
            );

            await loadProducts();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete product"
            );
        }
    };


    // =====================================
    // CANCEL EDIT
    // =====================================

    const cancelEdit = () => {

        setProduct(emptyProduct);

        setEditingId(null);

        setMessage("");
    };


    return (

        <div className="admin-products">

            <h1>Admin Product Management</h1>


            {/* ================================= */}
            {/* MESSAGE */}
            {/* ================================= */}

            {message && (

                <div className="admin-message">
                    {message}
                </div>

            )}


            {/* ================================= */}
            {/* PRODUCT FORM */}
            {/* ================================= */}

            <div className="admin-product-form">

                <h2>
                    {editingId
                        ? "Edit Product"
                        : "Add Product"}
                </h2>


                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div>
                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>


                        <div>
                            <label>
                                Brand
                            </label>

                            <input
                                type="text"
                                name="brand"
                                value={product.brand}
                                onChange={handleChange}
                                placeholder="Enter brand"
                            />
                        </div>


                        <div>
                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                required
                            />
                        </div>


                        <div>
                            <label>
                                Discount (%)
                            </label>

                            <input
                                type="number"
                                name="discount"
                                value={product.discount}
                                onChange={handleChange}
                                placeholder="Enter discount"
                            />
                        </div>


                        <div>
                            <label>
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                placeholder="Enter stock"
                            />
                        </div>


                        <div>
                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Jewellery">
                                    Jewellery
                                </option>

                                <option value="Men's Clothing">
                                    Men's Clothing
                                </option>

                                <option value="Women's Clothing">
                                    Women's Clothing
                                </option>

                                <option value="Kids Clothing">
                                    Kids Clothing
                                </option>

                            </select>
                        </div>

                    </div>


                    <div className="form-field">

                        <label>
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={product.image}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                        />

                    </div>


                    <div className="form-field">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="4"
                        />

                    </div>


                    <div className="admin-form-buttons">

                        <button
                            type="submit"
                            className="admin-add-button"
                        >
                            {editingId
                                ? "Update Product"
                                : "Add Product"}
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ================================= */}
            {/* PRODUCT LIST */}
            {/* ================================= */}

            <div className="admin-product-list">

                <h2>
                    Product List
                </h2>


                {products.length === 0 ? (

                    <p>
                        No products available.
                    </p>

                ) : (

                    <div className="admin-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Brand
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Discount
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {products.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                        >

                                            <td>

                                                {item.image ? (

                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="admin-product-image"
                                                    />

                                                ) : (

                                                    <span>
                                                        No Image
                                                    </span>

                                                )}

                                            </td>


                                            <td>
                                                {item.name}
                                            </td>


                                            <td>
                                                {item.brand}
                                            </td>


                                            <td>
                                                ₹
                                                {Number(
                                                    item.price
                                                ).toFixed(2)}
                                            </td>


                                            <td>
                                                {item.discount || 0}%
                                            </td>


                                            <td>
                                                {item.stock}
                                            </td>


                                            <td>
                                                {item.category}
                                            </td>


                                            <td>

                                                <button
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="admin-delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminProducts;