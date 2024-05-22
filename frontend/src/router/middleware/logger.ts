import type { Middleware, MiddlewareContext } from "@/router/middleware";

/**
 * This middleware logs a message to the console.
 * It's main purpose is debugging.
 */
const logger: Middleware = async ({ next }: MiddlewareContext) => {
    console.log("Middleware logger");
    return { next, final: false };
};
export default logger;
