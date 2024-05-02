import { computed, toValue } from "vue";
import type { Ref, MaybeRefOrGetter, MaybeRef } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { UseQueryReturnType, QueryStatus, UseMutationReturnType } from "@tanstack/vue-query";
import {
    getSubject,
    getSubjectInstructors,
    getSubjectProjects,
    getSubjects,
    getSubjectStudents,
    getSubjectByUuid,
    registerToSubject,
} from "@/services/subject";
import type User from "@/models/User";
import type Subject from "@/models/Subject";
import type Project from "@/models/Project";
import type SubjectDetails from "@/models/SubjectDetails";

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

export function useSubjectQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubject(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

export function useSubjectUuidQuery(
    subjectUuid: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => SUBJECT_QUERY_KEY(toValue(subjectUuid)!)),
        queryFn: () => getSubjectByUuid(toValue(subjectUuid)!),
        enabled: () => !!toValue(subjectUuid),
    });
}

export function useSubjectsQuery(): UseQueryReturnType<Subject[], Error> {
    return useQuery<Subject[], Error>({
        queryKey: SUBJECTS_QUERY_KEY(),
        queryFn: getSubjects,
    });
}

export function useSubjectInstructorsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_INSTRUCTORS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectInstructors(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

export function useSubjectStudentsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: computed(() => SUBJECT_STUDENTS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectStudents(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

export function useSubjectProjectsQuery(
    subjectId: MaybeRefOrGetter<number | undefined>
): UseQueryReturnType<Project[], Error> {
    return useQuery<Project[], Error>({
        queryKey: computed(() => SUBJECT_PROJECTS_QUERY_KEY(toValue(subjectId)!)),
        queryFn: () => getSubjectProjects(toValue(subjectId)!),
        enabled: () => !!toValue(subjectId),
    });
}

export function useSubjectDetailsQuery(subjectId: MaybeRefOrGetter<number | undefined>): {
    data: Ref<SubjectDetails | undefined>;
    status: Ref<QueryStatus>;
    isSuccess: Ref<boolean>;
    isError: Ref<boolean>;
    isLoading: Ref<boolean>;
    error: Ref<(Error | null)[]>;
} {
    const {
        data: subjectData,
        status: subjectStatus,
        isSuccess: subjectSuccess,
        isLoading: subjectLoading,
        error: subjectError,
    } = useSubjectQuery(subjectId);
    const {
        data: instructorsData,
        status: instructorsStatus,
        isSuccess: instructorsSuccess,
        isLoading: instructorsLoading,
        error: instructorsError,
    } = useSubjectInstructorsQuery(subjectId);
    const {
        data: studentsData,
        status: studentsStatus,
        isSuccess: studentsSuccess,
        isLoading: studentsLoading,
        error: studentsError,
    } = useSubjectStudentsQuery(subjectId);
    const {
        data: projectsData,
        status: projectsStatus,
        isSuccess: projectsSuccess,
        isLoading: projectsLoading,
        error: projectsError,
    } = useSubjectProjectsQuery(subjectId);
    const data = computed<SubjectDetails | undefined>(() => {
        if (
            !subjectSuccess.value ||
            !instructorsSuccess.value ||
            !studentsSuccess.value ||
            !projectsSuccess.value
        )
            return undefined;
        return {
            id: subjectData.value!.id,
            name: subjectData.value!.name,
            instructors: instructorsData.value!,
            students: studentsData.value!,
            projects: projectsData.value!,
        };
    });
    const status = computed<QueryStatus>(() => {
        const statuses = [subjectStatus, instructorsStatus, studentsStatus, projectsStatus];
        if (statuses.every((status) => status.value === "success")) return "success";
        if (statuses.some((status) => status.value === "error")) return "error";
        return "pending";
    });
    const isSuccess = computed(() => status.value === "success");
    const isError = computed(() => status.value === "error");
    const isLoading = computed(() =>
        [subjectLoading, instructorsLoading, studentsLoading, projectsLoading].some(
            (loading) => loading.value
        )
    );
    const error = computed<(Error | null)[]>(() =>
        [subjectError, instructorsError, studentsError, projectsError].map((error) => error.value)
    );
    return { status, isSuccess, isError, isLoading, data, error };
}

export function useRegisterToSubjectMutation(): UseMutationReturnType<
    Subject,
    Error,
    MaybeRef<string>,
    {}
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uuid) => await registerToSubject(toValue(uuid)),
        // TODO: Add optimistic update
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY() });
        },
    });
}
