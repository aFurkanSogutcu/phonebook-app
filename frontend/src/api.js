const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function fetchContacts() {
    // Önce gerçek backend'e dene
    try {
        const r = await fetch(`${API_BASE}/contacts`, { cache: "no-store" });
        if (!r.ok) throw new Error(`API ${r.status}`);
        return await r.json();
    } catch (_) {
        // Backend kapalıysa mock dosyasına düş
        const mr = await fetch("/mock/contacts.json", { cache: "no-store" });
        return await mr.json();
    }
}

export function getApiBase() {
    return API_BASE;
}
