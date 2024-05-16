import { computed } from "vue";
import { useCurrentUserQuery } from "@/queries/User";

export default function useIsAdmin() {
    const { data: user } = useCurrentUserQuery();
    const isAdmin = computed(() => user.value?.is_admin || false);
    return { isAdmin };
}
