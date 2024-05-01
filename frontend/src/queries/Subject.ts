import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {
    getSubject,
    getSubjectInstructors,
    getSubjectProjects,
    getSubjects,
    getSubjectStudents,
    getSubjectByUuid,
    registerToSubject, getSubjectUuid,
} from "@/services/subject";
import {type Ref, computed} from "vue";
import type Subject from "@/models/Subject";
import type User from "@/models/User";
import type Project from "@/models/Project";
import type SubjectDetails from "@/models/SubjectDetails";

// Generalized function to create query keys based on subject details
function createSubjectQueryKey(
    subjectId: number | string,
    detail: string = ""
): (string | number)[] {
    return ["subject", subjectId, detail].filter(Boolean);
}

export function useSubjectQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectId.value!)),
        queryFn: () => getSubject(subjectId.value!),
        enabled: computed(() => subjectId.value !== undefined),
    });
}

export function useSubjectInstructorsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectId.value!, "instructors")),
        queryFn: () => getSubjectInstructors(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectStudentsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectId.value!, "students")),
        queryFn: () => getSubjectStudents(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectProjectsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectId.value!, "projects")),
        queryFn: () => getSubjectProjects(subjectId.value!),
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectsQuery(): UseQueryReturnType<Subject[], Error> {
    return useQuery<Subject[], Error>({
        queryKey: createSubjectQueryKey("all"),
        queryFn: getSubjects,
    });
}

export function useSubjectDetailsQuery(
    subjectId: Ref<number | undefined>
): UseQueryReturnType<SubjectDetails, Error> {
    return useQuery<SubjectDetails, Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectId.value!, "details")),
        queryFn: async () => {
            const [subject, instructors, students, projects, uuid] = (await Promise.all([
                getSubject(subjectId.value!),
                getSubjectInstructors(subjectId.value!),
                getSubjectStudents(subjectId.value!),
                getSubjectProjects(subjectId.value!),
                getSubjectUuid(subjectId.value!)
            ])) as [Subject, User[], User[], Project[], string];

            return {
                id: subject.id,
                name: subject.name,
                instructors,
                students,
                projects,
                uuid,
                academic_year: subject.academic_year,
            };
        },
        enabled: () => subjectId.value !== undefined,
    });
}

export function useSubjectUuidQuery(subjectUuid: Ref<string>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => createSubjectQueryKey(subjectUuid.value)),
        queryFn: () => getSubjectByUuid(subjectUuid.value),
        enabled: () => subjectUuid !== undefined,
        retry: false,
    });
}

export function registerSubjectQuery(uuid: Ref<string>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => createSubjectQueryKey(uuid.value)),
        queryFn: () => registerToSubject(uuid.value),
        enabled: () => false,
    });
}

