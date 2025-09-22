import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Import views
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Dashboard from "@/views/Dashboard.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import ManagerPanel from "@/views/ManagerPanel.vue";
import EditorPanel from "@/views/EditorPanel.vue";
import Profile from "@/views/Profile.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: AdminPanel,
    meta: {
      requiresAuth: true,
      requiredRoles: ["admin"],
    },
  },
  {
    path: "/manager",
    name: "ManagerPanel",
    component: ManagerPanel,
    meta: {
      requiresAuth: true,
      requiredRoles: ["admin", "manager"],
    },
  },
  {
    path: "/editor",
    name: "EditorPanel",
    component: EditorPanel,
    meta: {
      requiresAuth: true,
      requiredRoles: ["admin", "manager", "editor"],
    },
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check authentication status
  if (!authStore.user) {
    await authStore.checkAuth();
  }

  // Handle guest-only routes
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard");
    return;
  }

  // Handle auth-required routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
    return;
  }

  // Handle role-based access
  if (to.meta.requiredRoles && !authStore.hasAnyRole(to.meta.requiredRoles)) {
    next("/unauthorized");
    return;
  }

  next();
});

export default router;
