import { useEffect, useState } from "react";
import {
    getProducts,
    deleteProduct
} from "../services/api";

import "../css/superadmin.css";

function SuperAdminProducts() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        loadProducts();

    }, []);


    const loadProducts = async () => {

        try {

            const response = await getProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    const handleDelete = async (id) => {

        if (!window.confirm(
            "Delete this product?"
        )) {
            return;
        }

        try {

            await deleteProduct(id);

            setProducts(
                products.filter(
                    product => product.id !== id
                )
            );

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <div className="superadmin-page">

            <h1>Products</h1>

            <div className="superadmin-table-container">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {products.map(product => (

                            <tr key={product.id}>

                                <td>
                                    {product.id}
                                </td>

                                <td>
                                    {product.name}
                                </td>

                                <td>
                                    {product.brand}
                                </td>

                                <td>
                                    ₹{product.price}
                                </td>

                                <td>
                                    {product.category}
                                </td>

                                <td>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                product.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default SuperAdminProducts;