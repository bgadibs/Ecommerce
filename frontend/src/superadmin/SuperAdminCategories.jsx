import { useEffect, useState } from "react";
import "../css/superadmin.css";

import {
    getCategories,
    deleteCategory
} from "../services/api";


function SuperAdminCategories() {

    const [categories, setCategories] =
        useState([]);


    useEffect(() => {

        loadCategories();

    }, []);


    const loadCategories = async () => {

        try {

            const response =
                await getCategories();

            setCategories(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    const handleDelete = async (id) => {

        if (!window.confirm(
            "Delete this category?"
        )) {
            return;
        }

        try {

            await deleteCategory(id);

            setCategories(
                categories.filter(
                    category =>
                        category.id !== id
                )
            );

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <div className="superadmin-page">

            <h1>Categories</h1>

            <div className="superadmin-table-container">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {categories.map(category => (

                            <tr key={category.id}>

                                <td>
                                    {category.id}
                                </td>

                                <td>
                                    {category.name}
                                </td>

                                <td>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                category.id
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

export default SuperAdminCategories;