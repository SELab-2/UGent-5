import {storeToRefs} from "pinia";
import { type Middleware } from "./index";
import { useAuthStore } from "@/stores/auth-store";

const login: Middleware = async ({ to, next, router }) => {
    const {isLoggedIn} = storeToRefs(useAuthStore());
    const { login, setRedirect } = useAuthStore();
    const nextPage = to.query.redirect?.toString() || "/home";
    if (isLoggedIn) {
        router.replace(nextPage);
        return next();
    }
    const ticket = to.query.ticket?.toString();
    setRedirect(`${nextPage}`);
    const redirect = await login(nextPage, ticket);
    if (redirect) {
        router.replace(redirect);
    }
    return next();
};

export default login;
