import { type Middleware } from "./index";
import { useAuthStore } from "@/stores/auth-store";

const isAuthenticated: Middleware = async ({ to, next }) => {
    const requiresAuth = to.meta.requiresAuth !== undefined ? to.meta.requiresAuth : true;
    const { isLoggedIn } = useAuthStore();
    if (requiresAuth && !isLoggedIn) {
        return {
            next: () => next({ name: "login", query: { redirect: to.fullPath } }),
            final: true,
        };
    }
    return {
        next,
        final: false,
    };
};

export default isAuthenticated;
