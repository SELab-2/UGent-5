import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useQuery, useQueryClient, useMutation } from "@tanstack/vue-query";
import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import {
    createSubmission,
    getFiles,
    getProjectSubmissions,
    getSubmission,
    getSubmissions,
} from "@/services/submission";
import type Submission from "@/models/Submission";
import type FileInfo from "@/models/File";
import { FetchError } from "@/services";
import type { UnmetRequirement } from "@/models/Project";
import { useProjectGroupQuery } from "./Group";

function SUBMISSION_QUERY_KEY(submissionId: number): (string | number)[] {
    return ["submission", submissionId];
}

function SUBMISSIONS_QUERY_KEY(groupId: number): (string | number)[] {
    return ["submissions", "group", groupId];
}

function USER_PROJECT_SUBMISSIONS_QUERY_KEY(projectId: number): (string | number)[] {
    return ["submissions", "project", "user", projectId];
}

function PROJECT_SUBMISSIONS_QUERY_KEY(projectId: number): (string | number)[] {
    return ["submissions", "project", projectId];
}

function FILES_QUERY_KEY(submissionId: number): (string | number)[] {
    return ["files", submissionId];
}

/**
 * Query composable for fetching a submission by id
 */
export function useSubmissionQuery(
    submissionId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Submission, Error> {
    return useQuery<Submission, Error>({
        queryKey: computed(() => SUBMISSION_QUERY_KEY(toValue(submissionId)!)),
        queryFn: () => getSubmission(toValue(submissionId)!),
        enabled: () => !!toValue(submissionId),
    });
}

/**
 * Query composable for fetching all submissions for a group
 */
export function useSubmissionsQuery(
    groupId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: computed(() => SUBMISSIONS_QUERY_KEY(toValue(groupId)!)),
        queryFn: () => getSubmissions(toValue(groupId)!),
        enabled: () => !!toValue(groupId),
    });
}

/**
 * Query composable for fetching all submissions of the group of the current user
 * in the project with the given id
 */
export function useUserProjectSubmissionsQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Submission[], Error> {
    const { data: group } = useProjectGroupQuery(projectId);
    return useQuery({
        queryKey: computed(() => USER_PROJECT_SUBMISSIONS_QUERY_KEY(toValue(projectId)!)),
        queryFn: async () => {
            // HACK: Without this null-check, queries where there is no group will take a long time to resolve
            // also, this should be `!group.value`, but javascript...
            if (group.value === null) return [];
            return await getSubmissions(group.value!.id);
        },
        enabled: () => !!toValue(projectId),
    });
}

/**
 * Query composable for fetching all latest submissions of each group from a project.
 */
export function useProjectSubmissionsQuery(
    projectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Submission[], Error> {
    return useQuery<Submission[], Error>({
        queryKey: computed(() => PROJECT_SUBMISSIONS_QUERY_KEY(toValue(projectId)!)),
        queryFn: () => getProjectSubmissions(toValue(projectId)!),
        enabled: () => !!toValue(projectId),
    });
}

/**
 * Query composable for fetching files for a submission
 */
export function useFilesQuery(
    submissionId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<FileInfo[], Error> {
    return useQuery<FileInfo[], Error>({
        queryKey: computed(() => FILES_QUERY_KEY(toValue(submissionId)!)),
        queryFn: () => getFiles(toValue(submissionId)!),
        enabled: () => !!toValue(submissionId),
    });
}

export class UnmetRequirementsError extends Error {
    unmetRequirements: UnmetRequirement[];

    constructor(message: string, unmetRequirements: UnmetRequirement[], ...params: any[]) {
        super(message, ...params);
        this.unmetRequirements = unmetRequirements;
    }
}

/**
 * Mutation composable for creating a submission
 */
export function useCreateSubmissionMutation(
    groupId: MaybeRefOrGetter<number | undefined>
): UseMutationReturnType<Submission, Error, MaybeRefOrGetter<FormData>, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData) => {
            try {
                return await createSubmission(toValue(groupId)!, toValue(formData));
            } catch (error) {
                if (
                    error instanceof FetchError &&
                    Array.isArray(error.body?.detail) &&
                    error.body.detail.length > 0 &&
                    (error.body.detail[0].type === "mandatory" ||
                        error.body.detail[0].type === "forbidden")
                ) {
                    // file requirements were not met,
                    // server returned files that did not meet the requirements
                    const unmetArr = error.body.detail.map((r) => ({
                        requirement: {
                            mandatory: r.type === "mandatory",
                            value: r.requirement,
                        },
                        files: r.files,
                    }));
                    throw new UnmetRequirementsError(
                        "Submission did not meet project requirements",
                        unmetArr
                    );
                } else {
                    throw error;
                }
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: SUBMISSIONS_QUERY_KEY(toValue(groupId)!) });
        },
        onError: (error) => {
            console.error("Submission creation failed", error);

            if (!(error instanceof UnmetRequirementsError)) {
                alert("Could not create submission. Please try again.");
            }
        },
    });
}
