import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface Authority {
    authority: string;
    method: string;
}

export const useCASUrl = defineStore("cas_url", () => {
    const returnUrl = ref("/home");
    const CASUrl = ref("");

    function setReturnUrl(url: string) {
        returnUrl.value = url;
    }

    async function fetchAuthority(): Promise<Authority | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authority`);
            if (!response.ok) {
                throw new Error("Failed to fetch authority");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching authority:", error);
            return null;
        }
    }

    async function updateCASUrl() {
        const authority = await fetchAuthority();
        if (!authority) {
            return;
        }
        if (authority.method.toLowerCase() !== "cas") {
            console.error("Authority is not a CAS server");
            return;
        }
        CASUrl.value = `${authority.authority}?service=${encodeURIComponent(`${import.meta.env.VITE_APP_URL}${returnUrl.value}`)}`;
    }
    watch(returnUrl, updateCASUrl, { immediate: true });

    return { CASUrl, setReturnUrl, returnUrl };
});
