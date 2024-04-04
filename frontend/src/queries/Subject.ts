import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { get_instructors_for_subject } from "@/services/subject";

function SUBJECT_QUERY_KEY(subject_id?: string): string[] {
    return subject_id ? ["subject_instructors", subject_id] : ["subject_instructors"];
}

export function useSubjectQuery(subject_id: string): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({ queryKey: SUBJECT_QUERY_KEY(subject_id), queryFn: () => get_instructors_for_subject(subject_id) });
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import { getSubject } from "@/services/subject";
import { type Ref, computed } from "vue";

function SUBJECT_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId];
}

export function useSubjectQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubject(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}
