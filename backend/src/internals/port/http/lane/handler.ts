import type AuthenticationService from "../../../services/authentication";
import type AppSecrets from "../../../../packages/secret";
import type LaneService from "../../../services/lane";
import {type Request, type Response, Router} from "express";
import {SuccessResponse, SuccessResponseWithCookies} from "../../../../packages/responses/success.ts";
import LaneSchema from "./schema.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import type {User} from "../../../domain/user";
import {StatusCodes} from "http-status-codes";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";

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

        this.router.patch(
            '/:laneId',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            ValidationMiddleware(this.redoLaneSchema, "body"),
            this.redoLane
        );

        this.router.get(
            '/:laneId/progress',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.getLaneProgress
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

    redoLane = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;

        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        const lane = {
            ...req.body,
            creator
        }

        await this.laneService.commands.redoLane.handle(laneId, lane)
        res.statusCode = StatusCodes.ACCEPTED
        new SuccessResponse(res, {message: "Lane redo in progress", laneId}).send();
    }

    getLaneProgress = async (req: Request, res: Response) => {
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        const progress = await this.laneService.queries.getLaneProgress.handle(laneId)
        new SuccessResponse(res, {progress}).send();
    }
}