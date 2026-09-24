import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/api";


function AdminCategories() {

    const [categories, setCategories] = useState([]);

    const [newCategory, setNewCategory] = useState("");

    const [editId, setEditId] = useState(null);

    const [editCategory, setEditCategory] = useState("");

    const [loading, setLoading] = useState(true);


    // =====================================
    // GET CATEGORIES FROM DATABASE
    // =====================================

    const loadCategories = async () => {

        try {

            const response = await getCategories();

            setCategories(response.data);

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to load categories"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCategories();

    }, []);


    // =====================================
    // ADD CATEGORY
    // =====================================

    const handleAdd = async () => {

        if (newCategory.trim() === "") {

            alert("Please enter category name");

            return;

        }

        try {

            await createCategory({
                name: newCategory.trim()
            });

            alert("Category added successfully");

            setNewCategory("");

            loadCategories();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to add category"
            );

        }

    };


    // =====================================
    // START EDIT
    // =====================================

    const handleEdit = (category) => {

        setEditId(category.id);

        setEditCategory(category.name);

    };


    // =====================================
    // SAVE EDIT
    // =====================================

    const handleSaveEdit = async () => {

        if (editCategory.trim() === "") {

            alert("Category name cannot be empty");

            return;

        }

        try {

            await updateCategory(
                editId,
                {
                    name: editCategory.trim()
                }
            );

            alert("Category updated successfully");

            setEditId(null);

            setEditCategory("");

            loadCategories();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to update category"
            );

        }

    };


    // =====================================
    // DELETE CATEGORY
    // =====================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteCategory(id);

            alert("Category deleted successfully");

            loadCategories();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete category"
            );

        }

    };


    return (

        <div className="admin-categories">


            {/* =================================
                HEADER
            ================================= */}

            <div className="admin-page-header">

                <div>

                    <span className="admin-label">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Manage Categories
                    </h1>

                    <p>
                        Add, edit and delete product categories.
                    </p>

                </div>

            </div>


            {/* =================================
                ADD CATEGORY
            ================================= */}

            <div className="category-add-box">

                <h2>
                    Add New Category
                </h2>

                <div className="category-add-form">

                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(e) =>
                            setNewCategory(e.target.value)
                        }
                    />

                    <button
                        onClick={handleAdd}
                        className="category-add-button"
                    >
                        + Add Category
                    </button>

                </div>

            </div>


            {/* =================================
                CATEGORY LIST
            ================================= */}

            <div className="category-list-box">

                <div className="category-list-header">

                    <h2>
                        Categories
                    </h2>

                    <span>
                        {categories.length} Categories
                    </span>

                </div>


                {loading ? (

                    <p className="category-message">
                        Loading categories...
                    </p>

                ) : categories.length === 0 ? (

                    <p className="category-message">
                        No categories available.
                    </p>

                ) : (

                    <div className="category-list">

                        {categories.map((category) => (

                            <div
                                className="category-row"
                                key={category.id}
                            >


                                {/* CATEGORY NAME */}

                                <div className="category-name">

                                    <div className="category-icon">
                                        🏷️
                                    </div>


                                    {editId === category.id ? (

                                        <input
                                            type="text"
                                            value={editCategory}
                                            onChange={(e) =>
                                                setEditCategory(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {category.name}
                                        </strong>

                                    )}

                                </div>


                                {/* ACTION BUTTONS */}

                                <div className="category-actions">


                                    {editId === category.id ? (

                                        <>

                                            <button
                                                className="save-button"
                                                onClick={handleSaveEdit}
                                            >
                                                Save
                                            </button>


                                            <button
                                                className="cancel-button"
                                                onClick={() => {

                                                    setEditId(null);

                                                    setEditCategory("");

                                                }}
                                            >
                                                Cancel
                                            </button>

                                        </>

                                    ) : (

                                        <>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(category)
                                                }
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}


export default AdminCategories;