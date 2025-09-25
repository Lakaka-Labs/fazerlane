import type {Request} from 'express';
import multer, {type StorageEngine} from 'multer';
import path from 'path';
import {BadRequestError} from "../../../../packages/errors";
import type {SubmissionFormat} from "../../../domain/challenge";

const FILE_CONFIG: Record<SubmissionFormat, { exts: string[], size: number }> = {
    image: {exts: ['.jpg', '.jpeg', '.png', '.gif', '.webp','.mp4', '.mpeg', '.webm', '.mov'], size: 1024 * 1024 * 1024},
    video: {exts: ['.mp4', '.mpeg', '.webm', '.mov'], size: 1024 * 1024 * 1024},
    audio: {exts: ['.mp3', '.wav', '.ogg', '.m4a'], size: 1024 * 1024 * 1024},
    text: {
        exts: [],
        size: 0
    },
    code: {
        exts: [],
        size: 0
    }
};

const storage: StorageEngine = multer.diskStorage({
    destination: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const type = Object.entries(FILE_CONFIG).find(([_, cfg]) =>
            cfg.exts.includes(ext)
        )?.[0] || 'misc';
        cb(null, `uploads`);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const CreateUploadMiddleware = (types: SubmissionFormat[]) => {
    const allowedExts = types.flatMap(type => FILE_CONFIG[type].exts);
    const maxSize = Math.max(...types.map(type => FILE_CONFIG[type].size));

    return multer({
        storage,
        fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowedExts.includes(ext)) {
                cb(null, true);
            } else {
                cb(new BadRequestError(`Invalid file type. Allowed: ${allowedExts.join(', ')}`));
            }
        },
        limits: {fileSize: maxSize},
    }).array('files', 5);
};