export const createOrder = async (orderData) => {
  const response = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
};

export const getOrders = async () => {
  const response = await fetch("http://localhost:5000/api/orders");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};

export const getOrderById = async (orderId) => {
  const response = await fetch(
    `http://localhost:5000/api/orders/${orderId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
};

export const cancelOrder = async (orderId) => {
  const response = await fetch(
    `http://localhost:5000/api/orders/${orderId}/cancel`,
    {
      method: "PUT",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel order");
  }

  return data;
};