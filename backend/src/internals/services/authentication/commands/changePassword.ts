import type Repository from "../../../domain/user/repository.ts";
import {compareHash, encrypt} from "../../../../packages/utils/encryption.ts";
import {BadRequestError, ForbiddenError} from "../../../../packages/errors";

export default class ChangePassword {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string,oldPassword: string,newPassword: string): Promise<void> => {
        const user = await this.accountRepository.get({id})
        if (user.googleId) throw new ForbiddenError("login with your google account")

        const passwordCorrect = compareHash(oldPassword, user.password);
        if (!passwordCorrect) {
            throw new ForbiddenError(`wrong password`);
        }

        const hashedPassword = await encrypt(newPassword);
        await this.accountRepository.update(id, {password: hashedPassword})
    };
}

