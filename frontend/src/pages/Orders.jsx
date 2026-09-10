import { useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";
import OrderDetails from "../components/OrderDetails";

function Orders() {
  const [refresh, setRefresh] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderCreated = () => {
    setRefresh((previous) => !previous);
  };

  return (
    <div>
      <h1>Orders</h1>

      <OrderForm onOrderCreated={handleOrderCreated} />

      <OrderList
        refresh={refresh}
        onView={setSelectedOrder}
      />

      <OrderDetails order={selectedOrder} />
    </div>
  );
}

export default Orders;