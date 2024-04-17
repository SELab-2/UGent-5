import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import {getProject, createSubmission, getSubmissions, getProjects} from "@/services/project";
import { type Ref, computed } from "vue";
import type Submission from "@/models/Submission";

function PROJECT_QUERY_KEY(projectId: number): (string | number)[] {
    return ["project", projectId];
}

function PROJECTS_QUERY_KEY(): string[] {
    return ["projects"];
}

function SUBMISSIONS_QUERY_KEY(): string[] {
    return ["submissions"];
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

export function useProjectsQuery(): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: PROJECTS_QUERY_KEY(),
        queryFn: () => getProjects()
    });
}

export function useCreateSubmissionMutation(
    groupId: Ref<number | undefined>
): UseMutationReturnType<Submission, Error, FormData, void> {
    return useMutation({
        mutationFn: (formData) => createSubmission(groupId.value!, formData),
        onError: (e) => {
            // todo
            alert(e.message);
        },
    });
}

export function useSubmissionQuery(): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: SUBMISSIONS_QUERY_KEY(),
        queryFn: () => getSubmissions()
    });
}
