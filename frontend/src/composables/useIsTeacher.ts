import { computed } from "vue";
import { useCurrentUserQuery } from "@/queries/User";

export default function useIsTeacher() {
    const { data: user } = useCurrentUserQuery();
    const isTeacher = computed(() => user.value?.is_teacher || false);
    return { isTeacher };
}
