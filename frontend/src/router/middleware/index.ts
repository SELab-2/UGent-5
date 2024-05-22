import { type NavigationGuardNext, type RouteLocationNormalized, type Router } from "vue-router";

export interface MiddlewareContext {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: NavigationGuardNext;
    router: Router;
}

export interface MiddlewareResponse {
    next: NavigationGuardNext;
    final: boolean;
}

export type Middleware = (_: MiddlewareContext) => Promise<MiddlewareResponse>;
