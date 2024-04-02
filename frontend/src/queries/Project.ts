import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject, makeSubmission } from "@/services/project";
import { type Ref, computed } from "vue";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", projectId];
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

export function useMakeSubmissionMutation(groupId: number): UseMutationReturnType<void, Error, FormData, void> {
    return useMutation({
        mutationFn: (formData) => makeSubmission(groupId, formData)
    });
}

