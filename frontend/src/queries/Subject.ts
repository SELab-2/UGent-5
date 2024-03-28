import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import { getSubject } from "@/services/subject";
import { computed, type ComputedRef, type Ref } from "vue";

function SUBJECT_QUERY_KEY(subjectId: number): (string|number)[] {
    return ["subject", subjectId];
}

export function useSubjectQuery(subjectId: ComputedRef<number|undefined>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: SUBJECT_QUERY_KEY(subjectId.value!),
        queryFn: () => getSubject(subjectId.value!),
        enabled: computed(() => !!subjectId?.value),
    });
}
