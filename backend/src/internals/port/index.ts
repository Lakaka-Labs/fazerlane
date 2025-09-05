import HTTPPort from "./http";
import AppSecrets from "../../packages/secret";
import Services from "../services";

export default class Ports {
    httpPort: HTTPPort

    constructor(applicationSecret: AppSecrets, services: Services) {
        this.httpPort = new HTTPPort(applicationSecret,services)
    }
}