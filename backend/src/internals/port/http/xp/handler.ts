import type XPService from "../../../services/xp";
import {type Request, type Response, Router} from "express";
import {SuccessResponse} from "../../../../packages/responses/success.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import type {User} from "../../../domain/user";
import {z} from "zod";
import type {XPFilter} from "../../../domain/xp";
import type BaseFilter from "../../../../packages/types/filter";

export default class XPHandler {
    xpService: XPService
    router = Router()

    constructor(xpService: XPService) {
        this.xpService = xpService
        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.get(
            '/',
            ValidationMiddleware(z.object({
                page: z.number().default(1),
                limit: z.number().default(20),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
                minAmount: z.number().optional(),
                maxAmount: z.number().optional(),
            }), "query"),
            this.getXPs
        );
        this.router.get(
            '/streak',
            ValidationMiddleware(z.object({
                page: z.number().default(1),
                limit: z.number().default(30),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
            }), "query"),
            this.getStreaks
        );
    }

    getStreaks = async (req: Request, res: Response) => {
        const filter: BaseFilter = req.query as unknown as BaseFilter
        const userId = (req.user as User).id;
        const dates = await this.xpService.queries.getStreaks.handle(userId, filter)
        new SuccessResponse(res, {dates}).send();
    }

    getXPs = async (req: Request, res: Response) => {
        const filter: XPFilter = req.query as unknown as BaseFilter
        const userId = (req.user as User).id;
        const xps = await this.xpService.queries.getXPs.handle(userId, filter)
        new SuccessResponse(res, {xps}).send();
    }
}