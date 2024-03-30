import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject } from "@/services/project";
import type Subject from "@/models/Subject";
import { computed, type ComputedRef } from "vue";
import { useSubjectQuery } from "@/queries/Subject";

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
