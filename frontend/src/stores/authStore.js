import { writable } from "svelte/store";

export const authStore = writable({
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
});

export const setUser = (user, role, token) => {
  authStore.set({
      token,
      user,
      role,
      isAuthenticated: true,
  });
};


export const clearAuth = () => {
  document.cookie = "authToken=; path=/; max-age=0;"; // Clear token in cookies

  authStore.set({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
  });
}