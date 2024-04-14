import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import {getSubject, getSubjectInstructors} from "@/services/subject";
import { type Ref, computed } from "vue";
import type User from "@/models/User";

function SUBJECT_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId];
}

function SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId, "instructors"];
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

export function useSubjectInstructorsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[] | null, Error> {
    return useQuery<User[] | null, Error>({
        queryKey: computed(() => SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectInstructors(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}
