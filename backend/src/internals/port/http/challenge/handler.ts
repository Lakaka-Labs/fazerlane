import type ChallengeService from "../../../services/challenge";
import {type NextFunction, type Request, type Response, Router} from "express";
import {SuccessResponse} from "../../../../packages/responses/success.ts";
import ChallengeSchema from "./schema.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";
import type {User} from "../../../domain/user";
import {CreateUploadMiddleware} from "../middlewares/upload.ts";
import type AppSecrets from "../../../../packages/secret";
import {GetVideoDuration} from "../../../../packages/utils/video.ts";
import type {Challenge} from "../../../domain/challenge";
import * as fs from "node:fs";
import type {markChallengeParameters} from "../../../services/challenge/commands/markChallenge.ts";
import multer from "multer";

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

        this.router.route(
            '/:challengeId').post(
            ValidationMiddleware(z.object({
                challengeId: z.uuid(),
            }), "params"),
            ValidationMiddleware(z.object({
                text: z.string().optional(),
            }), "body"),
            this.uploadMiddleware,
            this.validateFileSubmission, // Add this new middleware
            this.markChallenge
        ).get(
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

    uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
        const challengeId = req.params.challengeId;

        let challenge = await this.challengeService.queries.getChallenge.handle(challengeId)

        if (challenge.submissionFormat != "image" && challenge.submissionFormat != "video" && challenge.submissionFormat != "audio") {
            const textUpload = multer().none();
            return textUpload(req, res, (err: any) => {
                if (err) return next(err);
                next();
            });
        }

        (req as any).challenge = challenge;

        const uploadHandler = CreateUploadMiddleware(challenge.submissionFormat);
        uploadHandler(req, res, (err: any) => {
            if (err) {
                return next(err);
            }
            next();
        });
    }

    validateFileSubmission = async (req: Request, res: Response, next: NextFunction) => {
        const challenge = (req as any).challenge;

        if (!challenge) {
            return next();
        }

        if ((challenge.submissionFormat == "image" || challenge.submissionFormat == "audio") && !req.file) {
            throw new BadRequestError(`provide ${challenge.submissionFormat} submission`)
        }

        if (challenge.submissionFormat == "video") {
            if (!req.file?.path) {
                throw new BadRequestError("provide video submission")
            }

            const duration = await GetVideoDuration(req.file.path);

            if (duration > this.appSecrets.maxVideoLength) {
                throw new BadRequestError("video submission too long")
            }
        }

        next();
    }

    markChallenge = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
        const challengeId = req.params.challengeId;
        const parameters: markChallengeParameters = {id: challengeId, userId: creator}
        if (req.body.text) parameters.text = req.body.text
        if (req.file) {
            parameters.filePath = req.file.path
            parameters.fileMimeType = req.file.mimetype
        }
        const {pass, feedback} = await this.challengeService.commands.markChallenge.handle(parameters)
        if (req.file) {
            fs.unlink(req.file.path, () => {
            });
        }
        new SuccessResponse(res, {pass, feedback}).send();
    }
}