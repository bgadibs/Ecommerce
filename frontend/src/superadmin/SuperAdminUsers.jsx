import { useEffect, useState } from "react";

import {
    getUsers,
    deleteUser
} from "../services/api";

import "../css/superadmin.css";

function SuperAdminUsers() {

    const [users, setUsers] =
        useState([]);


    useEffect(() => {

        loadUsers();

    }, []);


    const loadUsers = async () => {

        try {

            const response =
                await getUsers();

            setUsers(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    const handleDelete = async (id) => {

        if (!window.confirm(
            "Delete this user?"
        )) {
            return;
        }

        try {

            await deleteUser(id);

            setUsers(
                users.filter(
                    user => user.id !== id
                )
            );

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <div className="superadmin-page">

            <h1>Users</h1>

            <div className="superadmin-table-container">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {users.map(user => (

                            <tr key={user.id}>

                                <td>
                                    {user.id}
                                </td>

                                <td>
                                    {user.name}
                                </td>

                                <td>
                                    {user.email}
                                </td>

                                <td>
                                    {user.phone}
                                </td>

                                <td>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                user.id
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

export default SuperAdminUsers;