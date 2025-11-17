import { useState } from "react";
import { API } from "../services/api";

export default function AddCustomerPage() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    line_id: "",
    address: "",
  });

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit() {
    API.addCustomer(form).then(() => {
      alert("Customer added!");
    });
  }

  return (
    <>
      <h1 className="page-title">Add Customer</h1>

      <div className="form-group">
        <label>Name</label>
        <input name="full_name" onChange={update} />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input name="phone" onChange={update} />
      </div>

      <div className="form-group">
        <label>Line ID</label>
        <input name="line_id" onChange={update} />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input name="address" onChange={update} />
      </div>

      <button className="btn" onClick={submit}>Create</button>
    </>
  );
}
