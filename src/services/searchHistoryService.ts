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

export const searchHistoryService = {
  async getAll(): Promise<IHistoryItem[]> {
    const res = await fetch(`${API_BASE_URL}/search-history/`, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async add(data: { search_text?: string; cocktail?: number }): Promise<void> {
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