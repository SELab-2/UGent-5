import {
    useMutation,
    useQuery,
    type UseMutationReturnType,
    type UseQueryReturnType,
    useQueryClient,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import type Submission from "@/models/Submission";
import { getProject, createSubmission, createProject } from "@/services/project";
import { type Ref, computed } from "vue";

// Key generator for project queries
function projectQueryKey(projectId: number): (string | number)[] {
    return ["project", projectId];
}

// Hook for fetching project details
export function useProjectQuery(
    projectId: Ref<number | undefined>
): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: computed(() => projectQueryKey(projectId.value!)),
        queryFn: () => getProject(projectId.value!),
        enabled: computed(() => projectId.value !== undefined),
    });
}

// Hook for creating a new submission
export function useCreateSubmissionMutation(
    groupId: Ref<number | undefined>
): UseMutationReturnType<Submission, Error, FormData, void> {
    return useMutation<Submission, Error, FormData>({
        mutationFn: (formData) => createSubmission(groupId.value!, formData),
        onError: (error) => {
            console.error("Submission creation failed", error);
            alert("Could not create submission. Please try again.");
        },
    });
}
export function useCreateProjectMutation(): UseMutationReturnType<Project, Error, Project, string> {
    const queryClient = useQueryClient();
    return useMutation<Project, Error, Project, string>({
        mutationFn: createProject,
        onSuccess: (createdProjectId) => {
            queryClient.invalidateQueries({ queryKey: ["create-project"] });
            console.log("Project created with ID:", createdProjectId);
        },
        onError: (error) => {
            console.error("Project creation failed", error);
            alert("Could not create project. Please try again.");
        },
    });
}
