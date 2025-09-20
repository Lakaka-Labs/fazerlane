import type Repository from "../../../domain/user/repository.ts";
import {generateEmailToken} from "../../../../packages/utils/encryption.ts";
import {type EmailParameters, EmailType} from "../../../domain/email/email.ts";
import VerifyEmail from "../../../../packages/emails/verifyEmail.ts";
import type AppSecrets from "../../../../packages/secret";
import type {EmailRepository} from "../../../domain/email/repository.ts";
import {BadRequestError} from "../../../../packages/errors";
import ResetPasswordEmail from "../../../../packages/emails/resetPasswordEmail.ts";

export default class ForgotPassword {
    accountRepository: Repository;
    appSecrets: AppSecrets;
    emailRepository: EmailRepository;

    constructor(accountRepository: Repository, appSecrets: AppSecrets, emailRepository: EmailRepository) {
        this.accountRepository = accountRepository;
        this.appSecrets = appSecrets;
        this.emailRepository = emailRepository;
    }


    handle = async (email: string): Promise<void> => {
        const user = await this.accountRepository.get({email})

        const verifyUrl = `${this.appSecrets.urls.resetPasswordEmail}?token=${generateEmailToken({id: user.id})}`
        const emailParameters: EmailParameters = {
            type: EmailType.HTML,
            subject: "Reset your password",
            email,
            message: ResetPasswordEmail(verifyUrl, this.appSecrets.urls.logo),
        };

        try {
            this.emailRepository.send(emailParameters).catch();
        } catch (e) {
            console.log(e)
        }
    };
}

