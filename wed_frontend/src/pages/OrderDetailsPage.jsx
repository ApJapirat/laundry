import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../services/api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.getOrderDetails(id).then(setOrder);
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
      <h1 className="page-title">Order #{id}</h1>

      <p><b>Customer:</b> {order.customer.full_name}</p>

      <h3>Items</h3>
      <ul>
        {order.items.map(i => (
          <li key={i.item_id}>
            {i.qty}x {i.item_desc} — ฿{i.amount}
          </li>
        ))}
      </ul>

      <h3>Payments</h3>
      <ul>
        {order.payments.map(p => (
          <li key={p.payment_id}>
            {p.method} — ฿{p.amount}
          </li>
        ))}
      </ul>
    </>
  );
}
