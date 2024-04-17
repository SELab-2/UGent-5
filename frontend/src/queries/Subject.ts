import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import {
    getSubject,
    getSubjectInstructors,
    getSubjectProjects,
    getSubjects,
    getSubjectStudents,
    getSubjectByUuid,
    registerToSubject,
} from "@/services/subject";
import { type Ref, computed } from "vue";
import type User from "@/models/User";
import type Project from "@/models/Project";
import type SubjectDetails from "@/models/SubjectDetails";

function SUBJECT_QUERY_KEY(subjectId: number | string): (string | number)[] {
    return ["subject", subjectId];
}

function SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId, "instructors"];
}

function SUBJECT_STUDENTS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId, "students"];
}

function SUBJECT_PROJECTS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", subjectId, "projects"];
}

function SUBJECT_DETAILS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", "details", subjectId];
}

function SUBJECTS_QUERY_KEY(): (string | number)[] {
    return ["subjects"];
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
        queryKey: computed(() => SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectInstructors(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectStudentsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_STUDENTS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectStudents(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectProjectsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: computed(() => SUBJECT_PROJECTS_QUERY_KEY(subjectId.value!)),
        queryFn: () => getSubjectProjects(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectsQuery(): UseQueryReturnType<Subject[], Error> {
    return useQuery<Subject[], Error>({
        queryKey: SUBJECTS_QUERY_KEY(),
        queryFn: () => getSubjects(),
    });
}

export function useSubjectDetailsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<SubjectDetails, Error> {
    return useQuery<SubjectDetails, Error>({
        queryKey: computed(() => SUBJECT_DETAILS_QUERY_KEY(subjectId.value!)),
        queryFn: async () => {
            // Fetch data for subject, instructors, students, and projects
            const [subject, instructors, students, projects] = (await Promise.all([
                getSubject(subjectId.value!),
                getSubjectInstructors(subjectId.value!),
                getSubjectStudents(subjectId.value!),
                getSubjectProjects(subjectId.value!),
            ])) as [Subject, User[], User[], Project[]];

            // Map data into SubjectDetails structure
            return {
                id: subject.id,
                name: subject.name,
                instructors,
                students,
                projects,
            } as SubjectDetails;
        },
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
