import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import Dashboard from "./Dashboard";
import Orders from "./Orders";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Dashboard");

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      console.log("Products:", data);
      const params = new URLSearchParams();
      if (selectedCategory) params.set("product", selectedCategory);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("Dashboard")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "Dashboard"
              ? "bg-accent text-primary"
              : "bg-card text-text hover:bg-card/80"
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleCategoryChange("products")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "products"
              ? "bg-accent text-primary"
              : "bg-card text-text hover:bg-card/80"
              }`}
          >
            Products
          </button>
          <button
            onClick={() => handleCategoryChange("orders")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "orders"
              ? "bg-accent text-primary"
              : "bg-card text-text hover:bg-card/80"
              }`}
          >
            Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : selectedCategory == "products" && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : selectedCategory == "Dashboard" ? (
        <Dashboard />
      ) : selectedCategory == "orders" ? (
        <Orders />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
