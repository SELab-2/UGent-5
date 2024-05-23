import { computed } from "vue";
import { useUserQuery } from "@/queries/User";

export default function useIsAdmin() {
    const { data: user } = useUserQuery(null);
    const isAdmin = computed(() => user.value?.is_admin || false);
    return { isAdmin };
}
