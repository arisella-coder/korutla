import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/api.js";

// Fetch products with pagination parameters: page (1-indexed) and limit
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/products?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data; // Returns { products, total, page, pages }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Async thunk for getting all categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/products/getcategory");
      return response.data; // Returns { categories }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Async thunk for getting all subcategories
export const fetchSubcategories = createAsyncThunk(
  "products/fetchSubcategories",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/products/getsubcategories/${category}`
      );
      return response.data; // Returns { subcategories }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Async thunk for getting Units
export const fetchUnits = createAsyncThunk(
  "products/fetchUnits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/products/getunits");
      return response.data; // Returns { units }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for creating a product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/products", productData);
      return response.data; // Returns the created product
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Something went wrong while creating the product"
      );
    }
  }
);

// Async thunk for updating a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { _id, ...rest } = productData;
      const response = await axios.put(`/api/products/${_id}`, rest);
      return response.data; // Returns the updated product
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Something went wrong while updating the product"
      );
    }
  }
);

const initialState = {
  products: [],
  total: 0,
  page: 1,
  pages: 1,
  onlineCount: 0,
  offlineCount: 0,
  loading: false,
  error: null,
  categories: [],
  subcategories: [],
  units: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.onlineCount = action.payload.onlineCount;
        state.offlineCount = action.payload.offlineCount;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
      })
      // fetchSubcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.error = action.payload;
      })
      // fetchUnits
      .addCase(fetchUnits.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.error = action.payload;
      })
      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Option 1: add the newly created product to the list
        state.products.push(action.payload);
        state.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          // Check if the online status changed
          const previousOnline = state.products[index].online;
          state.products[index] = action.payload;
          if (
            typeof state.onlineCount === "number" &&
            typeof state.offlineCount === "number"
          ) {
            if (action.payload.online !== previousOnline) {
              if (action.payload.online) {
                state.onlineCount += 1;
                state.offlineCount -= 1;
              } else {
                state.onlineCount -= 1;
                state.offlineCount += 1;
              }
            }
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
