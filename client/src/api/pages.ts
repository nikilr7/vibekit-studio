const API_BASE = "/.netlify/functions";

export interface Page {
  id: string;
  user_id: string;
  title: string;
  content: Record<string, any>;
  status: "draft" | "published";
  theme: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePageResponse {
  id: string;
  title: string;
  slug: string;
  status: string;
  theme: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const pagesAPI = {
  async list(): Promise<Page[]> {
    const response = await fetch(`${API_BASE}/pages`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async create(): Promise<CreatePageResponse> {
    const response = await fetch(`${API_BASE}/pages-create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },

  async get(id: string): Promise<Page> {
    const response = await fetch(`${API_BASE}/pages-get?id=${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async update(id: string, data: Partial<Page>): Promise<Page> {
    const response = await fetch(`${API_BASE}/pages-update`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...data }),
    });
    return handleResponse(response);
  },

  async publish(id: string): Promise<Page> {
    const response = await fetch(`${API_BASE}/pages-publish`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },

  async unpublish(id: string): Promise<Page> {
    const response = await fetch(`${API_BASE}/pages-unpublish`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },

  async duplicate(id: string): Promise<CreatePageResponse> {
    const response = await fetch(`${API_BASE}/pages-duplicate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/pages-delete`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },
};
