import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import { useParams } from "react-router-dom";

// Color for each status
const statusColors = {
  pending: "#f4c542",
  washing: "#409eff",
  drying: "#9b59b6",
  ironing: "#e67e22",
  ready: "#2ecc71",
  picked_up: "#7f8c8d",
};

export default function OrderDetailsPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);

  // Payment form states
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const [payRemark, setPayRemark] = useState("");

  useEffect(() => {
    loadOrder();
    API.getStatuses().then(setStatuses);
  }, []);

  async function loadOrder() {
    const data = await API.getOrder(id);
    setOrder(data);
  }

  // -----------------------------
  //  UPDATE STATUS
  // -----------------------------
  async function updateStatus(e) {
    const newStatusId = Number(e.target.value);

    try {
      await API.updateOrderStatus(id, newStatusId);
      loadOrder();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Status update failed!");
    }
  }

  // -----------------------------
  //  SUBMIT PAYMENT
  // -----------------------------
  async function submitPayment() {
    if (!payAmount || Number(payAmount) <= 0) {
      alert("กรุณาใส่ยอดเงินให้ถูกต้อง");
      return;
    }

    const payload = {
      order_id: Number(id),
      pay_datetime: new Date().toISOString(),
      method: payMethod,
      amount: Number(payAmount),
      remark: payRemark,
    };

    try {
      await API.addPayment(payload);
      alert("Payment added!");
      setPayAmount("");
      setPayMethod("cash");
      setPayRemark("");
      loadOrder(); // refresh
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Check console.");
    }
  }

  if (!order) return <h1>Loading...</h1>;

  // totals
  const totalAmount = order.items.reduce((s, i) => s + i.amount, 0);
  const totalPaid = order.payments.reduce((s, p) => s + p.amount, 0);
  const remaining = totalAmount - totalPaid;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order #{order.order_id}</h1>

      {/* CUSTOMER INFO */}
      <p>
        <b>Customer:</b> {order.customer.full_name} ({order.customer.phone})
      </p>

      {/* STATUS BADGE */}
      <p>
        <b>Status: </b>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: statusColors[order.status.status_name],
            color: "white",
            fontWeight: "bold",
            marginRight: "10px",
            textTransform: "capitalize",
          }}
        >
          {order.status.status_name}
        </span>

        {/* STATUS DROPDOWN */}
        <select
          value={order.status.status_id}
          onChange={updateStatus}
          style={{ padding: "6px" }}
        >
          {statuses.map((s) => (
            <option key={s.status_id} value={s.status_id}>
              {s.status_name}
            </option>
          ))}
        </select>
      </p>

      {/* ORDER DATES */}
      <p>
        <b>Dropoff:</b> {order.dropoff_datetime}
        <br />
        <b>Pickup Due:</b> {order.pickup_due_datetime}
        <br />
        <b>Notes:</b> {order.notes || "-"}
      </p>

      {/* ITEMS TABLE */}
      <h3>Items</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.item_id}>
              <td>{i.item_desc}</td>
              <td>{i.qty}</td>
              <td>{i.unit_price}</td>
              <td>{i.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <h4>Total Amount: {totalAmount} บาท</h4>
      <h4>Total Paid: {totalPaid} บาท</h4>
      <h4 style={{ color: remaining > 0 ? "red" : "green" }}>
        Remaining: {remaining} บาท
      </h4>

      {/* PAYMENTS TABLE */}
      <h3>Payments</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {order.payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.pay_datetime}</td>
              <td>{p.method}</td>
              <td>{p.amount}</td>
              <td>{p.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD PAYMENT */}
      <h3>Add Payment</h3>

      <label>Amount</label>
      <input
        type="number"
        className="form-control"
        value={payAmount}
        onChange={(e) => setPayAmount(e.target.value)}
      />

      <label style={{ marginTop: "10px" }}>Method</label>
      <select
        className="form-control"
        value={payMethod}
        onChange={(e) => setPayMethod(e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="transfer">Transfer</option>
        <option value="qr">QR</option>
      </select>

      <label style={{ marginTop: "10px" }}>Remark</label>
      <input
        type="text"
        className="form-control"
        value={payRemark}
        onChange={(e) => setPayRemark(e.target.value)}
      />

      <button
        className="btn btn-primary"
        style={{ marginTop: "15px" }}
        onClick={submitPayment}
      >
        Add Payment
      </button>
    </div>
  );
}
