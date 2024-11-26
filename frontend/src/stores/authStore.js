import { writable } from "svelte/store";

export const authStore = writable({
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
});
