import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import type Project from "@/models/Project";
import type { ProjectForm, UserProjectList } from "@/models/Project";
import {
    getProject,
    createProject,
    getProjects,
    getSubmissions,
} from "@/services/project";
import type Submission from "@/models/Submission";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", projectId];
}

function PROJECTS_QUERY_KEY(): string[] {
    return ["projects"];
}

function SUBMISSIONS_QUERY_KEY(projectId: number): (string | number)[] {
    return ["submissions_project", projectId];
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
export function useProjectsQuery(): UseQueryReturnType<UserProjectList, Error> {
    return useQuery<UserProjectList>({
        queryKey: PROJECTS_QUERY_KEY(),
        queryFn: getProjects,
    });
}

export function useSubmissionsQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: computed(() => SUBMISSIONS_QUERY_KEY(toValue(projectId)!)),
        queryFn: () => getSubmissions(toValue(projectId)!),
        enabled: () => !!toValue(projectId)
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
