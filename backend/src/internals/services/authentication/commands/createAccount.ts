import type Repository from "../../../domain/user/repository.ts";
import {encrypt, generateJWTToken, generateRefreshJWTToken} from "../../../../packages/utils/encryption.ts";
import type Payload from "../../../../packages/types/payload";
import type AppSecrets from "../../../../packages/secret";

export default class CreateAccount {
    accountRepository: Repository;
    appSecrets: AppSecrets;

    constructor(
        accountRepository: Repository,appSecrets: AppSecrets
    ) {
        this.accountRepository = accountRepository;
        this.appSecrets = appSecrets;
    }

    handle = async (email: string, username: string, password: string): Promise<{
        token: string,
        refreshToken: string
    }> => {
        const hashedPassword = await encrypt(password);
        const user = await this.accountRepository.add({email, password: hashedPassword})

        const payload: Payload = {id: user.id};
        const emailToken = generateJWTToken(payload);
        const verify
        const token = generateJWTToken(payload);
        const refreshToken = generateRefreshJWTToken(payload);
        return {token, refreshToken}
    };
}

