import { computed, inject, type Ref } from "vue";
import type { Middleware, MiddlewareContext } from "./index";
import { QueryClient } from "@tanstack/vue-query";
import useIsAdmin from "@/composables/useIsAdmin";
import useIsTeacher from "@/composables/useIsTeacher";
import { useSubjectsQuery } from "@/queries/Subject";
import { useProjectsQuery } from "@/queries/Project";
import { useGroupQuery, useProjectGroupQuery } from "@/queries/Group";
import { useCurrentUserQuery } from "@/queries/User";

export interface CanVisitCondition {
    (
        queryClient: QueryClient,
        context: MiddlewareContext
    ): { condition: Ref<boolean>; isLoading: Ref<boolean> };
}

function useCanVisit(useCondition: CanVisitCondition): Middleware {
    return async (context) => {
        const { next } = context;
        // TODO: Figure out why this doesn't work anymore
        // const queryClient = inject<QueryClient>("queryClient", new QueryClient());
        const queryClient = new QueryClient();
        const { condition, isLoading } = useCondition(queryClient, context);
        const awaitLoading = () =>
            new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (!isLoading.value) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 10);
            });
        await awaitLoading();
        if (!condition.value) {
            return {
                next: () => next({ path: "not-found" }),
                final: true,
            };
        }
        return { next, final: false };
    };
}

export default useCanVisit;

export function useOrCondition(
    condition1: CanVisitCondition,
    condition2: CanVisitCondition
): CanVisitCondition {
    return (qc, ctx) => {
        const { condition: condition1Value, isLoading: isLoading1 } = condition1(qc, ctx);
        const { condition: condition2Value, isLoading: isLoading2 } = condition2(qc, ctx);
        return {
            condition: computed(() => condition1Value.value || condition2Value.value),
            isLoading: computed(() => isLoading1.value || isLoading2.value),
        };
    };
}

export function useAndCondition(
    condition1: CanVisitCondition,
    condition2: CanVisitCondition
): CanVisitCondition {
    return (qc, ctx) => {
        const { condition: condition1Value, isLoading: isLoading1 } = condition1(qc, ctx);
        const { condition: condition2Value, isLoading: isLoading2 } = condition2(qc, ctx);
        return {
            condition: condition1Value && condition2Value,
            isLoading: isLoading1 || isLoading2,
        };
    };
}

export const useIsAdminCondition: CanVisitCondition = (qc) => {
    const { isAdmin, isLoading } = useIsAdmin(qc);
    return { condition: isAdmin, isLoading };
};

export const useIsTeacherCondition: CanVisitCondition = (qc) => {
    const { isTeacher, isLoading } = useIsTeacher(qc);
    return { condition: isTeacher, isLoading };
};

export const useIsStudentOfSubjectCondition: CanVisitCondition = (qc, ctx) => {
    const subjectId = Number(ctx.to.params.subjectId);
    const { data: subjects, isLoading } = useSubjectsQuery(qc);
    const condition = computed(() => {
        return subjects.value?.as_student.findIndex((subject) => subject.id === subjectId) !== -1;
    });
    return { condition, isLoading };
};

export const useIsInstructorOfSubjectCondition: CanVisitCondition = (qc, ctx) => {
    const subjectId = Number(ctx.to.params.subjectId);
    const { data: subjects, isLoading } = useSubjectsQuery(qc);
    const condition = computed(() => {
        return (
            subjects.value?.as_instructor.findIndex((subject) => subject.id === subjectId) !== -1
        );
    });
    return { condition, isLoading };
};

export const useIsStudentOfProjectCondition: CanVisitCondition = (qc, ctx) => {
    const projectId = Number(ctx.to.params.projectId);
    const { data: projects, isLoading } = useProjectsQuery(qc);
    const condition = computed(() => {
        return projects.value?.as_student.findIndex((project) => project.id === projectId) !== -1;
    });
    return { condition, isLoading };
};

export const useIsInstructorOfProjectCondition: CanVisitCondition = (qc, ctx) => {
    const projectId = Number(ctx.to.params.projectId);
    const { data: projects, isLoading } = useProjectsQuery(qc);
    const condition = computed(() => {
        return (
            projects.value?.as_instructor.findIndex((project) => project.id === projectId) !== -1
        );
    });
    return { condition, isLoading };
};

export const useIsInGroupOfProjectCondition: CanVisitCondition = (qc, ctx) => {
    const projectId = Number(ctx.to.params.projectId);
    const { data: group, isLoading } = useProjectGroupQuery(projectId, qc);
    const condition = computed(() => {
        return group.value !== null;
    });
    return { condition, isLoading };
};

export const useIsInGroupCondition: CanVisitCondition = (qc, ctx) => {
    const groupId = Number(ctx.to.params.groupId);
    const { data: group, isLoading: isGroupLoading } = useGroupQuery(groupId, qc);
    const { data: user, isLoading: isUserLoading } = useCurrentUserQuery(qc);
    const condition = computed(() => {
        return group.value?.members.findIndex((member) => member.uid === user.value?.uid) !== -1;
    });
    return { condition, isLoading: computed(() => isGroupLoading.value || isUserLoading.value) };
};

export const useIsInstructorOfGroupCondition: CanVisitCondition = (qc, ctx) => {
    const groupId = Number(ctx.to.params.groupId);
    const { data: group, isLoading: isGroupLoading } = useGroupQuery(groupId, qc);
    const { data: projects, isLoading: isProjectsLoading } = useProjectsQuery(qc);
    const condition = computed(() => {
        return (
            projects.value?.as_instructor.findIndex(
                (project) => project.id === group.value?.project_id
            ) !== -1
        );
    });
    return {
        condition,
        isLoading: computed(() => isGroupLoading.value || isProjectsLoading.value),
    };
};
