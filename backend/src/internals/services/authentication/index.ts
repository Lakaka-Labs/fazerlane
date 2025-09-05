import type Repository from "../../domain/user/repository.ts";
import Authenticate from "./commands/authenticate.ts";
import GetDetails from "./query/getDetails.ts";

export class Commands {
    authenticate: Authenticate
    constructor(userRepository: Repository) {
        this.authenticate = new Authenticate(userRepository)
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