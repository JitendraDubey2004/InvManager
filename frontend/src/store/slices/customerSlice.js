import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

// Fetch All Customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/customers");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch customers",
        }
      );
    }
  }
);

// Create Customer
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/customers",
        customerData
      );

      toast.success("Customer created successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to create customer"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create customer",
        }
      );
    }
  }
);

// Update Customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/customers/${id}`,
        data
      );

      toast.success("Customer updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update customer"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update customer",
        }
      );
    }
  }
);

// Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/customers/${id}`);

      toast.success("Customer deleted successfully");
      return id;
    } catch (error) {
      toast.error("Failed to delete customer");

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete customer",
        }
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Something went wrong";
      })

      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })

      .addCase(createCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.items.findIndex(
          (customer) => customer.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = state.items.filter(
          (customer) => customer.id !== action.payload
        );
      })

      .addCase(deleteCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });
  },
});

export default customerSlice.reducer;