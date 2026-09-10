import { useEffect, useState } from "react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h3>Total Customers</h3>
        <p>{dashboard.totalCustomers}</p>
      </div>

      <div>
        <h3>Total Products</h3>
        <p>{dashboard.totalProducts}</p>
      </div>

      <div>
        <h3>Total Orders</h3>
        <p>{dashboard.totalOrders}</p>
      </div>

      <div>
        <h3>Total Sales</h3>
        <p>₹{dashboard.totalSales}</p>
      </div>

      <div>
        <h3>Low Stock Products</h3>
        <p>{dashboard.lowStockProducts}</p>
      </div>
    </div>
  );
}

export default Dashboard;