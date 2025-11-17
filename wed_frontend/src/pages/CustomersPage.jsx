import { useEffect, useState } from "react";
import { API } from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.getCustomers().then(setCustomers);
  }, []);

  return (
    <>
      <h1 className="page-title">Customers</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Address</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(c => (
            <tr key={c.customer_id}>
              <td>{c.customer_id}</td>
              <td>{c.full_name}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
