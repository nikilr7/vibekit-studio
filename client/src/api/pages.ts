import type { PageContent } from "../types/page";

const API_BASE = "/.netlify/functions";

export interface Page {
  id: string;
  user_id: string;
  title: string;
  content: PageContent;
  status: "draft" | "published";
  theme: string;
  slug: string;
  view_count: number;
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

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
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

// Retry mechanism for API calls
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.message.includes("HTTP 4")) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

export const pagesAPI = {
  async list(): Promise<Page[]> {
    return retryRequest(async () => {
      const response = await fetch(`${API_BASE}/pages`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    });
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
    return retryRequest(async () => {
      const payload = { id, ...data };
      console.log("📤 Sending update request:", payload);

      const response = await fetch(`${API_BASE}/pages-update`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Update successful:", result);
      return result.page || result;
    });
  },

  async publish(id: string): Promise<Page> {
    return retryRequest(async () => {
      const payload = { id };
      console.log("📤 Sending publish request:", payload);

      const response = await fetch(`${API_BASE}/pages-publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Publish successful:", result);
      return result.page || result;
    });
  },

  async unpublish(id: string): Promise<Page> {
    return retryRequest(async () => {
      const payload = { id };
      console.log("📤 Sending unpublish request:", payload);

      const response = await fetch(`${API_BASE}/pages-unpublish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Unpublish successful:", result);
      return result.page || result;
    });
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

  async getSubmissions(pageId: string): Promise<ContactSubmission[]> {
    const response = await fetch(
      `${API_BASE}/pages-submissions?pageId=${pageId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.submissions || [];
  },
};
