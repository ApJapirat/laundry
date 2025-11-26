import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import { useParams } from "react-router-dom";

// สีของแต่ละ status
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

  // payment form
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

  // เปลี่ยนสถานะ
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

  // บันทึกการจ่ายเงิน
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
      loadOrder();
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

  const statusName = order.status.status_name;
  const statusColor = statusColors[statusName] || "#6b7280";

  // style การ์ดแต่ละ block ให้เข้าธีม
  const sectionCardStyle = {
    background: "#15151e",
    borderRadius: "12px",
    border: "1px solid #262631",
    boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
    padding: "16px 20px 18px",
    marginBottom: "20px",
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* หัวข้อ + แถวบน */}
      <h1 className="page-title" style={{ marginBottom: 8 }}>
        Order #{order.order_id}
      </h1>

      <div
        style={{
          ...sectionCardStyle,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* แถวลูกค้า */}
        <div style={{ fontSize: 14, color: "#cbd5f5" }}>
          <strong>Customer:</strong>{" "}
          {order.customer.full_name} ({order.customer.phone})
        </div>

        {/* แถวสถานะ + dropdown */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 14, color: "#cbd5f5" }}>
            <strong>Status:</strong>
          </span>

          <span
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              background: statusColor,
              color: "#0b1120",
              fontWeight: 700,
              textTransform: "capitalize",
              fontSize: 13,
            }}
          >
            {statusName}
          </span>

          <select
            value={order.status.status_id}
            onChange={updateStatus}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "1px solid #374151",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 13,
              marginLeft: "auto",
              minWidth: 140,
            }}
          >
            {statuses.map((s) => (
              <option key={s.status_id} value={s.status_id}>
                {s.status_name}
              </option>
            ))}
          </select>
        </div>

        {/* วันเวลา + note */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 10,
            fontSize: 13,
            color: "#9ca3af",
          }}
        >
          <span>
            <strong>Dropoff:</strong> {order.dropoff_datetime}
          </span>
          <span>
            <strong>Pickup Due:</strong> {order.pickup_due_datetime}
          </span>
          <span>
            <strong>Notes:</strong> {order.notes || "-"}
          </span>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={sectionCardStyle}>
        <h3 style={{ marginBottom: 10 }}>Items</h3>
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

        {/* totals ด้านล่างตาราง */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 10,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#e5e7eb" }}>
            <strong>Total:</strong> {totalAmount} บาท
          </span>
          <span style={{ color: "#a5b4fc" }}>
            <strong>Paid:</strong> {totalPaid} บาท
          </span>
          <span
            style={{
              color: remaining > 0 ? "#f97373" : remaining < 0 ? "#4ade80" : "#facc15",
              fontWeight: 600,
            }}
          >
            <strong>Remaining:</strong> {remaining} บาท
          </span>
        </div>
      </div>

      {/* PAYMENTS LIST */}
      <div style={sectionCardStyle}>
        <h3 style={{ marginBottom: 10 }}>Payments</h3>
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
      </div>

      {/* ADD PAYMENT FORM */}
      <div style={sectionCardStyle}>
        <h3 style={{ marginBottom: 12 }}>Add Payment</h3>

        {/* แถวฟอร์ม 3 ช่องบนจอกว้าง */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.8fr 1.4fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Amount</label>
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Method</label>
            <select
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="qr">QR</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Remark</label>
            <input
              type="text"
              value={payRemark}
              onChange={(e) => setPayRemark(e.target.value)}
              placeholder="เช่น จ่ายครบ, มัดจำ, โอน KBank ฯลฯ"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button className="btn" onClick={submitPayment}>
            Add Payment
          </button>
        </div>
      </div>
    </div>
  );
}
