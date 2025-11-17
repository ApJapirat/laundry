import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.getOrders().then(setOrders);
  }, []);

  return (
    <>
      <h1 className="page-title">Orders</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Customer</th><th>Status</th><th>Dropoff</th><th>Due</th><th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>{o.customer.full_name}</td>
              <td>{o.status.status_name}</td>
              <td>{o.dropoff_datetime}</td>
              <td>{o.pickup_due_datetime}</td>
              <td><Link to={`/orders/${o.order_id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
