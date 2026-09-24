import { Navigate } from "react-router-dom";

function SuperAdminRoute({ children }) {

    const token =
        localStorage.getItem("adminToken");

    const adminData =
        localStorage.getItem("admin");


    if (!token || !adminData) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }


    let admin;

    try {

        admin = JSON.parse(adminData);

    } catch (error) {

        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }


    if (admin.role !== "superadmin") {

        return (
            <Navigate
                to="/admin"
                replace
            />
        );

    }


    return children;
}

export default SuperAdminRoute;