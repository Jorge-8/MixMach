import { API_BASE_URL } from "@/constants";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export interface IHistoryItem {
  id: number;
  search_text: string | null;
  cocktail: number | null;
  cocktail_name: string | null;
  created_at: string;
}

let lastAdded = { text: "", time: 0 };

export const searchHistoryService = {
  async getAll(): Promise<IHistoryItem[]> {
    const res = await fetch(`${API_BASE_URL}/search-history/`, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async add(data: { search_text?: string; cocktail?: number }): Promise<void> {
    const key = data.search_text || String(data.cocktail);
    const now = Date.now();

    if (lastAdded.text === key && now - lastAdded.time < 2000) return;
    lastAdded = { text: key, time: now };

    await fetch(`${API_BASE_URL}/search-history/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
  },

  async clear(): Promise<void> {
    await fetch(`${API_BASE_URL}/search-history/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },
};