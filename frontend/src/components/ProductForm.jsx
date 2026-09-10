import { useEffect, useState } from "react";
import { productSchema } from "../validation/productValidation";
import {
    createProduct,
    updateProduct,
} from "../services/productService";

const initialFormData = {
    name: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    status: "Active",
};

function ProductForm({ product, onProductChange }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                price: product.price,
                stock: product.stock,
                description: product.description || "",
                status: product.status,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
        };

        const result = productSchema.safeParse(productData);

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setErrors({});

        const isEditing = Boolean(product);

        try {
            const data = isEditing
                ? await updateProduct(product._id, result.data)
                : await createProduct(result.data);

            console.log("Product response:", data);

            setFormData(initialFormData);

            setSuccessMessage(
                isEditing
                    ? "Product updated successfully!"
                    : "Product created successfully!"
            );

            onProductChange();
        } catch (error) {
            console.error("Failed to save product:", error);
            setSuccessMessage("");
        }
    };

    return (
        <div>
            <h2>{product ? "Edit Product" : "Add Product"}</h2>
            {successMessage && <p>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p>{errors.name[0]}</p>}
                </div>

                <div>
                    <label>SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                    />
                    {errors.sku && <p>{errors.sku[0]}</p>}
                </div>

                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                    {errors.price && <p>{errors.price[0]}</p>}
                </div>

                <div>
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                    {errors.stock && <p>{errors.stock[0]}</p>}
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <button type="submit">
                    {product ? "Update Product" : "Save Product"}
                </button>
            </form>
        </div>
    );
}

export default ProductForm;