import {
    useQuery,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject } from "@/services/project";
import type Subject from "@/models/Subject";
import { computed, type ComputedRef, type Ref, ref } from "vue";
import { useSubjectQuery } from "@/queries/Subject";

function PROJECT_QUERY_KEY(projectId: number): (string|number)[] {
    return ["project", projectId];
}

export function useProjectQuery(projectId: number): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: PROJECT_QUERY_KEY(projectId),
        queryFn: () => getProject(projectId)
    });
}

export function useProjectSubjectQuery(projectId: ComputedRef<number|undefined>): UseQueryReturnType<Subject, Error> {
    const { data: project} = useProjectQuery(projectId.value!);
    return useSubjectQuery(computed(() => project.value?.subject_id))
}
