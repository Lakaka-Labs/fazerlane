import type {GetUserParameters, User} from "./index.ts";

export default interface Repository {
    get: (parameter: GetUserParameters) => Promise<User>
    add: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<User>
}