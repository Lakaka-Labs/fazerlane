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
import * as fs from "node:fs/promises";
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

    // Cleanup middleware to delete files after response
    private cleanupFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const cleanup = async () => {
            try {
                if (req.files && Array.isArray(req.files)) {
                    for (const file of req.files as Express.Multer.File[]) {
                        try {
                            await fs.unlink(file.path);
                        } catch (error) {
                            console.error(`Error deleting file ${file.path}:`, error);
                        }
                    }
                }

                if (req.file) {
                    try {
                        await fs.unlink(req.file.path);
                    } catch (error) {
                        console.error(`Error deleting file ${req.file.path}:`, error);
                    }
                }
            } catch (error) {
                console.error('Error during file cleanup:', error);
            }
        };

        res.on('finish', () => {
            cleanup();
        });

        res.on('close', () => {
            cleanup();
        });

        next();
    };

    // Error handler middleware for cleanup on errors
    private errorCleanupMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
        // Clean up files if there's an error
        try {
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files as Express.Multer.File[]) {
                    try {
                        await fs.unlink(file.path);
                        console.log(`Cleaned up file after error: ${file.path}`);
                    } catch (cleanupError) {
                        console.error(`Error cleaning up file ${file.path}:`, cleanupError);
                    }
                }
            }

            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                    console.log(`Cleaned up file after error: ${req.file.path}`);
                } catch (cleanupError) {
                    console.error(`Error cleaning up file ${req.file.path}:`, cleanupError);
                }
            }
        } catch (error) {
            console.error('Error during error cleanup:', error);
        }

        next(err);
    };

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
                this.uploadMiddleware,
                this.validateFileSubmission,
                this.cleanupFilesMiddleware, // Add cleanup middleware here
                this.markChallenge,
                this.errorCleanupMiddleware // Error cleanup as last middleware
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

    uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.challengeId) throw new BadRequestError("provide challenge id")
        const challengeId = req.params.challengeId;

        let challenge = await this.challengeService.queries.getChallenge.handle(challengeId)
        if (
            !challenge.submissionFormat.includes("image") &&
            !challenge.submissionFormat.includes("video") &&
            !challenge.submissionFormat.includes("audio")
        ) {
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

        if ((challenge.submissionFormat.includes("image") ||
            challenge.submissionFormat.includes("audio")) && (!req.files || (req.files as Express.Multer.File[]).length < 1)) {
            throw new BadRequestError(`provide ${challenge.submissionFormat} submission`)
        }

        if (challenge.submissionFormat == "video") {
            let duration = 0
            if (!req.files || (req.files as Express.Multer.File[]).length < 1) throw new BadRequestError("provide at least one file")
            for (const file of (req.files as Express.Multer.File[])) {
                duration += await GetVideoDuration(file.path);
            }
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
        if (req.body.comment) parameters.comment = req.body.comment
        if (req.files) {
            parameters.files = []; // Initialize the array first
            for (const file of req.files as Express.Multer.File[]) {
                parameters.files.push({
                    filePath: file.path,
                    fileMimeType: file.mimetype
                })
            }
        }
        const {pass, feedback} = await this.challengeService.commands.markChallenge.handle(parameters)
        new SuccessResponse(res, {pass, feedback}).send();
    }
}