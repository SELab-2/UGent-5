import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
    type QueryClient,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { getMySubjects, getUser, getUsers, toggleAdmin, toggleTeacher } from "@/services/user";
import { type Ref, computed } from "vue";
import type { UserSubjectList } from "@/models/Subject";

function USER_QUERY_KEY(uid: string | null): string[] {
    return uid ? ["user", uid] : ["user"];
}

function USERS_QUERY_KEY(): string[] {
    return ["users"];
}

export function useUserQuery(
    uid: Ref<string | undefined> | null,
    queryClient?: QueryClient
): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>(
        {
            queryKey: computed(() => USER_QUERY_KEY(uid?.value!)),
            queryFn: () => getUser(uid?.value!),
            enabled: uid === null || uid?.value !== undefined,
        },
        queryClient
    );
}

export function useUsersQuery(): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: USERS_QUERY_KEY(),
        queryFn: () => getUsers(),
    });
}

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
            return { previousUsers: users! };
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

// Hook for fetching subjects for a user
export function useMySubjectsQuery(): UseQueryReturnType<UserSubjectList, Error> {
    return useQuery<UserSubjectList, Error>({
        queryKey: ["mySubjects"],
        queryFn: () => {
            console.log("Fetching subjects with mock data");
            return getMySubjects();
        },
    });
}
