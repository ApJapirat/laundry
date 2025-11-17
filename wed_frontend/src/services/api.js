const API_BASE = "http://127.0.0.1:8000";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  return res.json();
}

async function apiPost(path, payload) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export const API = {
  getCustomers: () => apiGet("/customers"),
  addCustomer: (data) => apiPost("/customers", data),

  getOrders: () => apiGet("/orders"),
  addOrder: (data) => apiPost("/orders", data),

  getOrderDetails: (id) => apiGet(`/orders/${id}`),

  getStatuses: () => apiGet("/statuses"),
  getServices: () => apiGet("/services"),
};
