import type ChallengeService from "../../../services/challenge";
import {type Request, type Response, Router} from "express";
import {SuccessResponse} from "../../../../packages/responses/success.ts";
import ChallengeSchema from "./schema.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";
import type {User} from "../../../domain/user";

export default class ChallengeHandler extends ChallengeSchema {
    challengeService: ChallengeService
    router = Router()

    constructor(challengeService: ChallengeService) {
        super()
        this.challengeService = challengeService

        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.post(
            '/mark/:challengeId',
            ValidationMiddleware(z.object({
                challengeId: z.uuid(),
            }), "params"),
            this.markChallenge
        );
        this.router.post(
            '/unmark/:challengeId',
            ValidationMiddleware(z.object({
                challengeId: z.uuid(),
            }), "params"),
            this.unmarkChallenge
        );
        this.router.get(
            '/:laneId',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.getChallenge
        );
        this.router.post(
            '/:laneId/restart',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.restart
        );
    }

    getChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        const challenge = await this.challengeService.queries.getChallenge.handle(laneId,creator)
        new SuccessResponse(res, {challenge}).send();
    }
    markChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.challengeId) throw new BadRequestError("provide lane id")
        const challengeId = req.params.challengeId;

        await this.challengeService.commands.markChallenge.handle(challengeId, creator)
        new SuccessResponse(res).send();
    }
    unmarkChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.challengeId) throw new BadRequestError("provide lane id")
        const challengeId = req.params.challengeId;

        await this.challengeService.commands.unmarkChallenge.handle(challengeId, creator)
        new SuccessResponse(res).send();
    }

    restart = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        await this.challengeService.commands.unmarkAllChallenge.handle(laneId, creator)
        new SuccessResponse(res).send();
    }
}