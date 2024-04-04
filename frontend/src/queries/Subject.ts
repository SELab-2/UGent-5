import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import {
    getSubject,
    getSubjectInstructors,
    getSubjectProjects,
    getSubjects,
    getSubjectStudents,
    getSubjectTeachers
} from "@/services/subject";
import { type Ref, computed } from "vue";
import type User from "@/models/User";
import type Project from "@/models/Project";

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

export function useSubjectInstructorsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectInstructors(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectStudentsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectStudents(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectProjectsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectProjects(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectsQuery(): UseQueryReturnType<Subject[], Error> {
    return useQuery<Subject[], Error>({
        queryKey: ["subjects"],
        queryFn: () => getSubjects(),
    });
}
