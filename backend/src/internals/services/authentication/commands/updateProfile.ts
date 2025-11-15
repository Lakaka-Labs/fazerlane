import type Repository from "../../../domain/user/repository.ts";
import {compareHash, encrypt} from "../../../../packages/utils/encryption.ts";
import {BadRequestError, ForbiddenError} from "../../../../packages/errors";
import type {User} from "../../../domain/user";

export default class UpdateProfile {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string, userParams: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<void> => {
        console.log(userParams)
        await this.accountRepository.update(id, userParams)
    };
}

