import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import { getUser, type User } from "@/helpers/datafetchers/User";
import { authorized_fetch } from "@/helpers/datafetchers";

function USER_QUERY_KEY(uid?: string): string[] {
    return uid ? ["user", uid] : ["user"];
}

export function useUserQuery(uid?: string): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({ queryKey: USER_QUERY_KEY(uid), queryFn: () => getUser(uid) });
}

export function useToggleAdminMutation(): UseMutationReturnType<User, Error, User, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authorized_fetch("/api/users/me", { method: "POST" }),
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
