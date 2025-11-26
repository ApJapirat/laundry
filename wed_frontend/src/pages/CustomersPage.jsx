import { useEffect, useState } from "react";
import { API } from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.getCustomers().then(setCustomers);
  }, []);

  // filter
  const filtered = customers.filter((c) => {
    const t = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(t) ||
      c.phone.includes(t) ||
      c.address.toLowerCase().includes(t)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="page-title">Customers</h1>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search name / phone / address..."
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

      {/* TABLE WRAPPER CARD */}
      <div
        style={{
          background: "#15151e",
          borderRadius: "12px",
          border: "1px solid #262631",
          boxShadow: "0 18px 35px rgba(0,0,0,0.55)",
          padding: "10px",
        }}
      >
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr
              style={{
                background: "#1c1c27",
                color: "#8f8fa3",
                fontSize: "14px",
              }}
            >
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.customer_id}
                style={{
                  cursor: "pointer",
                  transition: "0.15s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#22222e")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td>{c.customer_id}</td>

                {/* name highlight คลิกได้ในอนาคต */}
                <td style={{ color: "#ffb000", fontWeight: 500 }}>
                  {c.full_name}
                </td>

                <td style={{ color: "#d1d5db" }}>{c.phone}</td>

                <td style={{ color: "#9ca3af" }}>{c.address}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
