import type Submission from "@/models/Submission";
import { createSubmission, getFiles, getSubmission, getSubmissions } from "@/services/submission";
import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import {
    useQuery,
    useQueryClient,
    useMutation,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type FileInfo from "@/models/File";

function SUBMISSION_QUERY_KEY(submissionId: number): (string | number)[] {
    return ["submission", submissionId];
}

function SUBMISSIONS_QUERY_KEY(groupId: number): (string | number)[] {
    return ["submissions", groupId];
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
        retry: false,
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
 * Query composable for fetching files for a submission
 */
export function useFilesQuery(
    submissionId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<FileInfo[], Error> {
    return useQuery<FileInfo[], Error>({
        queryKey: computed(() => FILES_QUERY_KEY(toValue(submissionId)!)),
        queryFn: () => getFiles(toValue(submissionId)!),
        enabled: () => !!toValue(submissionId),
        retry: false,
    });
}

/**
 * Mutation composable for creating a submission
 */
export function useCreateSubmissionMutation(
    groupId: MaybeRefOrGetter<number | undefined>
): UseMutationReturnType<Submission, Error, MaybeRefOrGetter<FormData>, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData) => createSubmission(toValue(groupId)!, toValue(formData)),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: SUBMISSIONS_QUERY_KEY(toValue(groupId)!) });
        },
        onError: (error) => {
            console.error("Submission creation failed", error);
            alert("Could not create submission. Please try again.");
        },
    });
}
