import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    useQueryClient,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import type Project from "@/models/Project";
import { getProject, submitProject } from "@/services/project";
import { computed, type ComputedRef } from "vue";
import type User from "@/models/User";
import { toggleAdmin } from "@/services/user";
import { useRouter } from "vue-router";

function PROJECT_QUERY_KEY(
    projectId: ComputedRef<number | undefined>
): (string | ComputedRef<number | undefined>)[] {
    return ["project", projectId];
}

export function useProjectQuery(
    projectId: ComputedRef<number | undefined>
): UseQueryReturnType<Project, Error> {
    return useQuery<Project, Error>({
        queryKey: PROJECT_QUERY_KEY(projectId),
        queryFn: () => getProject(projectId.value!),
        enabled: computed(() => !!projectId.value),
    });
}

export function useSubmitProjectMutation(projectId: number, formData: FormData): UseMutationReturnType<void, Error, void, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => submitProject(projectId, formData),
        onSuccess: (data, variables) => {
            const router = useRouter();
        },
        onError: () => {
            alert("Could not submit project");
        },
    });
}

