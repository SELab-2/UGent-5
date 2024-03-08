import { useAuthStore } from '@/stores/auth-store';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { name: 'home' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            beforeEnter: () => {
                const { isLoggedIn } = useAuthStore();
                if (isLoggedIn) {
                    return { name: "home" }
                }
            },
            meta: {
                requiresAuth: false,
                hideHeader: true,
            },
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/UserView.vue'),
        },
        {
            path: "/:pathMatch(.*)",
            name: "default",
            component: () => import("../views/NotFoundView.vue"),
            meta: {
                requiresAuth: false,
            }
        }
    ],
});

router.beforeEach(async (to, _, next) => {
    const requiresAuth = to.meta.requiresAuth !== undefined ? to.meta.requiresAuth : true;
    const { isLoggedIn, login } = useAuthStore();
    if (!requiresAuth || isLoggedIn) {
        next();
        return;
    }
    const ticket = to.query.ticket?.toString();
    await login(to.path, ticket);
    next();
})

export default router;
