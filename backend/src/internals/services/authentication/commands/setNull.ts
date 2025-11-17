import type Repository from "../../../domain/user/repository.ts";
import {compareHash, encrypt} from "../../../../packages/utils/encryption.ts";
import {BadRequestError, ForbiddenError} from "../../../../packages/errors";
import type {SetNullParameters, User} from "../../../domain/user";

export default class SetNull {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string, parameter: SetNullParameters): Promise<void> => {
        await this.accountRepository.setNull(id, parameter)
    };
}

