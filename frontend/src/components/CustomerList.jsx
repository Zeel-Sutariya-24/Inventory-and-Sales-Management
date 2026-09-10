import { useEffect, useState } from "react";
import { deleteCustomer } from "../services/customerService";

function CustomerList({ onEdit, refresh }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 1,
    });
    useEffect(() => {
        fetch(
            `http://localhost:5000/api/customers?search=${encodeURIComponent(
                search
            )}&page=${page}&limit=5`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Customers:", data);
                setCustomers(data.customers);
                setPagination(data.pagination);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
                setLoading(false);
            });
    }, [refresh, search, page]);

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
            <input
                type="text"
                placeholder="Search by name, phone or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

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

            <div>
                <button
                    disabled={pagination.page === 1}
                    onClick={() => setPage((previous) => previous - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPage((previous) => previous + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default CustomerList;