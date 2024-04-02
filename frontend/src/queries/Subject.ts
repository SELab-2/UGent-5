import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { get_instructors_for_subject } from "@/services/subject";

function USER_QUERY_KEY(subject_id?: string): string[] {
    return subject_id ? ["subject_instructors", subject_id] : ["subject_instructors"];
}

export function useSubjectQuery(subject_id: string): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({ queryKey: USER_QUERY_KEY(subject_id), queryFn: () => get_instructors_for_subject(subject_id) });
}
