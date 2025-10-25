import type LaneRepository from "../../../domain/lane/repository.ts";
import type {Lane, LaneFilter} from "../../../domain/lane";
import type BaseFilter from "../../../../packages/types/filter";

export default class GetFeaturedLanes {
    laneRepository: LaneRepository

    constructor(laneRepository: LaneRepository) {
        this.laneRepository = laneRepository
    }

    async handle(filter: LaneFilter): Promise<Lane[]> {
        return this.laneRepository.getFeaturedLanes(filter)
    }
}