import { computed } from "vue";
import { useUserQuery } from "@/queries/User";

export default function useIsTeacher() {
    const { data: user } = useUserQuery();
    const isTeacher = computed(() => user.value?.is_teacher || false);
    return { isTeacher };
}
