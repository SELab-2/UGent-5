import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

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
            component: () => import("../views/UserView.vue"),
        },
        {
            path: "/:pathMatch(.*)",
            name: "default",
            component: () => import("../views/NotFoundView.vue"),
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: "/subjects",
            name: "subjects",
            component: () => import("../views/SubjectsView.vue"),
            children: []
        },
        {
            path: "/subjects/:subjectId",
            name: "subject",
            component: () => import("../views/SubjectView.vue"),
            props: true
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

export default router;
