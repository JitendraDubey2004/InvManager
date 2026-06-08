import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout & Dashboard
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

// Products
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";

// Customers
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";

// Orders
import Orders from "./pages/Orders";
import OrderForm from "./pages/OrderForm";
import OrderDetails from "./pages/OrderDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Product Routes */}
          <Route path="products" element={<Products />}>
            <Route path="new"       element={<ProductForm />} />
            <Route path="edit/:id"  element={<ProductForm />} />
          </Route>

          
          {/* Customer Routes */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          
          {/* Order Routes */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}