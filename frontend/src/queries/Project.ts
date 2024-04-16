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

export function useCreateProjectMutation(): UseMutationReturnType<Project, Error, Project, void> {
    const queryClient = useQueryClient();
    return useMutation<Project, Error, Project>({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["create-project"] });
        },
        onError: (error) => {
            console.error("Project creation failed", error);
            alert("Could not create project. Please try again.");
        },
    });
}

// export function useCreateProjectMutation(): UseMutationReturnType<Project, Error, Project, void> {
//     const queryClient = useQueryClient();
//
//     return useMutation<Project, Error, Project>({
//         mutationFn: createProject,
//         onMutate: async (newProject: Project) => {
//             await queryClient.cancelQueries(['projects']);
//             const previousProjects = queryClient.getQueryData<Project[]>('projects');
//
//             queryClient.setQueryData<Project[]>('projects', old => [...(old || []), newProject]);
//
//             return { previousProjects };
//         },
//         onError: (error, newProject, context) => {
//             console.error("Project creation failed", error);
//             queryClient.setQueryData('projects', context?.previousProjects);
//             alert("Could not create project. Please try again.");
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['projects']);
//         },
//         onSettled: () => {
//             queryClient.invalidateQueries(['projects']);
//         },
//     });
// }
