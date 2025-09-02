import React, { useEffect, useState } from "react";
import { fetchContacts, getApiBase } from "./api";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (e) {
        setErr(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>📇 Phonebook</h1>
      <p style={{ color: "#666" }}>
        Read-only demo — Redis → FastAPI → React (backend yoksa mock’a düşer).
      </p>

      <div style={{ marginTop: 12, padding: 10, background: "#f7f7f7", borderRadius: 8 }}>
        <strong>API BASE:</strong> {getApiBase()}
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}

      {!loading && !err && (
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
      )}
    </div>
  );
}
