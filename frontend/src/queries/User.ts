import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryReturnType,
    type UseMutationReturnType,
} from "@tanstack/vue-query";
import type User from "@/models/User";
import { getMySubjects, getUser, getUsers, toggleAdmin } from "@/services/user";
import { type Ref, computed } from "vue";
import type { UserSubjectList } from "@/models/Subject";

function USER_QUERY_KEY(uid: string | null): string[] {
    return uid ? ["user", uid] : ["user"];
}

function USERS_QUERY_KEY(): string[] {
    return ["users"];
}

export function useUserQuery(uid: Ref<string | undefined> | null): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({
        queryKey: computed(() => USER_QUERY_KEY(uid?.value!)),
        queryFn: () => getUser(uid?.value!),
        enabled: uid === null || uid?.value !== undefined,
    });
}

export function useUsersQuery(): UseQueryReturnType<User[], Error> {
    return useQuery<User[], Error>({
        queryKey: USERS_QUERY_KEY(),
        queryFn: () => getUsers(),
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
