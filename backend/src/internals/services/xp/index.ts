import type XPRepository from "../../domain/xp/repository.ts";
import GetStreaks from "./queries/getStreaks.ts";
import GetXPs from "./queries/getXPs.ts";

export class Commands {
    constructor(xpRepository: XPRepository) {
    }
}

export class Queries {
    getStreaks: GetStreaks
    getXPs: GetXPs

    constructor(xpRepository: XPRepository) {
        this.getStreaks = new GetStreaks(xpRepository)
        this.getXPs = new GetXPs(xpRepository)
    }
}

export default class XPService {
    commands: Commands
    queries: Queries

    constructor(xpRepository: XPRepository) {
        this.commands = new Commands(xpRepository)
        this.queries = new Queries(xpRepository)
    }
}