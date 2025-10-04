import type {NextFunction, Request, Response} from "express";
import type {z, ZodTypeAny} from "zod";

type RequestData = "body" | "query" | "params" | "headers" | "url";

const ValidationMiddleware = (
    schema: ZodTypeAny,
    reqData: RequestData
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[reqData]);
            req[reqData] = parsed
            next();
        } catch (error) {
            throw error;
        }
    };
};

export default ValidationMiddleware;