import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import { getSubject, getSubjectByUuid, registerToSubject } from "@/services/subject";
import { type Ref, computed } from "vue";

function SUBJECT_QUERY_KEY(subjectId: number | string): (string | number)[] {
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

export function useSubjectUuidQuery(subjectUuid: Ref<string>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(subjectUuid.value)),
        queryFn: () => getSubjectByUuid(subjectUuid.value),
        enabled: () => subjectUuid !== undefined,
        retry: false,
    });
}

export function registerSubjectQuery(uuid: Ref<string>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(uuid.value)),
        queryFn: () => registerToSubject(uuid.value),
        enabled: () => false,
    });
}
