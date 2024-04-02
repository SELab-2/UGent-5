import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject, makeSubmission } from "@/services/project";
import { type Ref, computed } from "vue";
import type Submission from "@/models/Submission";

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

export function useMakeSubmissionMutation(
    groupId: Ref<number | undefined>
): UseMutationReturnType<Submission, Error, FormData, void> {
    return useMutation({
        mutationFn: (formData) => makeSubmission(groupId.value!, formData),
        onError: (e) => {
            // todo
            alert(e.message);
        },
    });
}
