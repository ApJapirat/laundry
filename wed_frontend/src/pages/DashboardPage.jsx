import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ==== สีสไตล์ Monkeytype ส้มเข้ม ====
const MT_COLORS = {
  bar: "#ffb000",
  line: "#ffb000",
  dot: "#ffe06e",
  grid: "#1a1c23",
  tooltipBg: "#14161a",
  tooltipBorder: "#1f2127",
  pie: ["#ffb000", "#ffc94a", "#ffe06e", "#ffac33", "#ff8a3d", "#ffd24a"],
};

// สไตล์กรอบการ์ดของกราฟ (ใช้เฉพาะในหน้านี้ ไม่ไปยุ่งหน้าอื่น)
const chartCardStyle = {
  background: "#15151e",
  borderRadius: "10px",
  border: "1px solid #262631",
  padding: "16px 18px",
  boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
};

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
  const todayPickup = orders.filter((o) =>
    o.pickup_due_datetime.startsWith(today)
  );

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
        <div style={{ width: "45%" }}>
          <div style={chartCardStyle}>
            <h3 style={{ marginBottom: 10, color: "#8f95a2", fontSize: 14 }}>
              Orders by Status
            </h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={ordersByStatus}>
                  <CartesianGrid
                    stroke={MT_COLORS.grid}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="status"
                    tick={{ fill: "#8f95a2", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#8f95a2", fontSize: 11 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: MT_COLORS.tooltipBg,
                      border: `1px solid ${MT_COLORS.tooltipBorder}`,
                      borderRadius: 8,
                      color: "#f9fafb",
                    }}
                    labelStyle={{ color: "#f9fafb" }}
                    itemStyle={{ color: "#f9fafb" }}
                  />

                  <Bar
                    dataKey="count"
                    fill={MT_COLORS.bar}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ width: "45%" }}>
          <div style={chartCardStyle}>
            <h3 style={{ marginBottom: 10, color: "#8f95a2", fontSize: 14 }}>
              Status Distribution
            </h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={110}
                    paddingAngle={3}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {ordersByStatus.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={MT_COLORS.pie[idx % MT_COLORS.pie.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: MT_COLORS.tooltipBg,
                      border: `1px solid ${MT_COLORS.tooltipBorder}`,
                      borderRadius: 8,
                      color: "#f9fafb",
                    }}
                    labelStyle={{ color: "#f9fafb" }}
                    itemStyle={{ color: "#f9fafb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ width: "100%", marginTop: "40px" }}>
        <div style={chartCardStyle}>
          <h3 style={{ marginBottom: 10, color: "#8f95a2", fontSize: 14 }}>
            Revenue (Last 7 Days)
          </h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={revenue7}>
                <CartesianGrid
                  stroke={MT_COLORS.grid}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8f95a2", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#8f95a2", fontSize: 11 }} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: MT_COLORS.tooltipBg,
                    border: `1px solid ${MT_COLORS.tooltipBorder}`,
                    borderRadius: 8,
                    color: "#f9fafb",
                  }}
                  labelStyle={{ color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                />

                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={MT_COLORS.line}
                  strokeWidth={2.2}
                  dot={{
                    r: 2,
                    stroke: MT_COLORS.dot,
                    strokeWidth: 1,
                    fill: MT_COLORS.dot,
                  }}
                  activeDot={{
                    r: 4,
                    fill: MT_COLORS.dot,
                    stroke: MT_COLORS.dot,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLES */}
      <h3 style={{ marginTop: "40px" }}>Pending Orders</h3>
      <TableOrders orders={pendingOrders} />

      <h3 style={{ marginTop: "40px" }}>Pickup Due Today</h3>
      <TableOrders orders={todayPickup} />
    </div>
  );
}

// ==== Card & Table (แบบเดิม) ====
function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#15151e",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
        width: "180px",
        textAlign: "center",
        border: "1px solid #262631",
        color: "#e5e5ea",
      }}
    >
      <h4 style={{ marginBottom: 8, color: "#8f95a2" }}>{title}</h4>
      <h2 style={{ margin: 0, color: "#ffb000" }}>{value}</h2>
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
