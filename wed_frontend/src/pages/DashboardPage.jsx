import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer
} from "recharts";

const COLORS = ["#f1c40f", "#3498db", "#9b59b6", "#e67e22", "#2ecc71", "#7f8c8d"];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [revenue7, setRevenue7] = useState([]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.getSummary().then(setSummary);
    API.getOrdersByStatus().then(setOrdersByStatus);
    API.getRevenue7Days().then(setRevenue7);
    API.getOrders().then(setOrders);
  }, []);

  if (!summary) return <h2>Loading dashboard...</h2>;

  const pendingOrders = orders.filter((o) => o.status_id === 1);
  const today = new Date().toISOString().slice(0, 10);
  const todayPickup = orders.filter((o) => o.pickup_due_datetime.startsWith(today));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Overview</h1>

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Card title="Total Orders" value={summary.total_orders} />
        <Card title="Total Revenue" value={summary.total_revenue + " ฿"} />
        <Card title="Today Revenue" value={summary.today_revenue + " ฿"} />
        <Card title="Pending" value={summary.pending} />
        <Card title="Washing" value={summary.washing} />
        <Card title="Drying" value={summary.drying} />
        <Card title="Ironing" value={summary.ironing} />
        <Card title="Ready" value={summary.ready} />
        <Card title="Picked Up" value={summary.picked_up} />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", marginTop: "40px", gap: "40px" }}>
        {/* Bar Chart */}
        <div style={{ width: "45%", height: 300 }}>
          <h3>Orders by Status</h3>
          <ResponsiveContainer>
            <BarChart data={ordersByStatus}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ width: "45%", height: 300 }}>
          <h3>Status Distribution</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={ordersByStatus}
                dataKey="count"
                nameKey="status"
                outerRadius={110}
                label
              >
                {ordersByStatus.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ width: "100%", height: 300, marginTop: "40px" }}>
        <h3>Revenue (Last 7 Days)</h3>
        <ResponsiveContainer>
          <LineChart data={revenue7}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="amount" stroke="#2ecc71" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TABLES */}
      <h3 style={{ marginTop: "40px" }}>Pending Orders</h3>
      <TableOrders orders={pendingOrders} />

      <h3 style={{ marginTop: "40px" }}>Pickup Due Today</h3>
      <TableOrders orders={todayPickup} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "180px",
        textAlign: "center",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

function TableOrders({ orders }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Dropoff</th>
          <th>Pickup Due</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.order_id}>
            <td>{o.order_id}</td>
            <td>{o.customer.full_name}</td>
            <td>{o.status.status_name}</td>
            <td>{o.dropoff_datetime}</td>
            <td>{o.pickup_due_datetime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
