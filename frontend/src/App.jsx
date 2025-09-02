import React, { useEffect, useState } from "react";
import { fetchContacts } from "./api";

export default function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts().then(setContacts).catch(console.error);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>📇 Phonebook</h1>

      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>ID</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.id}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
