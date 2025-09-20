import type Repository from "../../domain/user/repository.ts";
import Authenticate from "./commands/authenticate.ts";
import GetDetails from "./query/getDetails.ts";
import CreateAccount from "./commands/createAccount.ts";
import DeleteAccount from "./commands/deleteAccount.ts";
import AddUsername from "./commands/addUsername.ts";

export class Commands {
    authenticate: Authenticate
    createAccount: CreateAccount
    deleteAccount: DeleteAccount
    addUsername: AddUsername

    constructor(userRepository: Repository) {
        this.authenticate = new Authenticate(userRepository)
        this.createAccount = new CreateAccount(userRepository)
        this.deleteAccount = new DeleteAccount(userRepository)
        this.addUsername = new AddUsername(userRepository)
    }

}

export class Queries {
    getDetails: GetDetails

    constructor(userRepository: Repository) {
        this.getDetails = new GetDetails(userRepository)
    }
}

export default class AuthenticationService {
    commands: Commands
    queries: Queries

    constructor(userRepository: Repository) {
        this.commands = new Commands(userRepository)
        this.queries = new Queries(userRepository)
    }
}