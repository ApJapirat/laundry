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
      // ถ้าอยากเคลียร์ฟอร์มหลังสร้างเสร็จ
      setForm({
        full_name: "",
        phone: "",
        line_id: "",
        address: "",
      });
    });
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 className="page-title">Add Customer</h1>

      {/* การ์ดกลางจอเหมือนหน้า New Order */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#15151e",
          borderRadius: "12px",
          border: "1px solid #262631",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
          padding: "20px 24px 24px",
        }}
      >
        {/* กล่องฟอร์มเรียงลงมา */}
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div className="form-group">
            <label className="form-label">
              Name <span style={{ color: "#f97316" }}>*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={update}
              placeholder="ชื่อลูกค้า"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone <span style={{ color: "#f97316" }}>*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="เช่น 08x-xxx-xxxx"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Line ID{" "}
              <span style={{ fontSize: 12, color: "#9ca3af" }}>(optional)</span>
            </label>
            <input
              name="line_id"
              value={form.line_id}
              onChange={update}
              placeholder="Line ID (ถ้ามี)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Address{" "}
              <span style={{ fontSize: 12, color: "#9ca3af" }}>(optional)</span>
            </label>
            <input
              name="address"
              value={form.address}
              onChange={update}
              placeholder="ที่อยู่สำหรับรับ–ส่งผ้า"
            />
          </div>
        </div>

        {/* แถวปุ่มด้านล่าง */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            กรอกชื่อ + เบอร์ให้ครบก่อนกดสร้างนะฮะ ✨
          </span>

          <button className="btn" onClick={submit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
