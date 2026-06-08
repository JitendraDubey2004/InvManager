import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

// Fetch All Products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch products",
        }
      );
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/products",
        productData
      );

      toast.success("Product created successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to create product"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create product",
        }
      );
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/products/${id}`,
        data
      );

      toast.success("Product updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update product"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update product",
        }
      );
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/products/${id}`);

      toast.success("Product deleted successfully");
      return id;
    } catch (error) {
      toast.error("Failed to delete product");

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete product",
        }
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = state.items.filter(
          (product) => product.id !== action.payload
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });
  },
});

export default productSlice.reducer;