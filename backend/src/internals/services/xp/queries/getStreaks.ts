import type XPRepository from "../../../domain/xp/repository.ts";
import type BaseFilter from "../../../../packages/types/filter";

export default class GetStreaks {
    xpRepository: XPRepository

    constructor(xpRepository: XPRepository) {
        this.xpRepository = xpRepository
    }

    async handle(userId: string, filter: BaseFilter): Promise<Date[]> {
        return this.xpRepository.getStreaks(userId, filter)
    }
}