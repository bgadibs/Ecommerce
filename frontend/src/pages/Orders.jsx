import { useEffect, useState } from "react";
import {
    getMyOrders
} from "../services/api";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadOrders = async () => {

            try {

                const response =
                    await getMyOrders();

                setOrders(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadOrders();

    }, []);


    if (loading) {

        return (
            <div className="section">
                <h2>Loading orders...</h2>
            </div>
        );

    }


    return (
        <div className="section">

            <h1>My Orders</h1>

            {orders.length === 0 ? (

                <p>
                    You haven't placed any orders yet.
                </p>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >

                            <h3>
                                Order #{order.id}
                            </h3>

                            <p>
                                Amount:
                                ₹{Number(
                                    order.total_amount
                                ).toFixed(2)}
                            </p>

                            <p>
                                Status:
                                <strong>
                                    {" "}{order.status}
                                </strong>
                            </p>

                            <p>
                                Payment:
                                {order.payment_method}
                            </p>

                            <p>
                                Address:
                                {order.address},
                                {order.city},
                                {order.state} -
                                {order.pincode}
                            </p>

                            <p>
                                Date:
                                {new Date(
                                    order.created_at
                                ).toLocaleString()}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Orders;