import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddOrderPage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [dropoff_datetime, setDropoff] = useState("");
  const [pickup_due_datetime, setPickupDue] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([{ service_id: "", qty: 1 }]);

  // Load customers + services
  useEffect(() => {
    API.getCustomers().then(setCustomers);
    API.getServices().then(setServices);
  }, []);

  const addItemRow = () => {
    setItems([...items, { service_id: "", qty: 1 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  async function submitOrder(e) {
    e.preventDefault();

    try {
      // 1) Create order
      const order = await API.addOrder({
        customer_id: selectedCustomerId,
        status_id: 1, // pending
        dropoff_datetime,
        pickup_due_datetime,
        notes,
      });

      // 2) Add items
      for (const item of items) {
        const service = services.find(
          (s) => s.service_id === item.service_id
        );
        if (!service) continue;

        await API.addOrderItem({
          order_id: order.order_id,
          service_id: item.service_id,
          item_desc: service.service_name,
          qty: Number(item.qty),
          unit_price: Number(service.base_price),
        });
      }

      alert("Order created successfully!");
      navigate(`/orders/${order.order_id}`);
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Order failed");
    }
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 20 }}>New Order</h2>

      <form onSubmit={submitOrder}>
        {/* CARD ครอบทั้งฟอร์ม */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#15151e",
            borderRadius: "12px",
            border: "1px solid #262631",
            boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
            padding: "20px 24px 24px",
          }}
        >
          {/* กลุ่ม Customer + Dates + Notes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* CUSTOMER */}
            <div>
              <label className="form-label">
                Customer <span style={{ color: "#f97316" }}>*</span>
              </label>
              <select
                value={selectedCustomerId || ""}
                onChange={(e) =>
                  setSelectedCustomerId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">-- select --</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATES 2 คอลัมน์ */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label className="form-label">
                  Dropoff datetime <span style={{ color: "#f97316" }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={dropoff_datetime}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Pickup due <span style={{ color: "#f97316" }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={pickup_due_datetime}
                  onChange={(e) => setPickupDue(e.target.value)}
                />
              </div>
            </div>

            {/* NOTES */}
            <div>
              <label className="form-label">
                Notes{" "}
                <span style={{ color: "#6b7280", fontSize: 12 }}>
                  (optional)
                </span>
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เพิ่มคำอธิบายเล็กน้อย เช่น ขอซักด่วน / แขวนเสื้อ"
              />
            </div>
          </div>

          {/* กลุ่ม ITEMS */}
          <div
            style={{
              borderRadius: "10px",
              border: "1px solid #262631",
              padding: "16px 18px",
              background: "#111827",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#e5e7eb",
                  letterSpacing: "0.02em",
                }}
              >
                Items
              </h3>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                เลือกอย่างน้อย 1 รายการ
              </span>
            </div>

            {items.map((it, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <select
                  style={{ flex: 1 }}
                  value={it.service_id}
                  onChange={(e) =>
                    setItems(
                      items.map((x, i) =>
                        i === index
                          ? { ...x, service_id: Number(e.target.value) }
                          : x
                      )
                    )
                  }
                >
                  <option value="">-- select service --</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.service_name} ({s.base_price} บาท)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) =>
                    setItems(
                      items.map((x, i) =>
                        i === index
                          ? { ...x, qty: Number(e.target.value) }
                          : x
                      )
                    )
                  }
                  style={{ width: "80px" }}
                />

                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  disabled={items.length === 1}
                  style={{
                    background: "#111827",
                    color: "#e5e7eb",
                    borderRadius: "999px",
                    border: "1px solid #374151",
                    padding: "6px 10px",
                    fontSize: "12px",
                    opacity: items.length === 1 ? 0.4 : 1,
                    cursor:
                      items.length === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* ปุ่มล่าง */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              ตรวจสอบให้ครบก่อนกดสร้างออเดอร์นะฮะ ✨
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={addItemRow}
                style={{
                  background: "#ff8a3d",
                  borderRadius: "999px",
                  border: "none",
                  padding: "8px 16px",
                  fontWeight: 600,
                }}
              >
                Add another item
              </button>

              <button
                type="submit"
                style={{
                  background: "#ffb000",
                  borderRadius: "999px",
                  border: "none",
                  padding: "8px 20px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
