import type {NextFunction, Request, Response} from "express";
import {UnAuthorizedError} from "../../../../packages/errors";
import {verifyToken} from "../../../../packages/utils/encryption";
import type Payload from "../../../../packages/types/payload";
import AccountServices from "../../../services/authentication";

export const Authorize = (services: AccountServices) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let {token} = req.signedCookies;
        if (!token) {
            token = req.headers.authorization?.split(" ")[1];
        }
        if (!token) {
            token = req.query.token;
        }
        if (!token) throw new UnAuthorizedError("session has expired");

        try {
            const jwtPayload = verifyToken(token);
            const payload: Payload = jwtPayload as Payload;

            req.user = await services.queries.getDetails.handle({id: payload.id});
            next();
        } catch (error) {
            throw error;
        }
    };
};

export const AuthorizeRefreshToken = (services: AccountServices) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let {refreshToken} = req.signedCookies;
        if (!refreshToken) {
            refreshToken = req.headers.authorization?.split(" ")[1];
        }
        if (!refreshToken) {
            refreshToken = req.query.refreshToken;
        }
        if (!refreshToken) throw new UnAuthorizedError("session has expired");

        try {
            const jwtPayload = verifyToken(refreshToken);
            const payload: Payload = jwtPayload as Payload;

            req.user = await services.queries.getDetails.handle({id: payload.id});
            next();
        } catch (error) {
            throw error;
        }
    };
};