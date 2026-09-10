export const createCustomer = async (customerData) => {
  const response = await fetch("http://localhost:5000/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create customer");
  }

  return data;
};

export const deleteCustomer = async (customerId) => {
  const response = await fetch(
    `http://localhost:5000/api/customers/${customerId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete customer");
  }

  return data;
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await fetch(
    `http://localhost:5000/api/customers/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update customer");
  }

  return data;
};