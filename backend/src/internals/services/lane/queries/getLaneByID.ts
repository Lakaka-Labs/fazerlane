import type LaneRepository from "../../../domain/lane/repository.ts";
import type {Lane, LaneFilter} from "../../../domain/lane";

export default class GetLaneByID {
    laneRepository: LaneRepository

    constructor(laneRepository: LaneRepository) {
        this.laneRepository = laneRepository
    }

    async handle(id: string, userId?: string): Promise<Lane> {
        return this.laneRepository.getById(id, userId)
    }
}