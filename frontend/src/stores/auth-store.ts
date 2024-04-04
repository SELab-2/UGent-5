import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
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
    const { redirectUrl, setNext } = useCASUrl();
    const router = useRouter();

    async function login(redirectTo: string, ticket?: string): Promise<string | null> {
        if (isLoggedIn.value) {
            return redirectTo;
        }
        if (ticket) {
            try {
                const response = await fetch(`${apiUrl}/api/auth/token`, {
                    method: "POST",
                    body: JSON.stringify({
                        returnUrl: `${redirectUrl}?redirect=${redirectTo}`,
                        ticket: ticket,
                    }),
                    headers: { "content-type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error("Failed to verify ticket");
                }
                token.value = await response.json();
                localStorage.setItem("token", JSON.stringify(token.value));
                return redirectTo;
            } catch (e) {
                await router.replace({ query: { ticket: null } });
                alert("Failed to login");
            }
        }
        return null;
    }

    async function logout() {
        token.value = null;
        localStorage.removeItem("token");
        await router.replace({ name: "login" });
    }
    return { token, isLoggedIn, login, logout, setRedirect: setNext };
});
