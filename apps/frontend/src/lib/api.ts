const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);

    // Configura JSON por padrao a menos que mandem FormData (ex: multipart)
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // Injeta Token de Segurança Automaticamente na sessão local ou Cookies (NextSSR)
    let token = null;

    if (typeof window !== "undefined") {
      // Estamos no Client-Side
      token = localStorage.getItem("vitta_token");
    } else {
      // Estamos no Server-Side
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = cookies();
        token = cookieStore.get("vitta_token")?.value;
      } catch (e) {
        // Falha silenciosa caso next/headers não suporte o contexto
      }
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || "Ocorreu um erro na requisição à API Vitta.", { cause: response.status });
    }

    return { response, data };
  },

  async get(endpoint: string, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: "GET" });
  },
  async post(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });
  },
  async put(endpoint: string, body: any, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) });
  },
  async delete(endpoint: string, options?: RequestInit) {
    return this.fetch(endpoint, { ...options, method: "DELETE" });
  }
};
