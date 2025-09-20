import type Repository from "../../../domain/user/repository.ts";
import {SQL} from "bun";
import {ErrorResponse} from "../../../../packages/responses/error.ts";
import {StatusCodes} from "http-status-codes";
import {BadRequestError} from "../../../../packages/errors";

export default class AddUsername {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string, username: string): Promise<void> => {
        try {
            await this.accountRepository.update(id, {username})
        } catch (err) {
            if (err instanceof SQL.PostgresError && err.errno == `23505`) {
                throw new BadRequestError("username not available");
            }
            throw err
        }
    };
}

