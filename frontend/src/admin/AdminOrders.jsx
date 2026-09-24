import React, { useEffect, useState } from "react";

function AdminOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Later we will get orders from your backend
        setOrders([]);
    }, []);

    return (
        <div className="admin-orders">

            <h1>Admin Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userName}</td>
                                <td>₹{order.total}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default AdminOrders;