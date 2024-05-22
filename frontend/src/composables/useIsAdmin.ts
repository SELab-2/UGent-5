import { computed } from "vue";
import { useCurrentUserQuery } from "@/queries/User";
import type { QueryClient } from "@tanstack/vue-query";

export default function useIsAdmin(queryClient?: QueryClient) {
    const { data: user, isLoading } = useCurrentUserQuery(queryClient);
    const isAdmin = computed(() => user.value?.is_admin || false);
    return { isAdmin, isLoading };
}
