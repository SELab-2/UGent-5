import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface Authority {
    authority: string;
    method: string;
}

export const useCASUrl = defineStore("cas_url", () => {
    const redirectUrl = ref("/login"); // TODO: this should not be a hardcoded ref, is registrated to CAS server
    const CASUrl = ref("");

    async function fetchAuthority(): Promise<Authority | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/authority`);
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
        CASUrl.value = `${authority.authority}?service=${encodeURIComponent(`${import.meta.env.VITE_APP_URL}${redirectUrl.value}`)}`;
    }
    watch(redirectUrl, updateCASUrl, { immediate: true });

    return { CASUrl, redirectUrl };
});
