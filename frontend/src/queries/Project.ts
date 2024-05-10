import {
    useMutation,
    useQuery,
    type UseMutationReturnType,
    type UseQueryReturnType,
    useQueryClient,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import { getProject, createProject, getProjects } from "@/services/project";
import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", projectId];
}

function PROJECTS_QUERY_KEY(): string[] {
    return ["projects"];
}

/**
 * Query composable for fetching a project by id
 */
export function useProjectQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: computed(() => PROJECT_QUERY_KEY(toValue(projectId)!)),
        queryFn: () => getProject(toValue(projectId)!),
        enabled: () => !!toValue(projectId),
    });
}

/**
 * Query composable for fetching all projects of the current user
 */
export function useProjectsQuery(): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: PROJECTS_QUERY_KEY(),
        queryFn: getProjects,
    });
}

/**
 * Mutation composable for creating a project
 */
export function useCreateProjectMutation(): UseMutationReturnType<
    number,
    Error,
    ProjectForm,
    void
> {
    const queryClient = useQueryClient();
    return useMutation<number, Error, ProjectForm, void>({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY() });
        },
        onError: (error) => {
            console.error("Project creation failed", error);
            alert("Could not create project. Please try again.");
        },
    });
}
