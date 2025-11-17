const API_BASE = "http://127.0.0.1:8000";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

async function apiPost(path, payload) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}

async function apiPut(path, payload) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed`);
  return res.json();
}

export const API = {
  // customers
  getCustomers: () => apiGet("/customers"),
  addCustomer: (data) => apiPost("/customers", data),

  // services & statuses
  getServices: () => apiGet("/services"),
  getStatuses: () => apiGet("/statuses"),

  // orders
  getOrders: () => apiGet("/orders"),
  getOrder: (id) => apiGet(`/orders/${id}`),
  addOrder: (data) => apiPost("/orders", data),

  updateOrderStatus: (id, status_id) =>
    apiPut(`/orders/${id}/status`, { status_id }),

  // payments
  addPayment: (data) => apiPost("/payments", data),

  // ORDER ITEMS
  addOrderItem: (data) => apiPost("/order_items", data),

  // NEW
  getSummary: () => apiGet("/stats/summary"),
  getOrdersByStatus: () => apiGet("/stats/orders_by_status"),
  getRevenue7Days: () => apiGet("/stats/revenue_7_days"),
};
