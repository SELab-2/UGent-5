import type Submission from "@/models/Submission";
import { createSubmission, getFiles, getSubmission } from "@/services/submission";
import { computed, type Ref } from "vue";
import {
    useQuery,
    type UseMutationReturnType,
    type UseQueryReturnType,
    useMutation,
} from "@tanstack/vue-query";
import type FileInfo from "@/models/File";

// Key generator for submission queries
function submissionQueryKey(submissionId: number): (string | number)[] {
    return ["submission", submissionId];
}

function FILES_QUERY_KEY(submissionId: number): (string | number)[] {
    return ["files", submissionId];
}

// Hook for fetching submission details
export function useSubmissionQuery(
    submissionId: Ref<number | undefined>
): UseQueryReturnType<Submission, Error> {
    return useQuery<Submission, Error>({
        queryKey: computed(() => submissionQueryKey(submissionId.value!)),
        queryFn: () => getSubmission(submissionId.value!),
        enabled: computed(() => submissionId.value !== undefined),
        retry: false,
    });
}

// Hook for fetching all files of a submission
export function useFilesQuery(
    submissionId: Ref<number | undefined>
): UseQueryReturnType<FileInfo[], Error> {
    return useQuery<FileInfo[], Error>({
        queryKey: FILES_QUERY_KEY(submissionId.value!),
        queryFn: () => getFiles(submissionId.value!),
        enabled: computed(() => submissionId.value !== undefined),
        retry: false,
    });
}

// Hook for creating a new submission
export function useCreateSubmissionMutation(
    groupId: Ref<number | undefined>
): UseMutationReturnType<Object, Error, FormData, void> {
    return useMutation<Object, Error, FormData, void>({
        mutationFn: (formData) => createSubmission(groupId.value!, formData),
    });
}
