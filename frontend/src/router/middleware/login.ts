import { type Middleware } from "./index";
import { useAuthStore } from "@/stores/auth-store";

const login: Middleware = async ({ to, next }) => {
    const { login, setRedirect, isLoggedIn } = useAuthStore();
    const nextPage = to.query.redirect?.toString() || "/home";
    if (isLoggedIn) {
        return {
            next: () => next(nextPage),
            final: true,
        };
    }
    const ticket = to.query.ticket?.toString();
    setRedirect(`${nextPage}`);
    const redirect = await login(nextPage, ticket);
    if (redirect) {
        return {
            next: () => next(redirect),
            final: true,
        };
    }
    return { next, final: false };
};

export default login;
