import { inject, type Ref } from "vue";
import { type Middleware } from "./index";
import { QueryClient } from "@tanstack/vue-query";
import useIsAdmin from "@/composables/useIsAdmin";

export interface CanVisitCondition {
    (queryClient: QueryClient): { condition: Ref<boolean>; isLoading: Ref<boolean> };
}

function useCanVisit(useCondition: CanVisitCondition): Middleware {
    return async ({ to, next, router }) => {
        const queryClient = inject<QueryClient>("queryClient", new QueryClient());
        const { condition, isLoading } = useCondition(queryClient);
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

export const useIsAdminCondition: CanVisitCondition = (queryClient) => {
    const { isAdmin, isLoading } = useIsAdmin(queryClient);
    return { condition: isAdmin, isLoading };
}
