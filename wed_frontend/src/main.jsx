import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import DashboardLayout from "./layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import OrdersPage from "./pages/OrdersPage";
import AddOrderPage from "./pages/AddOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<DashboardLayout />}>

          {/* Redirect root → dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Pages */}
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/new" element={<AddCustomerPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<AddOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
