import type {XP, XPFilter} from "../../../domain/xp";
import type XPRepository from "../../../domain/xp/repository.ts";

export default class GetXPs {
    xpRepository: XPRepository

    constructor(xpRepository: XPRepository) {
        this.xpRepository = xpRepository
    }

    async handle(userId: string, filter: XPFilter): Promise<XP[]> {
        return this.xpRepository.getXPs(userId, filter)
    }
}