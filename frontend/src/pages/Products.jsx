import { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

function Products() {
  const [refresh, setRefresh] = useState(false);

  const handleProductChange = () => {
    setRefresh((previous) => !previous);
  };

  return (
    <div>
      <h1>Products</h1>

      <ProductForm
        onProductChange={handleProductChange}
      />

      <ProductList
        refresh={refresh}
      />
    </div>
  );
}

export default Products;