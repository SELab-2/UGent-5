import { computed, type Ref, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import type { Project, UserProjectList } from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import type Submission from "@/models/Submission";
import {
    getProject,
    createProject,
    getProjects,
    uploadProjectFiles,
    updateProject,
    fetchProjectFiles,
} from "@/services/project";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", projectId];
}

function PROJECTS_QUERY_KEY(): string[] {
    return ["projects"];
}

/**
 * Query composable for fetching a project by id
 */

function TEST_FILES_QUERY_KEY(projectId: number): (string | number)[] {
    return ["projectFiles", projectId];
}

// Hook for fetching project details
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

// Hook for creating a new submission
export function useCreateSubmissionMutation(
    groupId: Ref<number | undefined>
): UseMutationReturnType<Submission, Error, FormData, void> {
    return useMutation<Submission, Error, FormData, void>({
        mutationFn: (formData) => createSubmission(groupId.value!, formData),
        onError: (error) => {
            console.error("Submission creation failed", error);
            alert("Could not create submission. Please try again.");
        },
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

export function useUpdateProjectMutation(): UseMutationReturnType<
    Project,
    Error,
    { projectId: number; projectData: Partial<ProjectForm> },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<
        Project,
        Error,
        { projectId: number; projectData: Partial<ProjectForm> },
        void
    >({
        mutationFn: ({ projectId, projectData }) => updateProject(projectId, projectData),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(variables.projectId) });
            console.log("Project updated successfully.");
        },

        onError: (error) => {
            console.error("Project update failed", error);
            alert("Failed to update project. Please try again.");
        },
    });
}

export function useProjectFilesQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<File[], Error> {
    return useQuery<File[], Error>({
        queryKey: TEST_FILES_QUERY_KEY(toValue(projectId)!),
        queryFn: () => fetchProjectFiles(toValue(projectId)!),
        enabled: () => !!toValue(projectId), // Only fetch when a projectId is provided
    });
}
// Hook for uploading files to a project
export function useUploadProjectFilesMutation(): UseMutationReturnType<
    void, // Type of data returned on success
    Error, // Type of error
    { projectId: number; formData: FormData },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { projectId: number; formData: FormData }, void>({
        mutationFn: ({ projectId, formData }) => uploadProjectFiles(projectId, formData),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
            console.log("Files uploaded successfully");
        },
        onError: (error) => {
            console.error("File upload failed", error);
            alert("Could not upload files. Please try again.");
        },
    });
}
