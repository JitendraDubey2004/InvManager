import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

// Fetch All Orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch orders",
        }
      );
    }
  }
);

// Fetch Single Order
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch order details");

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch order",
        }
      );
    }
  }
);

// Create Order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/orders",
        orderData
      );

      toast.success("Order created successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to create order"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create order",
        }
      );
    }
  }
);

// Update Order
export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/orders/${id}`,
        data
      );

      toast.success("Order updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update order"
      );

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update order",
        }
      );
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/orders/${id}`);

      toast.success(`Order #${id} deleted successfully`);
      return id;
    } catch (error) {
      toast.error("Failed to delete order");

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete order",
        }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    items: [],
    currentOrder: null,
    status: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Fetch Single Order
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.items.findIndex(
          (order) => order.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.id
        ) {
          state.currentOrder = action.payload;
        }
      })

      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = state.items.filter(
          (order) => order.id !== action.payload
        );

        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload
        ) {
          state.currentOrder = null;
        }
      })

      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      });
  },
});

export default orderSlice.reducer;