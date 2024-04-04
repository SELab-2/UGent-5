import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type User from "@/models/User";
import type Subject from "@/models/Subject";
import { get_instructors_for_subject, getSubject } from "@/services/subject";
import { type Ref, computed } from "vue";

// Query key for fetching instructors
function INSTRUCTORS_FOR_SUBJECT_QUERY_KEY(subject_id: string): string[] {
    return ["subject_instructors", subject_id];
}

// Hook for fetching instructors for a subject
export function useInstructorsForSubjectQuery(subject_id: string): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: INSTRUCTORS_FOR_SUBJECT_QUERY_KEY(subject_id),
        queryFn: () => get_instructors_for_subject(subject_id),
    });
}

// Query key for fetching subject details
function SUBJECT_DETAILS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject_details", subjectId];
}

// Hook for fetching details of a subject
export function useSubjectDetailsQuery(subjectId: Ref<number | undefined>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_DETAILS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubject(subjectId.value!),
        enabled: computed(() => subjectId.value !== undefined),
    });
}

