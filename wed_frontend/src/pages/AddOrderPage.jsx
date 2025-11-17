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

  const [items, setItems] = useState([
    { service_id: "", qty: 1 },
  ]);

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

  // ⭐ MAIN SUBMIT — FIXED
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

      console.log("Order created:", order);

      // 2) Add items
      for (const item of items) {
        const service = services.find(
          (s) => s.service_id === item.service_id
        );

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
    <div>
      <h2>New Order</h2>

      <form onSubmit={submitOrder}>
        {/* CUSTOMER */}
        <label>Customer</label>
        <select
          value={selectedCustomerId || ""}
          onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
        >
          <option value="">-- select --</option>
          {customers.map((c) => (
            <option key={c.customer_id} value={c.customer_id}>
              {c.full_name}
            </option>
          ))}
        </select>

        {/* DROPOFF */}
        <label>Dropoff datetime</label>
        <input
          type="datetime-local"
          value={dropoff_datetime}
          onChange={(e) => setDropoff(e.target.value)}
        />

        {/* PICKUP */}
        <label>Pickup due</label>
        <input
          type="datetime-local"
          value={pickup_due_datetime}
          onChange={(e) => setPickupDue(e.target.value)}
        />

        {/* NOTES */}
        <label>Notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* ITEMS */}
        <h3>Items</h3>
        {items.map((it, index) => (
          <div key={index}>
            <select
              value={it.service_id}
              onChange={(e) =>
                setItems(
                  items.map((x, i) =>
                    i === index ? { ...x, service_id: Number(e.target.value) } : x
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
              value={it.qty}
              onChange={(e) =>
                setItems(
                  items.map((x, i) =>
                    i === index ? { ...x, qty: Number(e.target.value) } : x
                  )
                )
              }
            />

            <button type="button" onClick={() => removeItemRow(index)}>
              X
            </button>
          </div>
        ))}

        <button type="button" onClick={addItemRow}>Add another item</button>

        <br />
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
}
