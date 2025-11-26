import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">Laundry Admin</h1>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/customers"
            end   // 👈 สำคัญ ตรงนี้
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Customers
          </NavLink>

          <NavLink
            to="/customers/new"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Add Customer
          </NavLink>

          <NavLink
            to="/orders"
            end   // 👈 ตรงนี้ด้วย
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/orders/new"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            New Order
          </NavLink>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
