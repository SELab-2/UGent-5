import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import type Subject from "@/models/Subject";
import {
    getSubject,
    getSubjectInstructors,
    getSubjectProjects,
    getSubjects,
    getSubjectStudents,
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


// todo make this work or implement all sub-queries as normal in the component
export function useSubjectDetailsQuery(subjectId){
    const subjectQueryResult = useSubjectQuery(subjectId);
    const instructorsQueryResult = useSubjectInstructorsQuery(subjectId);
    const studentsQueryResult = useSubjectStudentsQuery(subjectId);
    const projectsQueryResult = useSubjectProjectsQuery(subjectId);

    const isLoading =
        subjectQueryResult.isLoading ||
        instructorsQueryResult.isLoading ||
        studentsQueryResult.isLoading ||
        projectsQueryResult.isLoading;

    const isError =
        subjectQueryResult.isError ||
        instructorsQueryResult.isError ||
        studentsQueryResult.isError ||
        projectsQueryResult.isError;

    const data = {
        id: subjectQueryResult.data?.id,
        name: subjectQueryResult.data?.name,
        instructors: instructorsQueryResult.data || [],
        students: studentsQueryResult.data || [],
        projects: projectsQueryResult.data || []
    };

    const error = subjectQueryResult.error || instructorsQueryResult.error || studentsQueryResult.error || projectsQueryResult.error;

    return {
        isLoading,
        isError,
        data,
        error
    };
}

