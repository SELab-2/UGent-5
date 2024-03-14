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
    const { redirectUrl } = useCASUrl();
    const router = useRouter();
    // FIXME: after redirect to CAS server, value is reset -> use query parameter instead?
    const next = ref<string>("/home");

    function setNext(url: string) {
        next.value = url;
    }

    async function login(ticket?: string): Promise<string | null> {
        if (isLoggedIn.value) {
            return next.value;
        }
        if (ticket) {
            try {
                const response = await fetch(`${apiUrl}/api/auth/token`, {
                    method: "POST",
                    body: JSON.stringify({
                        returnUrl: redirectUrl,
                        ticket: ticket,
                    }),
                    headers: { "content-type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error("Failed to verify ticket");
                }
                const new_token = await response.json();
                token.value = new_token;
                localStorage.setItem("token", JSON.stringify(token.value));
                return next.value;
            } catch (e) {
                router.replace({ query: { ticket: null } });
                alert("Failed to login");
                return null;
            }
        }
        return null;
    }

    async function logout() {
        token.value = null;
        localStorage.removeItem("token");
        await router.replace({ name: "login" });
    }
    return { token, isLoggedIn, login, logout, setNext };
});
