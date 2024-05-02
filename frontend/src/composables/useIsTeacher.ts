import { computed } from "vue";
import { useUserQuery } from "@/queries/User";
import type { QueryClient } from "@tanstack/vue-query";

export default function useIsTeacher(queryClient?: QueryClient) {
    const { data: user, isLoading } = useUserQuery(null, queryClient);
    const isTeacher = computed(() => user.value?.is_teacher || false);
    return { isTeacher, isLoading };
}
