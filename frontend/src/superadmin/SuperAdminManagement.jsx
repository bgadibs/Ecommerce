import { useEffect, useState } from "react";
import axios from "axios";

import "../css/superadmin.css";

function SuperAdminManagement() {

    const [admins, setAdmins] =
        useState([]);


    useEffect(() => {

        loadAdmins();

    }, []);


    const getConfig = () => {

        const token =
            localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };

    };


    const loadAdmins = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/superadmin/admins",
                getConfig()
            );

            setAdmins(response.data);

        } catch (error) {

            console.error(
                "Unable to load admins:",
                error
            );

        }

    };


    const handleDelete = async (id) => {

        if (!window.confirm(
            "Remove this admin?"
        )) {
            return;
        }


        try {

            await axios.delete(
                `http://localhost:5000/api/superadmin/admins/${id}`,
                getConfig()
            );

            setAdmins(
                admins.filter(
                    admin => admin.id !== id
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete admin"
            );

        }

    };


    return (

        <div className="superadmin-page">

            <h1>Admin Management</h1>

            <div className="superadmin-table-container">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {admins.map(admin => (

                            <tr key={admin.id}>

                                <td>
                                    {admin.id}
                                </td>

                                <td>
                                    {admin.name}
                                </td>

                                <td>
                                    {admin.email}
                                </td>

                                <td>

                                    <span
                                        className={
                                            admin.role ===
                                            "superadmin"
                                                ? "role-superadmin"
                                                : "role-admin"
                                        }
                                    >
                                        {admin.role}
                                    </span>

                                </td>

                                <td>

                                    {admin.role !==
                                        "superadmin" && (

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    admin.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default SuperAdminManagement;