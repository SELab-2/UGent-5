import { computed } from "vue";
import { useUserQuery } from "@/queries/User";
import type { QueryClient } from "@tanstack/vue-query";

export default function useIsAdmin(queryClient?: QueryClient) {
    const { data: user, isLoading } = useUserQuery(null, queryClient);
    const isAdmin = computed(() => user.value?.is_admin || false);
    return { isAdmin, isLoading };
}
