import { defineStore } from "pinia";
import { computed, ref } from "vue";
import router from "@/router/index";
import { useCASUrl } from "./cas-url";

interface Token {
    token: string;
    token_type: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore("auth", () => {
    const storedToken = localStorage.getItem("token");
    const token = ref<Token | null>(storedToken ? JSON.parse(storedToken) : null);
    const isLoggedIn = computed(() => token.value !== null && token.value !== undefined);
    const { setReturnUrl } = useCASUrl();

    async function login(returnUrl: string, ticket?: string) {
        if (isLoggedIn.value) {
            // router.replace({ query: undefined })
            return;
        }
        if (ticket) {
            const new_token = await fetch(`${apiUrl}/api/login`, {
                method: "POST",
                body: JSON.stringify({
                    returnUrl: returnUrl,
                    ticket: ticket,
                }),
                headers: { "content-type": "application/json" },
            }).then((data) => data.json());
            if (!new_token || new_token.token === undefined || new_token.token_type === undefined) {
                return;
            }
            token.value = new_token;
            localStorage.setItem("token", JSON.stringify(token.value));
            // router.replace({ query: undefined })
            router.push(returnUrl);
        } else {
            setReturnUrl(returnUrl);
            // router.replace({ query: undefined })
            router.push("/login");
        }
    }

    function logout() {
        token.value = null;
        localStorage.removeItem("token");
        router.push("/login");
    }
    return { token, isLoggedIn, login, logout };
});
