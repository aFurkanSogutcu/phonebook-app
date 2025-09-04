import { useEffect, useState } from "react";
// frontend/src/main.jsx ve frontend/src/App.jsx (JSX olan diğer dosyalar)
import React from "react";

const API = "/api"; // Vite proxy yok; Nginx yönlendirecek

export default function App() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    const res = await fetch(`${API}/contacts`);
    setList(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    if (res.ok) {
      setName(""); setPhone(""); load();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.detail || "Eklenemedi");
    }
  };

  const delOne = async (n) => {
    await fetch(`${API}/contacts/${encodeURIComponent(n)}`, { method: "DELETE" });
    load();
  };

  const clearAll = async () => {
    if (!confirm("Tüm rehberi silmek istediğine emin misin?")) return;
    await fetch(`${API}/contacts`, { method: "DELETE" });
    load();
  };

  return (
    <div style={{ maxWidth: 680, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Telefon Rehberi</h1>

      <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit">Ekle</button>
        <button type="button" onClick={clearAll} style={{ marginLeft: "auto" }}>
          Tümünü Sil
        </button>
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th align="left">İsim</th>
            <th align="left">Telefon</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.name} style={{ borderTop: "1px solid #ddd" }}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td align="right">
                <button onClick={() => delOne(c.name)}>Sil</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr><td colSpan="3" align="center" style={{ padding: 24, color: "#777" }}>
              Kayıt yok
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

}
// import React, { useEffect, useState } from "react";
// import { fetchContacts } from "./api";

// export default function App() {
//   const [contacts, setContacts] = useState([]);

//   useEffect(() => {
//     fetchContacts().then(setContacts).catch(console.error);
//   }, []);

//   return (
//     <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
//       <h1>📇 Phonebook</h1>

//       <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>ID</th>
//             <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Name</th>
//             <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Phone</th>
//           </tr>
//         </thead>
//         <tbody>
//           {contacts.map((c) => (
//             <tr key={c.id}>
//               <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.id}</td>
//               <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.name}</td>
//               <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{c.phone}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
