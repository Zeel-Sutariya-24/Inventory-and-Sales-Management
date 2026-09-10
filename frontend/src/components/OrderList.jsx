import { useEffect, useState } from "react";
import {
    getOrders,
    cancelOrder,
} from "../services/orderService";

function OrderList({ refresh, onView }) {
    const [orders, setOrders] = useState([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/orders?search=${encodeURIComponent(
                        search
                    )}&page=${page}&limit=5`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch orders");
                }

                setOrders(data.orders);
                setTotalPages(data.pagination.totalPages);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, [refresh, search, page]);

    const handleCancel = async (orderId) => {
        try {
            await cancelOrder(orderId);

            alert("Order cancelled successfully");

            const data = await getOrders();
            setOrders(data.orders);
        } catch (error) {
            console.error("Failed to cancel order:", error);

            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Orders</h2>
            <input
                type="text"
                placeholder="Search by order number or customer"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id}>
                        <p>
                            {order.orderNumber} | {order.customer.name} | ₹
                            {order.totalAmount} | {order.status} |{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <button
                            type="button"
                            onClick={() => onView(order)}
                        >
                            View
                        </button>

                        {order.status === "CONFIRMED" && (
                            <button
                                type="button"
                                onClick={() => handleCancel(order._id)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ))
            )}
            <div>
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((previous) => previous - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((previous) => previous + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default OrderList;