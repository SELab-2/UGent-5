import { computed, inject, type Ref } from "vue";
import type { Middleware, MiddlewareContext } from "./index";
import { QueryClient } from "@tanstack/vue-query";
import useIsAdmin from "@/composables/useIsAdmin";
import useIsTeacher from "@/composables/useIsTeacher";
import { useSubjectsQuery } from "@/queries/Subject";

export interface CanVisitCondition {
    (queryClient: QueryClient, context: MiddlewareContext): { condition: Ref<boolean>; isLoading: Ref<boolean> };
}

function useCanVisit(useCondition: CanVisitCondition): Middleware {
    return async (context) => {
        const { next, router } = context;
        const queryClient = inject<QueryClient>("queryClient", new QueryClient());
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
            router.replace({ path: "forbidden" });
        }
        return next();
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

export const useIsPartOfSubjectCondition: CanVisitCondition = (qc) => {
    return { condition: false, isLoading: false };
};
