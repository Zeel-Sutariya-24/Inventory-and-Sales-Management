import { useEffect, useState } from "react";
import { deleteCustomer } from "../services/customerService";

function CustomerList({ onEdit, refresh }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/customers")
            .then((response) => response.json())
            .then((data) => {
                console.log("Customers:", data);
                setCustomers(data.customers);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setLoading(false);
            });
    }, [refresh]);

    const handleDelete = async (customerId) => {
        try {
            await deleteCustomer(customerId);

            setCustomers((previous) =>
                previous.filter((customer) => customer._id !== customerId)
            );
        } catch (error) {
            console.error("Failed to delete customer:", error);
        }
    };

    return (
        <div>
            <h2>Customer List</h2>

            {loading && <p>Loading customers...</p>}

            {!loading && customers.length === 0 && (
                <p>No customers found.</p>
            )}

            {customers.map((customer) => (
                <div key={customer._id}>
                    <h3>{customer.name}</h3>
                    <p>Phone: {customer.phone}</p>
                    <p>Email: {customer.email}</p>
                    <p>Status: {customer.status}</p>
                    <button onClick={() => handleDelete(customer._id)}>
                        Delete
                    </button>
                    <button onClick={() => onEdit(customer)}>
                        Edit
                    </button>
                </div>
            ))}

        </div>
    );
}

export default CustomerList;