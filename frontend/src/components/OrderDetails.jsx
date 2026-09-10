function OrderDetails({ order }) {
  if (!order) {
    return null;
  }

  return (
    <div>
      <h2>Order Details</h2>

      <p>
        <strong>Order Number:</strong> {order.orderNumber}
      </p>

      <p>
        <strong>Customer:</strong> {order.customer.name}
      </p>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <h3>Items</h3>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>QTY</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.unitPrice}</td>
              <td>₹{item.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Order Total: ₹{order.totalAmount}</h3>
    </div>
  );
}

export default OrderDetails;