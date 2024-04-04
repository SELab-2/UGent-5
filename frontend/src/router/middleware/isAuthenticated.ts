import {storeToRefs} from "pinia";
import { type Middleware } from "./index";
import { useAuthStore } from "@/stores/auth-store";

const isAuthenticated: Middleware = ({ to, next, router }) => {
    const requiresAuth = to.meta.requiresAuth !== undefined ? to.meta.requiresAuth : true;
    const { isLoggedIn } = storeToRefs(useAuthStore());
    if (requiresAuth && !isLoggedIn.value) {
        router.replace({ name: "login", query: { redirect: to.fullPath } });
    }
    return next();
};

export default isAuthenticated;
