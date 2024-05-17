import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { UseQueryReturnType, UseMutationReturnType, QueryClient } from "@tanstack/vue-query";
import type User from "@/models/User";
import {
    getCurrentUser,
    getUser,
    getUsers,
    toggleAdmin,
    toggleTeacher,
    deleteUser,
} from "@/services/user";

export function CURRENT_USER_QUERY_KEY(): string[] {
    return ["user"];
}

export function USER_QUERY_KEY(uid: string): string[] {
    return ["user", uid];
}

export function USERS_QUERY_KEY(): string[] {
    return ["users"];
}

/**
 * Query composable for fetching the current user
 */
export function useCurrentUserQuery(queryClient?: QueryClient): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>(
        {
            queryKey: CURRENT_USER_QUERY_KEY(),
            queryFn: () => getCurrentUser(),
        },
        queryClient
    );
}

/**
 * Query composable for fetching a user by uid
 * @param uid Ref to the uid of the user to fetch
 */
export function useUserQuery(
    uid: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({
        queryKey: computed(() => USER_QUERY_KEY(toValue(uid)!)),
        queryFn: () => getUser(toValue(uid)!),
        enabled: () => !!toValue(uid),
    });
}

/**
 * Query composable for fetching all users
 */
export function useUsersQuery(): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: USERS_QUERY_KEY(),
        queryFn: getUsers,
    });
}

/**
 * Generic mutation composable for toggling a boolean field in a user object
 * @param toggleFn Function that toggles the field in the backend
 * @param getField Function that gets the field to toggle
 * @param setField Function that sets the field to toggle
 */
// TODO: Use USER_QUERY_KEY(uid) instead of USERS_QUERY_KEY() for invalidation
function useToggleMutation(
    toggleFn: (uid: string) => Promise<User>,
    getField: (_: User) => boolean,
    setField: (_: User, value: boolean) => void
): UseMutationReturnType<User, Error, string, { previousUsers: User[] }> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid) => await toggleFn(uid),
        onMutate: async (uid: string) => {
            const users = queryClient.getQueryData<User[]>(USERS_QUERY_KEY());
            await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY() });
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY(), () => {
                return users?.map((user: User) => {
                    const mappedUser = { ...user };
                    setField(mappedUser, user.uid === uid ? !getField(user) : getField(user));
                    return mappedUser;
                });
            });
            return { previousUsers: users || [] };
        },
        onSettled: (_, __, uid, ctx) => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY() });
        },
        onError: (_, uid, ctx) => {
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY(), () => ctx!.previousUsers!);
            alert("Could not update user");
        },
    });
}

/**
 * Mutation composable for toggling the admin status of a user
 */
export function useToggleAdminMutation(): UseMutationReturnType<
    User,
    Error,
    string,
    { previousUsers: User[] }
> {
    return useToggleMutation(
        toggleAdmin,
        (user) => user.is_admin,
        (user, value) => (user.is_admin = value)
    );
}

/**
 * Mutation composable for toggling the teacher status of a user
 */
export function useToggleTeacherMutation(): UseMutationReturnType<
    User,
    Error,
    string,
    { previousUsers: User[] }
> {
    return useToggleMutation(
        toggleTeacher,
        (user) => user.is_teacher,
        (user, value) => (user.is_teacher = value)
    );
}

export function useDeleteUserMutation(): UseMutationReturnType<
    void,
    Error,
    string,
    { previousUsers: User[] }
> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (uid) => {
            await deleteUser(uid);
        },
        onMutate: async (uid) => {
            const users = queryClient.getQueryData<User[]>(USERS_QUERY_KEY());
            await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY() });
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY(), () => {
                return users?.filter((user: User) => user.uid !== uid);
            });
            return { previousUsers: users || [] };
        },
        onSettled: (_, __, uid, ctx) => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY() });
        },
        onError: (err, uid, ctx) => {
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY(), () => ctx!.previousUsers!);
            alert("Could not delete user");
        },
    });
}
