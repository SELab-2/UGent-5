import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'temp',
            component: () => import('../views/tempView.vue'),
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/LoginView.vue'),
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('../views/UserView.vue'),
        },
    ],
});

export default router;
