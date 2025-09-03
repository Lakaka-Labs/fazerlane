import {StatusCodes} from "http-status-codes";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class UnAuthorizedError extends AppError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}