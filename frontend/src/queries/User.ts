import { useQuery, useMutation, useQueryClient } from "vue-query";
import { authorized_fetch } from "@/helpers/datafetchers";
import type UserDTO from "@/module/user/UserModel";
import { useGetUserUseCase } from "@/module/user/UserUseCase";
import { FetchUserRepository } from "@/module/user/UserRepository";

const USER_QUERY_KEY = (uid?: string) => (uid ? ["user", uid] : ["user"]);

export function useUserQuery(uid?: string) {
    return useQuery<UserDTO, Error>(USER_QUERY_KEY(uid), () => {
        const getUser = useGetUserUseCase(new FetchUserRepository(authorized_fetch));
        return getUser(uid);
    });
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
                const previousUser = queryClient.getQueryData<UserDTO>(USER_QUERY_KEY());
                queryClient.setQueryData<UserDTO>(USER_QUERY_KEY(), (old) => {
                    if (!old) return {} as UserDTO;
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
