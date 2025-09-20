import type Repository from "../../../domain/user/repository.ts";
import {encrypt} from "../../../../packages/utils/encryption.ts";
import {BadRequestError, ForbiddenError} from "../../../../packages/errors";

export default class ResetPassword {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string,newPassword: string): Promise<void> => {
        const user = await this.accountRepository.get({id})
        if (user.googleId) throw new ForbiddenError("login with your google account")

        const hashedPassword = await encrypt(newPassword);
        await this.accountRepository.update(id, {password: hashedPassword})
    };
}

