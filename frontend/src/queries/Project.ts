import {computed, type Ref, toValue} from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import type Submission from "@/models/Submission";
import {
    getProject,
    createSubmission,
    getSubmissions,
    createProject,
    getProjects,
    uploadProjectFiles,
    updateProject,
    deleteProjectFiles,
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
function SUBMISSIONS_QUERY_KEY(): string[] {
    return ["submissions"];
}

function projectFilesQueryKey(projectId: number): (string | number)[] {
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
export function useProjectsQuery(): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
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
    void,
    Error,
    { projectId: number; projectData: Partial<ProjectForm> },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { projectId: number; projectData: Partial<ProjectForm> }, void>(
        {
            mutationFn: ({ projectId, projectData }) => updateProject(projectId, projectData),

            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(PROJECT_QUERY_KEY(projectId));
                console.log("Project updated successfully.");
            },

            onError: (error) => {
                console.error("Project update failed", error);
                alert("Failed to update project. Please try again.");
            },
        }
    );
}

export function useProjectFilesQuery(projectId: number): UseQueryReturnType<File[], Error> {
    console.log("projectid" + projectId);
    return useQuery<File[], Error>({
        queryKey: projectFilesQueryKey(projectId),
        queryFn: () => fetchProjectFiles(projectId),
        enabled: !!projectId, // Only fetch when a projectId is provided
        onError: (error) => {
            console.error("Error fetching project files:", error);
        },
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

export function useDeleteProjectFilesMutation(): UseMutationReturnType<
    void,
    Error,
    { projectId: number; filesToDelete: string[] },
    void
> {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { projectId: number; filesToDelete: string[] }, void>({
        mutationFn: ({ projectId, filesToDelete }) => deleteProjectFiles(projectId, filesToDelete),

        onSuccess: (_, { projectId }) => {
            // Invalidate and refetch project file queries to reflect updated data
            queryClient.invalidateQueries(["projectFiles", projectId]);
            console.log("Files deleted successfully");
        },

        onError: (error) => {
            console.error("Failed to delete project files", error);
            alert("Could not delete project files. Please try again.");
        },
    });
}


export function useSubmissionQuery(): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: SUBMISSIONS_QUERY_KEY(),
        queryFn: () => getSubmissions(),
    });
}
