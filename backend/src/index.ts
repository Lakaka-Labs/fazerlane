import AppSecrets from "./packages/secret";
import Ports from "./internals/port";

class FazerlineBackend {
    private readonly appSecrets: AppSecrets
    port: Ports

    constructor() {
        this.appSecrets = new AppSecrets()
        this.port = new Ports(this.appSecrets)
    }

    run() {
        this.port.httpPort.listen()
    }
}

const fazerlineBackend = new FazerlineBackend()
fazerlineBackend.run()