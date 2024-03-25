import { useQuery, useMutation, useQueryClient } from "vue-query";
import { getUser, type User } from "@/helpers/datafetchers/User";
import { authorized_fetch } from "@/helpers/datafetchers";

const USER_QUERY_KEY = (uid?: string) => (uid ? ["user", uid] : ["user"]);

export function useUserQuery(uid?: string) {
    return useQuery<User, Error>(USER_QUERY_KEY(uid), () => getUser(uid));
}

export function useUserMutation() {
    const queryClient = useQueryClient();
    return useMutation(
        async () => {
            await authorized_fetch("/api/users/me", { method: "POST" });
        },
        {
            onMutate: async () => {
                await queryClient.cancelQueries(USER_QUERY_KEY());
                const previousUser = queryClient.getQueryData<User>(USER_QUERY_KEY());
                queryClient.setQueryData<User>(USER_QUERY_KEY(), (old) => {
                    if (!old) return {} as User;
                    return { ...old, is_admin: !old.is_admin };
                });
                return previousUser;
            },
            onSettled: async () => {
                await queryClient.invalidateQueries(USER_QUERY_KEY());
            },
            onError: (error, variables, context) => {
                // TODO: implement error handling
            },
        }
    );
}
