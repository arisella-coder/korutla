// components/bodyComponents/inventory/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  fetchCategories,
  fetchSubcategories,
  fetchUnits,
  updateProduct,
} from "../../../redux/features/products/productSlice";

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  subcategory: "",
  quantity: "",
  unit: "",
  stock: "",
  sku: "",
  imageUrl: "",
};

const ProductForm = ({
  initialData = defaultFormData,
  mode = "create",
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const {
    loading,
    error: apiError,
    categories,
    subcategories,
    units,
  } = useSelector((state) => state.products);

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Update form data when initialData changes (useful for edit mode)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUnits());
  }, [dispatch]);

  // When a category is already selected (e.g., in edit mode) or changes, fetch its subcategories
  useEffect(() => {
    if (formData.category) {
      dispatch(fetchSubcategories(formData.category));
    }
  }, [dispatch, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Special handler for the category dropdown to also fetch subcategories
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategory,
      subcategory: "", // reset subcategory when category changes
    }));
    if (selectedCategory) {
      dispatch(fetchSubcategories(selectedCategory));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Valid price is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.subcategory.trim())
      newErrors.subcategory = "Subcategory is required";
    if (!formData.quantity || isNaN(formData.quantity))
      newErrors.quantity = "Valid quantity is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.stock || isNaN(formData.stock))
      newErrors.stock = "Valid stock is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      stock: parseInt(formData.stock, 10),
    };

    if (mode === "create") {
      dispatch(createProduct(payload))
        .unwrap()
        .then(() => {
          if (onSuccess) onSuccess();
        })
        .catch((err) => {
          console.error("Product creation failed:", err);
        });
    } else if (mode === "edit") {
      dispatch(updateProduct(payload))
        .unwrap()
        .then(() => {
          if (onSuccess) onSuccess();
        })
        .catch((err) => {
          console.error("Product update failed:", err);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          required
        />
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description}</p>
        )}
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          required
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>

      {/* Category Dropdown */}
      <div>
        <label>Category:</label>
        <select
          name="category"
          value={formData.category || ""}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
      </div>

      {/* Subcategory Dropdown */}
      <div>
        <label>Subcategory:</label>
        <select
          name="subcategory"
          value={formData.subcategory || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select a subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
        {errors.subcategory && (
          <p style={{ color: "red" }}>{errors.subcategory}</p>
        )}
      </div>

      {/* Quantity and Units */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
            required
          />
          {errors.quantity && <p style={{ color: "red" }}>{errors.quantity}</p>}
        </div>
        <div>
          <label>Unit:</label>
          <select
            name="unit"
            value={formData.unit || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select a unit</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>
          {errors.unit && <p style={{ color: "red" }}>{errors.unit}</p>}
        </div>
      </div>

      <div>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock || ""}
          onChange={handleChange}
          required
        />
        {errors.stock && <p style={{ color: "red" }}>{errors.stock}</p>}
      </div>

      <div>
        <label>SKU:</label>
        <input
          type="text"
          name="sku"
          value={formData.sku || ""}
          onChange={handleChange}
        />
        {errors.sku && <p style={{ color: "red" }}>{errors.sku}</p>}
      </div>

      <div>
        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl || ""}
          onChange={handleChange}
        />
        {errors.imageUrl && <p style={{ color: "red" }}>{errors.imageUrl}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
          ? "Create Product"
          : "Update Product"}
      </button>

      {apiError && <p style={{ color: "red" }}>{apiError}</p>}
    </form>
  );
};

export default ProductForm;
