import type Repository from "../../../domain/user/repository.ts";

export default class AddUsername {
    accountRepository: Repository;

    constructor(
        accountRepository: Repository,
    ) {
        this.accountRepository = accountRepository;
    }


    handle = async (id: string, username: string): Promise<void> => {
        await this.accountRepository.update(id, {username})
    };
}

