import type Repository from "../../domain/user/repository.ts";
import Authenticate from "./commands/authenticate.ts";
import GetDetails from "./query/getDetails.ts";
import CreateAccount from "./commands/createAccount.ts";
import DeleteAccount from "./commands/deleteAccount.ts";
import AddUsername from "./commands/addUsername.ts";
import type AppSecrets from "../../../packages/secret";
import type {EmailRepository} from "../../domain/email/repository.ts";
import VerifyEmail from "./commands/verifyEmail.ts";
import ResendVerificationEmail from "./commands/resendVerificationEmail.ts";
import ResetPassword from "./commands/resetPassword.ts";
import ChangePassword from "./commands/changePassword.ts";
import ForgotPassword from "./commands/forgotPassword.ts";
import Login from "./query/login.ts";
import UpdateProfile from "./commands/updateProfile.ts";

export class Commands {
    authenticate: Authenticate
    createAccount: CreateAccount
    deleteAccount: DeleteAccount
    addUsername: AddUsername
    verifyEmail: VerifyEmail
    resendVerificationEmail: ResendVerificationEmail
    forgotPassword: ForgotPassword
    resetPassword: ResetPassword
    changePassword: ChangePassword
    updateProfile: UpdateProfile

    constructor(userRepository: Repository, appSecrets: AppSecrets, emailRepository: EmailRepository) {
        this.authenticate = new Authenticate(userRepository)
        this.createAccount = new CreateAccount(userRepository, appSecrets, emailRepository)
        this.deleteAccount = new DeleteAccount(userRepository)
        this.addUsername = new AddUsername(userRepository)
        this.verifyEmail = new VerifyEmail(userRepository)
        this.resendVerificationEmail = new ResendVerificationEmail(userRepository, appSecrets, emailRepository)
        this.forgotPassword = new ForgotPassword(userRepository, appSecrets, emailRepository)
        this.resetPassword = new ResetPassword(userRepository)
        this.changePassword = new ChangePassword(userRepository)
        this.updateProfile = new UpdateProfile(userRepository)
    }

}

export class Queries {
    getDetails: GetDetails
    login: Login

    constructor(userRepository: Repository) {
        this.getDetails = new GetDetails(userRepository)
        this.login = new Login(userRepository)
    }
}

export default class AuthenticationService {
    commands: Commands
    queries: Queries

    constructor(userRepository: Repository, appSecrets: AppSecrets, emailRepository: EmailRepository) {
        this.commands = new Commands(userRepository, appSecrets, emailRepository)
        this.queries = new Queries(userRepository)
    }
}