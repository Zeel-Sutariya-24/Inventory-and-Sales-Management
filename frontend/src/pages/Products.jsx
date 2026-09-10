import { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

function Products() {
  const [refresh, setRefresh] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductChange = () => {
    setRefresh((previous) => !previous);
    setSelectedProduct(null);
  };

  return (
    <div>
      <h1>Products</h1>

      <ProductForm
        product={selectedProduct}
        onProductChange={handleProductChange}
      />

      <ProductList
        refresh={refresh}
        onEdit={setSelectedProduct}
      />
    </div>
  );
}

export default Products;