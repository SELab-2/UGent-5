import { type NavigationGuardNext, type RouteLocationNormalized, type Router } from "vue-router";

export interface MiddlewareContext {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: NavigationGuardNext;
    router: Router;
}

export type Middleware = (_: MiddlewareContext) => void;

export function nextFactory(
    context: MiddlewareContext,
    middleware: Array<Middleware>,
    index: number
): () => void {
    const currentMiddleware = middleware[index];
    if (!currentMiddleware) {
        return context.next;
    }
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    return () => currentMiddleware({ ...context, next: nextMiddleware });
}
