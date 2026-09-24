import { useEffect, useState } from "react";

import {
    getUsers,
    searchUsers,
    deleteUser
} from "../services/api";


function AdminUsers() {

    // =====================================
    // STATES
    // =====================================

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);


    // =====================================
    // GET USERS
    // =====================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await getUsers();

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Unable to load users:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load users"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================
    // SEARCH USERS
    // =====================================

    const handleSearch = async (value) => {

        setSearch(value);


        // If search is empty,
        // load all users again

        if (value.trim() === "") {

            loadUsers();

            return;

        }


        try {

            const response =
                await searchUsers(value);

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Search users error:",
                error
            );

        }

    };


    // =====================================
    // DELETE USER
    // =====================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );


        if (!confirmDelete) {

            return;

        }


        try {

            await deleteUser(id);

            alert(
                "User deleted successfully"
            );


            // Remove user immediately
            // from the screen

            setUsers(
                users.filter(
                    (user) => user.id !== id
                )
            );


        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete user"
            );

        }

    };


    return (

        <div className="admin-users">


            {/* =================================
                HEADER
            ================================= */}

            <div className="admin-page-header">

                <div>

                    <span className="admin-label">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Manage Users
                    </h1>

                    <p>
                        View, search and manage registered users.
                    </p>

                </div>

            </div>


            {/* =================================
                SEARCH + COUNT
            ================================= */}

            <div className="users-toolbar">

                <div className="user-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                    />

                </div>


                <div className="user-count">

                    <strong>
                        {users.length}
                    </strong>

                    <span>
                        Users
                    </span>

                </div>

            </div>


            {/* =================================
                USERS TABLE
            ================================= */}

            <div className="users-table-box">


                {loading ? (

                    <div className="users-message">

                        Loading users...

                    </div>

                ) : users.length === 0 ? (

                    <div className="users-message">

                        No users found.

                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr key={user.id}>

                                    {/* ID */}

                                    <td>
                                        #{user.id}
                                    </td>


                                    {/* USER */}

                                    <td>

                                        <div className="user-info">

                                            <div className="user-avatar">

                                                {user.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}

                                            </div>

                                            <strong>
                                                {user.name}
                                            </strong>

                                        </div>

                                    </td>


                                    {/* EMAIL */}

                                    <td>
                                        {user.email}
                                    </td>


                                    {/* DELETE */}

                                    <td>

                                        <button
                                            className="user-delete-button"
                                            onClick={() =>
                                                handleDelete(
                                                    user.id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}


export default AdminUsers;