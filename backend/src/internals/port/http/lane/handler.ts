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
import type {LaneFilter} from "../../../domain/lane";
import type BaseFilter from "../../../../packages/types/filter";

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
        ).get('/',
            ValidationMiddleware(this.getLanesSchema, "query"),
            this.getLanes
        );

        this.router.get('/featured',
            ValidationMiddleware(this.getLanesSchema, "query"),
            this.getFeaturedLanes
        );

        this.router.put(
            '/:laneId',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.redoLane
        ).get(
                '/:laneId',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.getLanesByID
        );

        this.router.get(
            '/:laneId/progress',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.getLaneProgress
        );
        this.router.post(
            '/:laneId/add',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.addLane
        );
        this.router.delete(
            '/:laneId/remove',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.removeLane
        );
    }

    createLane = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        const lane = {
            ...req.body,
            creator
        }
        const laneId = await this.laneService.commands.createLane.handle(creator, req.body.youtube, req.body.startTime, req.body.endTime)
        res.statusCode = StatusCodes.ACCEPTED
        new SuccessResponse(res, {message: "Lane creation in progress", laneId}).send();
    }

    redoLane = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;

        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        await this.laneService.commands.redoLane.handle(laneId)
        res.statusCode = StatusCodes.ACCEPTED
        new SuccessResponse(res, {message: "Lane redo in progress", laneId}).send();
    }

    getLaneProgress = async (req: Request, res: Response) => {
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        const progress = await this.laneService.queries.getLaneProgress.handle(laneId)
        new SuccessResponse(res, {progress}).send();
    }

    getLanes = async (req: Request, res: Response) => {
        const userId = (req.user as User).id;
        const filter: LaneFilter = {
            userId: userId,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }

        const lanes = await this.laneService.queries.getLanes.handle(filter)
        new SuccessResponse(res, {lanes}).send();
    }

    getFeaturedLanes = async (req: Request, res: Response) => {
        const userId = (req.user as User).id;
        const filter: LaneFilter = {
            userId: userId,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }

        const lanes = await this.laneService.queries.getFeaturedLanes.handle(filter)
        new SuccessResponse(res, {lanes}).send();
    }

    getLanesByID = async (req: Request, res: Response) => {
        const userId = (req.user as User).id;
        const laneId = req.params.laneId;

        if (!laneId) throw new BadRequestError("provide lane id")


        const lane = await this.laneService.queries.getLaneByID.handle(laneId, userId)
        new SuccessResponse(res, {lane}).send();
    }

    addLane = async (req: Request, res: Response) => {
        const userId = (req.user as User).id;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        await this.laneService.commands.addLane.handle(laneId, userId)
        new SuccessResponse(res).send();
    }

    removeLane = async (req: Request, res: Response) => {
        const userId = (req.user as User).id;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        await this.laneService.commands.removeLane.handle(laneId, userId)
        new SuccessResponse(res).send();
    }
}