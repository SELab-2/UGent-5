import type UserDTO from "./UserModel";
import type { UserRepository } from "./UserRepository";

export function useGetUserUseCase(repository: UserRepository) {
    return async (uid?: string): Promise<UserDTO> => {
        return repository.getUser(uid);
    };
}
