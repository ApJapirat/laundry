import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../services/api";

const statusColors = {
  pending: "#f4c542",
  washing: "#409eff",
  drying: "#9b59b6",
  ironing: "#e67e22",
  ready: "#2ecc71",
  picked_up: "#7f8c8d",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.getOrders().then(setOrders).catch(console.error);
  }, []);

  // Filter แบบ real-time
  const filtered = orders.filter((o) => {
    const t = search.toLowerCase();
    return (
      o.customer.full_name.toLowerCase().includes(t) ||
      o.status.status_name.toLowerCase().includes(t) ||
      o.dropoff_datetime.includes(t) ||
      o.pickup_due_datetime.includes(t)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="page-title">Orders</h1>

      {/* Search */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search name / status / date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "#1b1b26",
            border: "1px solid #2d2d3a",
            color: "#f2f2f7",
          }}
        />
      </div>

      {/* Table wrapper */}
      <div
        style={{
          background: "#15151e",
          borderRadius: "12px",
          border: "1px solid #262631",
          boxShadow: "0 18px 35px rgba(0,0,0,0.55)",
          padding: "10px",
        }}
      >
        <table className="table">
          <thead>
            <tr style={{ background: "#1c1c27", color: "#8f8fa3" }}>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Dropoff</th>
              <th>Due</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.order_id}
                style={{ transition: "0.15s" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#22222e")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td>{o.order_id}</td>

                {/* Customer Name */}
                <td style={{ color: "#ffb000", fontWeight: 500 }}>
                  {o.customer.full_name}
                </td>

                {/* Status Badge */}
                <td>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: statusColors[o.status.status_name],
                      color: "white",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    {o.status.status_name}
                  </span>
                </td>

                {/* Dropoff */}
                <td style={{ color: "#d1d5db" }}>
                  {o.dropoff_datetime.replace("T", " ")}
                </td>

                {/* Due */}
                <td style={{ color: "#9ca3af" }}>
                  {o.pickup_due_datetime.replace("T", " ")}
                </td>

                {/* View button */}
                <td>
                  <Link
                    to={`/orders/${o.order_id}`}
                    style={{
                      color: "#ff8a3d",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 20, textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
