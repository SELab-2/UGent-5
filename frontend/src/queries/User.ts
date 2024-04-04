import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { getUser, toggleAdmin } from "@/services/user";
import { type Ref, computed } from "vue";

function USER_QUERY_KEY(uid: string | null): string[] {
    return uid ? ["user", uid] : ["user"];
}

export function useUserQuery(uid: Ref<string | undefined> | null): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({
        queryKey: computed(() => USER_QUERY_KEY(uid?.value!)),
        queryFn: () => getUser(uid?.value!),
        enabled: uid === null || uid?.value !== undefined,
    });
}

// TODO: Now only toggles current user
export function useToggleAdminMutation(): UseMutationReturnType<void, Error, User, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleAdmin,
        onMutate: async (user: User) => {
            await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY(null) });
            queryClient.setQueryData<User>(USER_QUERY_KEY(null), () => {
                return { ...user, is_admin: !user.is_admin };
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY(null) });
        },
        onError: (_, user) => {
            alert("Could not update user");
            queryClient.setQueryData<User>(USER_QUERY_KEY(null), () => user!);
        },
    });
}
