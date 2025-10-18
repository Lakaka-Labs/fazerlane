import type ChallengeService from "../../../services/challenge";
import {type Request, type Response, Router} from "express";
import {SuccessResponse} from "../../../../packages/responses/success.ts";
import ChallengeSchema from "./schema.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";
import type {User} from "../../../domain/user";
import type AppSecrets from "../../../../packages/secret";
import type {MarkChallengeParameters} from "../../../services/challenge/commands/markChallenge.ts";

export default class ChallengeHandler extends ChallengeSchema {
    appSecrets: AppSecrets
    challengeService: ChallengeService
    router = Router()

    constructor(challengeService: ChallengeService, appSecrets: AppSecrets) {
        super()
        this.challengeService = challengeService
        this.appSecrets = appSecrets

        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.get(
            '/lane/:laneId',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.getChallenges
        );

        this.router.post(
            '/lane/:laneId/restart',
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            this.restart
        );

        this.router.route('/:challengeId')
            .post(
                ValidationMiddleware(z.object({
                    challengeId: z.uuid(),
                }), "params"),
                ValidationMiddleware(z.object({
                    text: z.string().optional(),
                    comment: z.string().optional(),
                    files: z.array(z.uuid()).optional(),
                    useMemory: z.boolean().default(false),
                }), "body"),
                this.markChallenge,
            )
            .get(
                ValidationMiddleware(z.object({
                    challengeId: z.uuid(),
                }), "params"),
                this.getChallenge
            );

        this.router.post(
            '/:challengeId/unmark',
            ValidationMiddleware(z.object({
                challengeId: z.uuid(),
            }), "params"),
            this.unmarkChallenge
        );
    }

    getChallenges = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const laneId = req.params.laneId;

        const challenges = await this.challengeService.queries.getChallenges.handle(laneId, creator)
        new SuccessResponse(res, {challenges}).send();
    }

    getChallenge = async (req: Request, res: Response) => {
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
        const challengeId = req.params.challengeId;

        const challenge = await this.challengeService.queries.getChallenge.handle(challengeId,)
        new SuccessResponse(res, {challenge}).send();
    }

    unmarkChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
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

    markChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
        const challengeId = req.params.challengeId;
        const parameters: MarkChallengeParameters = {id: challengeId, userId: creator, useMemory: req.body.useMemory}
        if (req.body.text) parameters.text = req.body.text
        if (req.body.comment) parameters.comment = req.body.comment
        if (req.body.files) parameters.files = req.body.files
        const {pass, feedback} = await this.challengeService.commands.markChallenge.handle(parameters)
        new SuccessResponse(res, {pass, feedback}).send();
    }
}