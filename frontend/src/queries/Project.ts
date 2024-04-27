import {
    useMutation,
    useQuery,
    type UseMutationReturnType,
    type UseQueryReturnType,
    useQueryClient,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import type { ProjectForm } from "@/models/Project";
import type Submission from "@/models/Submission";
import {
    getProject,
    createSubmission,
    getSubmissions,
    createProject,
    getProjects, uploadProjectFiles,
} from "@/services/project";
import { type Ref, computed } from "vue";

// Key generator for project queries
function projectQueryKey(projectId: number): (string | number)[] {
    return ["project", projectId];
}

function PROJECTS_QUERY_KEY(): string[] {
    return ["projects"];
}

function SUBMISSIONS_QUERY_KEY(): string[] {
    return ["submissions"];
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

export function useProjectsQuery(): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: PROJECTS_QUERY_KEY(),
        queryFn: () => getProjects(),
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
export function useCreateProjectMutation(): UseMutationReturnType<
    number,
    Error,
    ProjectForm,
    void
> {
    const queryClient = useQueryClient();
    return useMutation<number, Error, ProjectForm, void>({
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

// Hook for uploading files to a project
export function useUploadProjectFilesMutation(): UseMutationReturnType<
    void, // Type of data returned on success
    Error, // Type of error
    { projectId: number; formData: FormData }, // Arguments the mutation function accepts
    void  // Context or rollback information on error
> {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { projectId: number; formData: FormData }, void>({
        mutationFn: ({ projectId, formData }) =>
            uploadProjectFiles(projectId, formData),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
            console.log("Files uploaded successfully");
        },
        onError: (error) => {
            console.error("File upload failed", error);
            alert("Could not upload files. Please try again.");
        },
    });
}


export function useSubmissionQuery(): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: SUBMISSIONS_QUERY_KEY(),
        queryFn: () => getSubmissions(),
    });
}
