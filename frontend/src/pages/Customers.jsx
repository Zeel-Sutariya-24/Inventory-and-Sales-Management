import { useState } from "react";
import CustomerForm from "../components/CustomerForm";
import CustomerList from "../components/CustomerList";

function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleCustomerChange = () => {
    setRefresh((previous) => !previous);
  };

  return (
    <div>
      <h1>Customers</h1>

      <CustomerForm
        customer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
      />

      <CustomerList
        onEdit={setSelectedCustomer}
        refresh={refresh}
      />
    </div>
  );
}

export default Customers;