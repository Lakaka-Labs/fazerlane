import type Repository from "../../../domain/user/repository.ts";
import type {User} from "../../../domain/user";

export default class UpdateUser {
    userRepository: Repository

    constructor(userRepository: Repository) {
        this.userRepository = userRepository
    }

    async updateUser(user: User): Promise<User> {
        return await this.userRepository.update(user)
    }
}