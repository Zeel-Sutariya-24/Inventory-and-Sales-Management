import { useEffect, useState } from "react";
import { createOrder } from "../services/orderService";

function OrderForm({ onOrderCreated }) {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/customers")
            .then((response) => response.json())
            .then((data) => {
                setCustomers(data.customers);
            })
            .catch((error) => {
                console.error("Failed to fetch customers:", error);
            });

        fetch("http://localhost:5000/api/products?limit=100")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
            });
    }, []);

    const handleAddProduct = () => {
        if (!selectedProduct) {
            alert("Please select a product");
            return;
        }

        if (quantity < 1) {
            alert("Quantity must be at least 1");
            return;
        }

        const product = products.find(
            (product) => product._id === selectedProduct
        );

        if (!product) {
            return;
        }

        if (quantity > product.stock) {
            alert(
                `Only ${product.stock} units of ${product.name} are available`
            );
            return;
        }

        const existingItem = items.find(
            (item) => item.product === selectedProduct
        );

        if (existingItem) {
            alert("Product is already added to the order");
            return;
        }

        const lineTotal = product.price * quantity;

        const newItem = {
            product: product._id,
            name: product.name,
            quantity,
            unitPrice: product.price,
            lineTotal,
        };

        setItems((previous) => [...previous, newItem]);

        setSelectedProduct("");
        setQuantity(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer) {
            alert("Please select a customer");
            return;
        }

        if (items.length === 0) {
            alert("Please add at least one product");
            return;
        }

        const orderData = {
            customer: selectedCustomer,
            items: items.map((item) => ({
                product: item.product,
                quantity: item.quantity,
            })),
        };

        try {
            const data = await createOrder(orderData);

            console.log("Order created:", data);

            alert(
                `Order ${data.order.orderNumber} created successfully!`
            );

            setSelectedCustomer("");
            setItems([]);

            onOrderCreated();
        } catch (error) {
            console.error("Failed to create order:", error);

            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Order</h2>

            <h3>Customer</h3>

            <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
            >
                <option value="">Select customer</option>

                {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                        {customer.name}
                    </option>
                ))}
            </select>

            <h3>Add Product</h3>

            <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
            >
                <option value="">Select product</option>

                {products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price} - Stock: {product.stock}
                    </option>
                ))}
            </select>

            <div>
                <label>Quantity</label>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>

            <button type="button" onClick={handleAddProduct}>
                Add Product
            </button>

            <h3>Order Items</h3>

            {items.map((item) => (
                <div key={item.product}>
                    <p>
                        {item.name} | Qty: {item.quantity} | Unit Price: ₹
                        {item.unitPrice} | Line Total: ₹{item.lineTotal}
                    </p>
                </div>
            ))}
            {items.length > 0 && (
                <div>
                    <h3>
                        Order Total: ₹
                        {items.reduce(
                            (total, item) => total + item.lineTotal,
                            0
                        )}
                    </h3>
                </div>
            )}
            <button type="submit">
                Confirm Order
            </button>
        </form>
    );
}

export default OrderForm;