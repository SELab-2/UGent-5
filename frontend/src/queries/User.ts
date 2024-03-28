import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { getUser, toggleAdmin } from "@/services/user";

function USER_QUERY_KEY(uid?: string): string[] {
    return uid ? ["user", uid] : ["user"];
}

export function useUserQuery(uid?: string): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({ queryKey: USER_QUERY_KEY(uid), queryFn: () => getUser(uid) });
}

export function useToggleAdminMutation(): UseMutationReturnType<void, Error, User, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleAdmin,
        onMutate: async (user: User) => {
            await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY() });
            // const previousUser = queryClient.getQueryData<User>(USER_QUERY_KEY());
            queryClient.setQueryData<User>(USER_QUERY_KEY(), () => {
                return { ...user, is_admin: !user.is_admin };
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY() });
        },
        onError: (_, user) => {
            alert("Could not update user");
            queryClient.setQueryData<User>(USER_QUERY_KEY(), () => user!);
        },
    });
}
