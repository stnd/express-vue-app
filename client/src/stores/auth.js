import { defineStore } from "pinia";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRoles: (state) => state.user?.roles?.map((role) => role.name) || [],
    userPermissions: (state) => {
      if (!state.user?.roles) return [];
      return state.user.roles.reduce((perms, role) => {
        return [...perms, ...(role.permissions || [])];
      }, []);
    },
    hasRole: (state) => (role) => {
      return state.user?.roles?.some((r) => r.name === role) || false;
    },
    hasAnyRole: (state) => (roles) => {
      return roles.some((role) =>
        state.user?.roles?.some((r) => r.name === role)
      );
    },
    hasPermission: (state) => (permission) => {
      const permissions =
        state.user?.roles?.reduce((perms, role) => {
          return [...perms, ...(role.permissions || [])];
        }, []) || [];
      return permissions.includes(permission);
    },
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post("/api/auth/login", credentials);
        this.user = response.data.user;

        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || "Login failed";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post("/api/auth/register", userData);
        return { success: true, message: response.data.message };
      } catch (error) {
        this.error = error.response?.data?.error || "Registration failed";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await axios.post("/api/auth/logout");
        this.user = null;
      } catch (error) {
        console.error("Logout error:", error);
        this.user = null; // Clear user anyway
      }
    },

    async checkAuth() {
      try {
        const response = await axios.get("/api/auth/me");
        this.user = response.data.user;
        return true;
      } catch (error) {
        this.user = null;
        return false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
