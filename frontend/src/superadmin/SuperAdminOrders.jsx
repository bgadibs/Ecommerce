import { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";

import "../css/superadmin.css";

function SuperAdminOrders() {

    const [orders, setOrders] =
        useState([]);


    useEffect(() => {

        loadOrders();

    }, []);


    const loadOrders = async () => {

        try {

            const response =
                await getMyOrders();

            setOrders(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <div className="superadmin-page">

            <h1>Orders</h1>

            <div className="superadmin-table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Order ID</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order => (

                            <tr key={order.id}>

                                <td>
                                    #{order.id}
                                </td>

                                <td>
                                    ₹{order.total}
                                </td>

                                <td>
                                    {order.status}
                                </td>

                                <td>
                                    {order.created_at}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default SuperAdminOrders;