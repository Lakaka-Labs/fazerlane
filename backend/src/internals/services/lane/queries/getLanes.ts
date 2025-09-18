import type LaneRepository from "../../../domain/lane/repository.ts";
import type {Lane, LaneFilter} from "../../../domain/lane";

export default class GetLanes {
    laneRepository: LaneRepository

    constructor(laneRepository: LaneRepository) {
        this.laneRepository = laneRepository
    }

    async handle(filter: LaneFilter): Promise<Lane[]> {
        return this.laneRepository.getLanes(filter)
    }
}