import type Repository from "../../../domain/user/repository.ts";
import type {GetUserParameters, User} from "../../../domain/user";
import {BadRequestError, ForbiddenError, NotFoundError} from "../../../../packages/errors";
import {compareHash, encrypt} from "../../../../packages/utils/encryption.ts";

export default class Login {
    userRepository: Repository

    constructor(userRepository: Repository) {
        this.userRepository = userRepository
    }

    async handle(password: string, email?: string, username?: string): Promise<User> {
        let user: User
        try {
            user = await this.userRepository.get({username, email})
        } catch (e) {
            if (e instanceof NotFoundError) throw new BadRequestError("wrong credentials")
            throw e
        }
        const passwordCorrect = compareHash(password, user.password);
        if (!passwordCorrect) {
            throw new ForbiddenError(`wrong credentials`);
        }

        delete user.password

        return user
    }
}