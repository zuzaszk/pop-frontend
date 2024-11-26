import { get } from "svelte/store";
import { authStore } from "../stores/auth";

export async function apiFetch(url, options = {}) {
  const { token } = get(authStore);

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized access
    authStore.set({ token: null, user: null, isAuthenticated: false });
    sessionStorage.clear();
    throw new Error("Unauthorized. Please log in again.");
  }

  return response.json();
}
