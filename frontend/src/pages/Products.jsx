import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { productsAPI, resolveAssetUrl } from "../services/api";
import { toast } from "react-hot-toast";
import Modal from "../components/Modal";
import SearchInput from "../components/SearchInput";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food",
  "Other",
];

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      toast.error(err.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await productsAPI.create(data);
      await fetchProducts();
      setIsModalOpen(false);
      toast.success("Product created successfully");
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await productsAPI.update(id, data);
      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (editingProduct) {
      handleUpdate(editingProduct._id, formData);
    } else {
      handleCreate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-red-600 bg-red-950 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((product) =>
        `${product.name} ${product.description ?? ""} ${product.category ?? ""}`
          .toLowerCase()
          .includes(query)
      )
    : products;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Products</h2>
        <div className="flex items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
            className="w-full sm:w-72"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const stock = product.quantity;
          const stockTone =
            stock === 0
              ? "bg-red-400"
              : stock <= 5
              ? "bg-amber-400"
              : "bg-emerald-400";
          const stockLabel =
            stock === 0
              ? "Out of stock"
              : stock <= 5
              ? `Low · ${stock} left`
              : `${stock} in stock`;

          return (
            <div
              key={product._id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-gray-900/60 ring-1 ring-white/5 transition-colors duration-200 hover:ring-white/10"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-800/40">
                {product.imageUrl ? (
                  <img
                    src={resolveAssetUrl(product.imageUrl)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-gray-600">No image</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProductToDelete(product);
                    setIsDeleteModalOpen(true);
                  }}
                  aria-label={`Delete ${product.name}`}
                  title="Delete"
                  className="absolute left-3 top-3 rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>

                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {product.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="truncate text-base font-medium text-gray-100">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-gray-500">
                  {product.description}
                </p>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-100">
                      ${product.price.toFixed(2)}
                    </p>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${stockTone}`}
                      />
                      {stockLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 py-16 text-center text-gray-500">
          {search
            ? `No products match "${search}".`
            : "No products yet. Add your first product."}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingProduct?.name}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                minLength="2"
                maxLength="100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Category
              </label>
              <select
                name="category"
                defaultValue={editingProduct?.category || ""}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  className="w-full pl-8 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                defaultValue={editingProduct?.quantity}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows="4"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Image
            </label>
            <input
              type="file"
              name="productImage"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-50">
              Delete Product
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to delete &ldquo;{productToDelete?.name}
              &rdquo;? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(productToDelete._id)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
