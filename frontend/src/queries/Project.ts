import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject } from "@/services/project";
import { computed, type ComputedRef } from "vue";

function PROJECT_QUERY_KEY(
    projectId: ComputedRef<number | undefined>
): (string | ComputedRef<number | undefined>)[] {
    return ["project", projectId];
}

export function useProjectQuery(
    projectId: ComputedRef<number | undefined>
): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: PROJECT_QUERY_KEY(projectId),
        queryFn: () => getProject(projectId.value!),
        enabled: computed(() => !!projectId.value),
    });
}
