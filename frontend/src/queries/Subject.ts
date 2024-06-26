import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseQueryReturnType, UseMutationReturnType, QueryClient } from "@tanstack/vue-query";
import {
    getSubject,
    getSubjectInstructors,
    getSubjects,
    getSubjectStudents,
    getSubjectByUuid,
    registerToSubject,
    getSubjectUuid,
    createSubject,
    createSubjectInstructor,
    updateSubject,
    deleteSubjectInstructor,
} from "@/services/subject";
import { getSubjectProjects } from "@/services/project";
import type User from "@/models/User";
import type Subject from "@/models/Subject";
import type { UserSubjectList } from "@/models/Subject";
import type Project from "@/models/Project";
import type { SubjectForm } from "@/models/Subject";

function SUBJECT_QUERY_KEY(subjectId: number | string): (string | number)[] {
    return ["subject", subjectId];
}

function SUBJECTS_QUERY_KEY(): (string | number)[] {
    return ["subjects"];
}

function SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", "instructors", subjectId];
}

function SUBJECT_STUDENTS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", "students", subjectId];
}

function SUBJECT_PROJECTS_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", "projects", subjectId];
}

function SUBJECT_UUID_QUERY_KEY(subjectId: number): (string | number)[] {
    return ["subject", "uuid", subjectId];
}

/**
 * Query composable for fetching a subject by id
 */
export function useSubjectQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubject(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

/**
 * Query composable for fetching a subject by uuid (invite links)
 */
export function useSubjectUuidQuery(
    subjectUuid: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        // assumes uuid can not be the same as subject id
        queryKey: computed(() => SUBJECT_QUERY_KEY(toValue(subjectUuid)!)),
        queryFn: () => getSubjectByUuid(toValue(subjectUuid)!),
        enabled: () => !!toValue(subjectUuid),
    });
}

/**
 * Query composable for fetching all subjects of the current user
 */
export function useSubjectsQuery(
    queryClient?: QueryClient
): UseQueryReturnType<UserSubjectList, Error> {
    return useQuery<UserSubjectList, Error>(
        {
            queryKey: SUBJECTS_QUERY_KEY(),
            queryFn: getSubjects,
        },
        queryClient
    );
}

/**
 * Query composable for fetching all instructors of a subject
 */
export function useSubjectInstructorsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_INSTRUCTORS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectInstructors(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

/**
 * Query composable for fetching all students of a subject
 */
export function useSubjectStudentsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_STUDENTS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectStudents(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

/**
 * Query composable for fetching all projects of a subject
 */
export function useSubjectProjectsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: computed(() => SUBJECT_PROJECTS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectProjects(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

export function useUuidSubjectQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<string, Error> {
    return useQuery<string, Error>({
        queryKey: computed(() => SUBJECT_UUID_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectUuid(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

/**
 * Mutation composable for registering the current user to a subject
 */
export function useRegisterToSubjectMutation(): UseMutationReturnType<
    Subject,
    Error,
    MaybeRefOrGetter<string>,
    void
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uuid) => await registerToSubject(toValue(uuid)),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY() });
        },
        onError: () => {
            alert("Failed to register to subject");
        },
    });
}

/**
 * Mutation composable for creating a subject
 */
export function useCreateSubjectMutation(): UseMutationReturnType<
    number,
    Error,
    SubjectForm,
    void
> {
    const queryClient = useQueryClient();
    return useMutation<number, Error, SubjectForm, void>({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY() });
        },
        onError: () => {
            alert("Could not create subject. Please try again.");
        },
    });
}

export function useUpdateSubjectMutation(): UseMutationReturnType<
    void,
    Error,
    { subjectId: number; subject: SubjectForm },
    Subject
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ subjectId, subject }) => updateSubject(subjectId, subject),
        onMutate: ({ subjectId, subject }) => {
            const previousSubject = queryClient.getQueryData<Subject>(SUBJECT_QUERY_KEY(subjectId));
            queryClient.cancelQueries({ queryKey: SUBJECT_QUERY_KEY(subjectId) });
            queryClient.setQueryData(SUBJECT_QUERY_KEY(subjectId), subject);
            return previousSubject;
        },
        onSuccess: (_, { subjectId }) => {
            queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEY(subjectId) });
        },
        onError: (_, { subjectId }, previousSubject) => {
            queryClient.setQueryData(SUBJECT_QUERY_KEY(subjectId), previousSubject);
            alert("Could not update subject. Please try again.");
        },
    });
}

/**
 * Mutation composable for creating subject instructor
 */

export function useCreateSubjectInstructorMutation(): UseMutationReturnType<
    void,
    Error,
    { user: User; subjectId: number },
    { previousUsers: User[] }
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ user, subjectId }) => createSubjectInstructor(subjectId, user.uid),
        onMutate: ({ subjectId, user }) => {
            const previousUsers = queryClient.getQueryData<User[]>(
                SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId)
            );
            queryClient.cancelQueries({ queryKey: SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId) });
            const newUsers = previousUsers ? [...previousUsers] : [];
            newUsers.push(user);
            queryClient.setQueryData(SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId), newUsers);
            return { previousUsers: previousUsers || [] };
        },
        onSuccess: (_, { subjectId }) => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId),
            });
        },
        onError: (_, { subjectId }, ctx) => {
            queryClient.setQueryData<User[]>(
                SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId),
                () => ctx!.previousUsers!
            );
            alert("Could not create subject instructor. Please try again.");
        },
    });
}

export function useDeleteSubjectInstructorMutation(): UseMutationReturnType<
    void,
    Error,
    { user: User; subjectId: number },
    { previousUsers: User[] }
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ user, subjectId }) => deleteSubjectInstructor(subjectId, user.uid),
        onMutate: ({ user, subjectId }) => {
            const previousUsers = queryClient.getQueryData<User[]>(
                SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId)
            );
            queryClient.cancelQueries({ queryKey: SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId) });
            const newUsers = previousUsers ? previousUsers.filter((u) => u.uid !== user.uid) : [];
            queryClient.setQueryData(SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId), newUsers);
            return { previousUsers: previousUsers || [] };
        },
        onSuccess: (_, { subjectId }) => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId),
            });
        },
        onError: (_, { subjectId }, ctx) => {
            queryClient.setQueryData<User[]>(
                SUBJECT_INSTRUCTORS_QUERY_KEY(subjectId),
                () => ctx!.previousUsers!
            );
            alert("Could not delete subject instructor. Please try again.");
        },
    });
}
