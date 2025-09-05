import {SQL} from "bun";
import AppSecrets from "../../packages/secret";
import type UserRepository from "../domain/user/repository.ts";
import UserRepositoryPG from "./user";

export type AdapterParameters = {
    postgresClient: SQL
    appSecrets: AppSecrets
}
export default class Adapters {
    userRepository: UserRepository
    constructor(parameters: AdapterParameters) {
        this.userRepository = new UserRepositoryPG(parameters.postgresClient)
    }
}