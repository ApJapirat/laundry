import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Laundry Admin</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/customers/new">Add Customer</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/orders/new">New Order</Link>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
