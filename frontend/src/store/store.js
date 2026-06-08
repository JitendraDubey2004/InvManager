import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice'; // Un-commented
import orderReducer from './slices/orderSlice';       // Un-commented

export const store = configureStore({
  reducer: {
    products: productReducer,
    customers: customerReducer, // Added
    orders: orderReducer,       // Added
  },
});