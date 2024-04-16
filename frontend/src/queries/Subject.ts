import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type User from "@/models/User";
import type Subject from "@/models/Subject";
import {get_instructors_for_subject, get_students_for_subject, getSubject} from "@/services/subject";
import { type Ref, computed } from "vue";

// Query key for fetching instructors
function INSTRUCTORS_FOR_SUBJECT_QUERY_KEY(subject_id: number): string[] {
    return ["subject_instructors", "" + subject_id];
}

// Hook for fetching instructors for a subject
export function useInstructorsForSubjectQuery(
    subject_id: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        // Make sure the computed property inside queryKey correctly unwraps the ref
        queryKey: computed(() => ["instructorsForSubject", subject_id.value]),
        // The query function should be passed the actual number, not a ref
        queryFn: () => get_instructors_for_subject(subject_id.value),
        // Ensure the enabled property is properly reactive
        enabled: computed(() => subject_id.value !== undefined),
    });
}

export function useStudentsForSubjectQuery(
    subject_id: Ref<number | undefined>
): UseQueryReturnType<User[], Error>{
    return useQuery<User[], Error>({
        // Make sure the computed property inside queryKey correctly unwraps the ref
        queryKey: computed(() => ["studentsForSubject", subject_id.value]),
        // The query function should be passed the actual number, not a ref
        queryFn: () => get_students_for_subject(subject_id.value),
        // Ensure the enabled property is properly reactive
        enabled: computed(() => subject_id.value !== undefined),
    });
}

// Query key for fetching subject details
function SUBJECT_DETAILS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject_details", subjectId];
}

// Hook for fetching details of a subject
export function useSubjectQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Subject, Error> {
    console.log(subjectId);
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_DETAILS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubject(subjectId.value!),
        enabled: computed(() => subjectId.value !== undefined),
    });
}


