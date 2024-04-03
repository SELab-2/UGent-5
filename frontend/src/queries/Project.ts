import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { getProject } from "@/services/project";
import type Project from "@/models/Project";
import { type Ref, computed } from "vue";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["projects", projectId];
}

export function useProjectQuery(
    projectId: Ref<number | undefined>
): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: computed(() => PROJECT_QUERY_KEY(projectId.value!)),
        queryFn: () => getProject(projectId.value!),
        enabled: () => projectId.value !== undefined,
    });
}
