import { useEffect, useState } from "react";
import { customerSchema } from "../validation/customerValidation";
import {
    createCustomer,
    updateCustomer,
} from "../services/customerService";

function CustomerForm({ customer, onCustomerChange }) {
    const initialFormData = {
        name: "",
        phone: "",
        email: "",
        address: "",
        status: "Active",
    };

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                phone: customer.phone,
                email: customer.email || "",
                address: customer.address || "",
                status: customer.status,
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = customerSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        const isEditing = Boolean(customer);

        try {
            const data = isEditing
                ? await updateCustomer(customer._id, result.data)
                : await createCustomer(result.data);

            console.log("Customer response:", data);

            setFormData(initialFormData);

            setSuccessMessage(
                isEditing
                    ? "Customer updated successfully!"
                    : "Customer created successfully!"
            );

            onCustomerChange();
        } catch (error) {
            console.error("Failed to save customer:", error);
        }
    };

    return (
        <div>
            {successMessage && <p>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p>{errors.name[0]}</p>}
                </div>

                <div>
                    <label>Phone *</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p>{errors.phone[0]}</p>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p>{errors.email[0]}</p>}
                </div>

                <div>
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
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

                <button type="submit">Save Customer</button>
            </form>
        </div>
    );
}

export default CustomerForm;