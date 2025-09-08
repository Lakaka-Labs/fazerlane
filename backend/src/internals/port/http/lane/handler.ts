import type AuthenticationService from "../../../services/authentication";
import type AppSecrets from "../../../../packages/secret";
import type LaneService from "../../../services/lane";
import {type Request, type Response, Router} from "express";
import {SuccessResponse, SuccessResponseWithCookies} from "../../../../packages/responses/success.ts";
import LaneSchema from "./schema.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import type {User} from "../../../domain/user";
import {StatusCodes} from "http-status-codes";

export default class LaneHandler extends LaneSchema {
    laneService: LaneService
    router = Router()

    constructor(laneService: LaneService) {
        super()
        this.laneService = laneService

        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.post(
            '/',
            ValidationMiddleware(this.createLaneSchema, "body"),
            this.createLane
        );
    }

    createLane = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        const lane = {
            ...req.body,
            creator
        }
        const laneId = await this.laneService.commands.createLane.handle(lane)
        res.statusCode = StatusCodes.ACCEPTED
        new SuccessResponse(res, {message: "Lane creation in progress", laneId}).send();
    }
}