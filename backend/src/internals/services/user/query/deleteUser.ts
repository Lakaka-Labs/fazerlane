import type Repository from "../../../domain/user/repository.ts";
import type {User} from "../../../domain/user";

export default class DeleteUser {
    userRepository: Repository

    constructor(userRepository: Repository) {
        this.userRepository = userRepository
    }

    async deleteUser(user: User): Promise<void> {
        return await this.userRepository.delete(user)
    }
}