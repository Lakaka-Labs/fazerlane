import type StorageService from "../../../services/storage";
import {type NextFunction, type Request, type Response, Router} from "express";
import {SuccessResponse} from "../../../../packages/responses/success.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";
import type {User} from "../../../domain/user";
import {CreateUploadMiddleware} from "../middlewares/upload.ts";
import type AppSecrets from "../../../../packages/secret";
import * as fs from "node:fs/promises";
import type {FileParameter} from "../../../domain/objects";

export default class StorageHandler {
    storageService: StorageService
    router = Router()

    constructor(storageService: StorageService) {
        this.storageService = storageService

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
                        }
                    }
                }

                if (req.file) {
                    try {
                        await fs.unlink(req.file.path);
                    } catch (error) {
                    }
                }
            } catch (error) {
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
                    } catch (cleanupError) {
                    }
                }
            }

            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (cleanupError) {
                }
            }
        } catch (error) {
        }

        next(err);
    };

    private configureRoutes() {
        this.router.route('/')
            .post(
                this.uploadMiddleware,
                this.cleanupFilesMiddleware, // Add cleanup middleware here
                this.upload,
                this.errorCleanupMiddleware // Error cleanup as last middleware
            )
    }


    uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const uploadHandler = CreateUploadMiddleware(["image", "audio", "video", "text", "code"]);
        uploadHandler(req, res, (err: any) => {
            if (err) {
                return next(err);
            }
            next();
        });
    }

    upload = async (req: Request, res: Response) => {
        const creator = (req.user as User).id;
        const files: FileParameter[] = []

        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                files.push({
                    path: file.path,
                    mimeType: file.mimetype
                })
            }
        }
        const ids = await this.storageService.commands.upload.handle(files, creator)
        new SuccessResponse(res, {ids}).send();
    }
}