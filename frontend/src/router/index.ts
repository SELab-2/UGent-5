import { useAuthStore } from "@/stores/auth-store";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: "home" },
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
            beforeEnter: async (to, from, next) => {
                const { isLoggedIn, login, setNext } = useAuthStore();
                if (isLoggedIn) {
                    router.replace("/home");
                    next();
                    return;
                }
                const ticket = to.query.ticket?.toString();
                setNext(from.path);
                const redirect = await login(ticket);
                if (redirect) {
                    router.replace(redirect);
                }
                next();
            },
            meta: {
                requiresAuth: false,
                hideHeader: true,
            },
        },
        {
            path: "/home",
            name: "home",
            component: () => import("../views/student/HomeScreenStudentView.vue"),
        },
        {
            path: "/project/:projectId(\\d+)/",
            name: "onSubmit",
            component: () => import("../views/ProjectView.vue"),
            props: (route) => ({ projectId: Number(route.params.projectId) }),
        },
        {
            path: "/:pathMatch(.*)",
            name: "default",
            component: () => import("../views/NotFoundView.vue"),
            meta: {
                requiresAuth: false,
            },
        },
    ],
});

router.beforeEach(async (to, _, next) => {
    const requiresAuth = to.meta.requiresAuth !== undefined ? to.meta.requiresAuth : true;
    const { isLoggedIn } = useAuthStore();
    if (requiresAuth && !isLoggedIn) {
        router.replace({ name: "login" });
    }
    next();
});

export default router;
