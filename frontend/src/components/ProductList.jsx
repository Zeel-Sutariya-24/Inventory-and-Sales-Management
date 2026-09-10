import { useEffect, useState } from "react";
import { deleteProduct } from "../services/productService";

function ProductList({ refresh, onEdit }) {
    const [products, setProducts] = useState([]);
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
            `http://localhost:5000/api/products?search=${encodeURIComponent(
                search
            )}&page=${page}&limit=5`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Products:", data);

                setProducts(data.products);
                setPagination(data.pagination);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
                setLoading(false);
            });
    }, [refresh, search, page]);

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);

            setProducts((previous) =>
                previous.filter((product) => product._id !== productId)
            );
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div>
            <h2>Product List</h2>

            <input
                type="text"
                placeholder="Search by name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p>Loading products...</p>}

            {!loading && products.length === 0 && (
                <p>No products found.</p>
            )}

            {products.map((product) => (
                <div key={product._id}>
                    <h3>{product.name}</h3>

                    <p>SKU: {product.sku}</p>
                    <p>Price: RS. {product.price}</p>
                    <p>
                        Stock: {product.stock}{" "}
                        {product.stock <= 5 && <strong>Low Stock</strong>}
                    </p>
                    <p>Status: {product.status}</p>
                    <button onClick={() => handleDelete(product._id)}>
                        Delete
                    </button>
                    <button onClick={() => onEdit(product)}>
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

export default ProductList;