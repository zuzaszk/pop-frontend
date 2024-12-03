import { writable } from "svelte/store";

export const authStore = writable({
  user: null,
  role: null,
  isAuthenticated: false,
});

export const setUser = (user, role) => {
  authStore.set({
    user,
    role,
    isAuthenticated: true,
  });
};

export const clearAuth = () => {
  authStore.set({
    user: null,
    role: null,
    isAuthenticated: false,
  });
};
