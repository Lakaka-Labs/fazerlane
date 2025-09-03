import HTTPPort from "./http";
import AppSecrets from "../../packages/secret";

export default class Ports {
    httpPort: HTTPPort

    constructor(applicationSecret: AppSecrets) {
        this.httpPort = new HTTPPort(applicationSecret)
    }
}