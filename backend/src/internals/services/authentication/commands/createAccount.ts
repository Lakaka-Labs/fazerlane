import type Repository from "../../../domain/user/repository.ts";
import {
    encrypt,
    generateEmailToken,
    generateJWTToken,
    generateRefreshJWTToken
} from "../../../../packages/utils/encryption.ts";
import type Payload from "../../../../packages/types/payload";
import type AppSecrets from "../../../../packages/secret";
import VerifyEmail from "../../../../packages/emails/verifyEmail.ts";
import {type EmailParameters, EmailType} from "../../../domain/email/email.ts";
import type {EmailRepository} from "../../../domain/email/repository.ts";
import type {User} from "../../../domain/user";
import {SQL} from "bun";
import {BadRequestError} from "../../../../packages/errors";

export default class CreateAccount {
    accountRepository: Repository;
    appSecrets: AppSecrets;
    emailRepository: EmailRepository;

    constructor(accountRepository: Repository, appSecrets: AppSecrets, emailRepository: EmailRepository) {
        this.accountRepository = accountRepository;
        this.appSecrets = appSecrets;
        this.emailRepository = emailRepository;
    }

    handle = async (email: string, username: string, password: string): Promise<User> => {
        try {
            const hashedPassword = await encrypt(password);
            const user = await this.accountRepository.add({email, password: hashedPassword, username, emailVerified: false})

            const verifyUrl = `${this.appSecrets.urls.verifyEmail}?token=${generateEmailToken({id: user.id})}`
            const emailParameters: EmailParameters = {
                type: EmailType.HTML,
                subject: "Verify your email",
                email,
                message: VerifyEmail(verifyUrl, this.appSecrets.urls.logo),
            };

            try {
                this.emailRepository.send(emailParameters).catch();
            } catch (e) {
                console.log(e)
            }

            return user
        } catch (err) {
            if (err instanceof SQL.PostgresError && err.errno == `23505`) {
                if (err.detail?.includes('email')) {
                    throw new BadRequestError("account with email already exist");
                }
                if (err.detail?.includes('username')) {
                    throw new BadRequestError("username is not available");
                }
            }
            throw err
        }

    };
}

