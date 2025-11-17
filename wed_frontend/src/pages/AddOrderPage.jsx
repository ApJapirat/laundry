import { useEffect, useState } from "react";
import { API } from "../services/api";

export default function AddOrderPage() {
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    status_id: "",
    dropoff_datetime: "",
    pickup_due_datetime: "",
  });

  useEffect(() => {
    API.getCustomers().then(setCustomers);
    API.getStatuses().then(setStatuses);
  }, []);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit() {
    API.addOrder(form).then(() => alert("Order created!"));
  }

  return (
    <>
      <h1 className="page-title">New Order</h1>

      <div className="form-group">
        <label>Customer</label>
        <select name="customer_id" onChange={update}>
          <option></option>
          {customers.map(c => (
            <option key={c.customer_id} value={c.customer_id}>
              {c.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select name="status_id" onChange={update}>
          <option></option>
          {statuses.map(s => (
            <option key={s.status_id} value={s.status_id}>
              {s.status_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dropoff Date</label>
        <input type="datetime-local" name="dropoff_datetime" onChange={update} />
      </div>

      <div className="form-group">
        <label>Pickup Due</label>
        <input type="datetime-local" name="pickup_due_datetime" onChange={update} />
      </div>

      <button className="btn" onClick={submit}>Create Order</button>
    </>
  );
}
